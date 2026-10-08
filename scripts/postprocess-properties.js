const fs = require('fs');
const path = require('path');

const PROPERTIES_PATH = path.join(__dirname, '..', 'nodes', 'InboxApp', 'properties.json');
const OPENAPI_PATH = path.join(__dirname, '..', 'nodes', 'InboxApp', 'openapi.json');

const properties = JSON.parse(fs.readFileSync(PROPERTIES_PATH, 'utf8'));
const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));

function resolve(schema) {
	let current = schema;
	while (current && current.$ref) {
		current = openapi.components.schemas[current.$ref.split('/').pop()];
	}
	return current || {};
}

// Operation value -> OpenAPI operation, through the method and path of the operation selectors
const operations = {};
for (const prop of properties) {
	if (prop.name !== 'operation' || prop.type !== 'options') continue;
	for (const option of prop.options) {
		const { method, url } = option.routing.request;
		const openapiPath = url.replace(/^=/, '').replace(/\{\{\$parameter\["(\w+)"\]\}\}/g, '{$1}');
		operations[option.value] = openapi.paths[openapiPath][method.toLowerCase()];
	}
}

function titleCase(value) {
	return value
		.replace(/[._]/g, ' ')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// The API takes several values as a repeated key (?expand=a&expand=b), which the node sends
// from an array value. The generator emits these as raw JSON strings instead.
function fixQueryParameter(prop, parameter) {
	const schema = resolve(parameter.schema);

	if (schema.type === 'array') {
		const items = resolve(schema.items);
		if (items.enum) {
			prop.type = 'multiOptions';
			prop.options = items.enum.map((value) => ({ name: titleCase(value), value }));
		} else {
			prop.type = 'string';
			prop.typeOptions = { multipleValues: true };
		}
		prop.default = [];
		if (prop.description) {
			prop.description = prop.description
				.replace(' Repeat the key to match any of several.', ' Add several to match any of them.')
				.replace(/^Repeat the key to match any of several\.$/, 'Add several to match any of them.')
				.replace(', repeating the key for up to', ', adding up to');
		}
	}

	if (schema.type === 'integer' && prop.name === 'limit') {
		const defaultMatch = /Defaults to (\d+)/.exec(schema.description || '');
		if (defaultMatch) prop.default = Number(defaultMatch[1]);
		prop.typeOptions = { minValue: schema.minimum, maxValue: schema.maximum };
	}
}

// A body field that is a union of objects tagged by `type` gets a template and the list of its shapes
function fixTaggedUnion(prop, schema) {
	const variants = (schema.anyOf || []).map(resolve);
	if (variants.length === 0 || !variants.every((variant) => variant.properties?.type?.enum)) return;

	const shapes = variants.map((variant) => {
		const shape = {};
		for (const key of variant.required) {
			shape[key] = key === 'type' ? variant.properties.type.enum[0] : '';
		}
		return shape;
	});

	prop.default = JSON.stringify(shapes[0], null, 2);
	prop.description = `One of: ${shapes.map((shape) => JSON.stringify(shape)).join(', ')}`;
}

for (const prop of properties) {
	const show = prop.displayOptions && prop.displayOptions.show;
	const operation = show && show.operation && operations[show.operation[0]];
	const send = prop.routing && prop.routing.send;
	if (!operation || !send) continue;

	if (send.type === 'query') {
		const parameter = (operation.parameters || []).find(
			(candidate) => candidate.in === 'query' && candidate.name === send.property,
		);
		if (parameter) fixQueryParameter(prop, parameter);
	}

	if (send.type === 'body' && prop.type === 'json') {
		const body = resolve(operation.requestBody?.content?.['application/json']?.schema);
		const field = body.properties && body.properties[send.property];
		if (field) fixTaggedUnion(prop, resolve(field));
	}
}

function getOperationKey(prop) {
	const show = prop.displayOptions && prop.displayOptions.show;
	if (!show || !show.resource || !show.operation) return null;
	return `${show.resource[0]}::${show.operation[0]}`;
}

function isTopLevel(prop) {
	// Resource selector
	if (prop.name === 'resource' && prop.type === 'options' && !prop.displayOptions) return true;

	// Operation selectors
	if (prop.name === 'operation' && prop.type === 'options') return true;

	// Notice types (endpoint hints)
	if (prop.type === 'notice') return true;

	// Required fields
	if (prop.required === true) return true;

	// Path parameters (no routing = used in URL template, not sent as body/query)
	if (!prop.routing) return true;

	return false;
}

const topLevel = [];
const optionalByOp = {};

for (const prop of properties) {
	if (isTopLevel(prop)) {
		topLevel.push(prop);
	} else {
		const key = getOperationKey(prop);
		if (!key) {
			// No operation key — keep at top level as safety fallback
			topLevel.push(prop);
			continue;
		}
		if (!optionalByOp[key]) {
			optionalByOp[key] = [];
		}
		optionalByOp[key].push(prop);
	}
}

// Build the final output: top-level fields + one "Additional Fields" collection per operation
const result = [...topLevel];

for (const [key, fields] of Object.entries(optionalByOp)) {
	if (fields.length === 0) continue;

	const [resource, operation] = key.split('::');

	// Strip displayOptions from each option (the collection provides it)
	const options = fields.map(({ displayOptions, ...rest }) => rest);

	result.push({
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [resource],
				operation: [operation],
			},
		},
		options,
	});
}

fs.writeFileSync(PROPERTIES_PATH, JSON.stringify(result, null, '\t'));

const topCount = topLevel.length;
const collectionCount = Object.keys(optionalByOp).length;
const optionalCount = Object.values(optionalByOp).reduce((sum, arr) => sum + arr.length, 0);
console.log(
	`Postprocessed: ${topCount} top-level, ${collectionCount} collections with ${optionalCount} optional fields`
);
