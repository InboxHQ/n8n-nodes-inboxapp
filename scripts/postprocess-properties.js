const fs = require('fs');
const path = require('path');

const PROPERTIES_PATH = path.join(__dirname, '..', 'nodes', 'InboxApp', 'properties.json');

const properties = JSON.parse(fs.readFileSync(PROPERTIES_PATH, 'utf8'));

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
