# n8n-nodes-inboxapp

[n8n](https://n8n.io/) community node for [InboxApp](https://inboxapp.com), the Social Selling CRM.

Automate your DM outreach, manage conversations, and build sales pipelines directly from n8n workflows.

![InboxApp + n8n](https://img.shields.io/badge/InboxApp-n8n-blue?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

This node uses the [InboxApp API v2](https://docs.inboxapp.com/v2/developer-api).

## Platform Support

Every platform uses the same resources. X (Twitter) is available to every team, and a team may have others enabled. **Platforms → Platforms List** returns the platforms your team can use and what each one supports.

## What You Can Do

### 💬 Send & Manage DMs
- **Send direct messages** to a thread, a contact, or a platform user through your connected accounts
- **Send safely** with an idempotency key, so a retried run never sends twice
- **List conversations** with filters for folder, account, contact, tag, status and assignee
- **Edit, unsend and react to messages**, and read a message's edit history
- **Archive, assign and mark threads** as unread

### 👥 Manage Contacts
- **Find contacts** by platform ID or username
- **Update contacts**: status, notes, valuation and default assignee
- **Add and remove tags** on a contact
- **Expand related resources**, such as a thread's contact and profile, in the same call

### 🏷️ Organize with Tags & Statuses
- **Create, update, and delete tags** to label your contacts
- **Manage statuses** to build your own sales pipeline stages
- **Assign colors** to tags and statuses for visual organization

### 👤 Team & Accounts
- **View team info** and members
- **List connected accounts** linked to your workspace
- **Replay events** across your workspace

## Getting Started

### 1. Get Your API Key

1. Log in to [InboxApp](https://inboxapp.com)
2. Go to **Settings → API**
3. Generate an API key for your team

### 2. Install the Node

In your n8n instance, go to **Settings → Community Nodes** and install:

```
n8n-nodes-inboxapp
```

Or install manually:

```bash
cd ~/.n8n
npm install n8n-nodes-inboxapp
```

### 3. Add Your Credentials

1. In n8n, go to **Credentials → Add Credential**
2. Search for **InboxApp API**
3. Paste your API key
4. Save

### 4. Build Your First Workflow

Here are some common workflows to get you started:

#### Send a DM to a New Lead

```
Trigger → InboxApp (Messages Send)
```

1. Add an **InboxApp** node → select **Messages → Messages Send**
2. Set **Target** to the person's platform ID: `{ "type": "profile", "accountLinkId": "…", "platform": "twitter", "platformId": "…" }`
3. Write your message
4. Under **Additional Fields**, set **Idempotency Key** to a value unique to this lead, so a retried run never sends twice

**Target** also takes an existing thread, `{ "type": "thread", "threadId": "…" }`, or a contact, `{ "type": "contact", "accountLinkId": "…", "contactId": "…" }`.

#### Auto-Reply to New Conversations

```
Schedule Trigger → InboxApp (Threads List, Folder: No Reply) → InboxApp (Messages Send)
```

#### Sync Contacts to Your CRM

```
Schedule Trigger → InboxApp (Threads List, Expand: contact,profile) → HTTP Request (CRM API)
```

#### Tag Contacts Based on Keywords

```
Schedule Trigger → InboxApp (Threads List) → IF (keyword match) → InboxApp (Contacts Add Tag)
```

## Available Operations

| Resource | Operations |
|----------|-----------|
| **Platforms** | List |
| **Threads** | List, Get, Update, Delete, Typing |
| **Messages** | List, Get, Send, Edit, Unsend, History, React, Unreact, Attachment |
| **Contacts** | List, Get, Update, Add Tag, Remove Tag |
| **Tags** | List, Create, Get, Update, Delete |
| **Statuses** | List, Create, Get, Update, Delete |
| **Account Links** | List, Get |
| **Team** | Get, List Members, Get Member |
| **Events** | List |
| **Colors** | List (for tags & statuses) |

List operations return `{ data, nextCursor }`. To read the next page, pass `nextCursor` as **Cursor** under **Additional Fields**, with the same filters.

## Example: DM Outreach Workflow

A complete outreach workflow might look like:

1. **Trigger** — New row in Google Sheets (your lead list)
2. **InboxApp: Messages Send** — Send your personalized outreach DM to the lead's platform ID
3. **InboxApp: Contacts Add Tag** — Tag the contact as "Outreach - Week 1"
4. **Wait** — Pause for follow-up timing
5. **InboxApp: Messages Send** — Send a follow-up to the thread if there is no reply

This replaces hours of manual DMing with a fully automated pipeline.

## Upgrading from API v1

Earlier versions of this node called API v1. The same API key works on v2, but operations and fields changed, so existing workflows need their InboxApp nodes set up again:

- **Prospects** are now **Contacts**. Look one up with **Contacts List**, filtered by platform and platform ID or username.
- **Threads Lookup** and **Lookup by Username** are gone. Use **Contacts List**, then **Threads List** filtered by contact.
- **Threads Create** and **Quick Send** are gone. **Messages Send** takes a thread, contact or profile target.
- **Members** moved under **Team**.
- Thread `done` is now `archived`, and list operations return `{ data, nextCursor }`.

See the [migration guide](https://docs.inboxapp.com/v2/migrating-from-v1) for every change.

## API Docs

Full API documentation: [docs.inboxapp.com/v2/developer-api](https://docs.inboxapp.com/v2/developer-api)

## Links

- 🌐 [InboxApp](https://inboxapp.com)
- 📖 [API Documentation](https://docs.inboxapp.com/v2/developer-api)
- 🐛 [Report Issues](https://github.com/inboxhq/n8n-nodes-inboxapp/issues)
- 💬 [n8n Community](https://community.n8n.io/)

## License

[MIT](LICENSE.md)
