import { INodeProperties, INodeType, INodeTypeDescription } from 'n8n-workflow';
import properties from './properties.json';

export class InboxApp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'InboxApp',
		name: 'inboxApp',
		icon: 'file:inboxapp.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage conversations, contacts, threads, and messages with InboxApp',
		defaults: {
			name: 'InboxApp',
		},
		usableAsTool: true,
		inputs: [{ type: 'main' }],
		outputs: [{ type: 'main' }],
		credentials: [
			{
				name: 'inboxAppApi',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			baseURL: 'https://inboxapp.com/api/v2',
			arrayFormat: 'repeat',
		},
		properties: properties as unknown as INodeProperties[],
	};
}
