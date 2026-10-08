import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InboxAppApi implements ICredentialType {
	name = 'inboxAppApi';

	displayName = 'InboxApp API';

	icon: Icon = 'file:icons/inboxapp.svg';

	documentationUrl = 'https://docs.inboxapp.com/v2/developer-api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://inboxapp.com/api/v2',
			url: '/team',
			method: 'GET',
		},
	};
}
