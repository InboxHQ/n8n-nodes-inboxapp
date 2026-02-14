import { INodeProperties, INodeType, INodeTypeDescription } from 'n8n-workflow';
import properties from './properties.json';

export class InboxApp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'InboxApp',
		name: 'inboxApp',
		icon: 'file:inboxapp.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage X/Twitter DM conversations, prospects, threads, and messages with InboxApp',
		defaults: {
			name: 'InboxApp',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
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
			baseURL: 'https://inboxapp.com/api/v1',
		},
		properties: properties as unknown as INodeProperties[],
	};
}
