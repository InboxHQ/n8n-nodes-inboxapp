# n8n-nodes-inboxapp

[n8n](https://n8n.io/) community node for [InboxApp](https://inboxapp.com) — the Social Selling CRM for X (Twitter).

Automate your DM outreach, manage conversations, and build sales pipelines directly from n8n workflows.

![InboxApp + n8n](https://img.shields.io/badge/InboxApp-n8n-blue?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Platform Support

| Platform | Status |
|----------|--------|
| **X (Twitter)** | ✅ Fully supported |
| **Instagram** | 🔜 Coming soon |
| **LinkedIn** | 🔜 Coming soon |

## What You Can Do

### 💬 Send & Manage DMs
- **Send direct messages** to any X user through your connected accounts
- **Reply to conversations** — continue existing DM threads
- **List conversations** — pull all your DM threads with filtering and pagination
- **Look up threads** by user ID or username
- **Delete messages** you've sent
- **Add reactions** to messages

### 👥 Manage Prospects (Leads)
- **Look up prospects** by platform ID
- **Update prospect context** — add notes and custom data to profiles
- **Access full profile data** — bio, location, follower counts, verification status

### 🏷️ Organize with Tags & Statuses
- **Create, update, and delete tags** to label your prospects
- **Manage deal statuses** — build your own sales pipeline stages
- **Assign colors** to tags and statuses for visual organization

### 👤 Team & Accounts
- **View team info** and members
- **List connected X accounts** linked to your workspace
- **Track events** across your workspace

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
Trigger → InboxApp (Lookup Thread by Username) → InboxApp (Send Message)
```

1. Add an **InboxApp** node → select **Threads → Lookup by Username**
2. Enter the X username of the person you want to DM
3. Add another **InboxApp** node → select **Messages → Send Message**
4. Use the thread ID from the previous step
5. Write your message and run

#### Auto-Reply to New Conversations

```
Schedule Trigger → InboxApp (List Threads) → Filter (unread) → InboxApp (Send Message)
```

#### Sync Prospects to Your CRM

```
Schedule Trigger → InboxApp (List Threads) → InboxApp (Get Prospect) → HTTP Request (CRM API)
```

#### Tag Prospects Based on Keywords

```
Schedule Trigger → InboxApp (List Threads) → IF (keyword match) → InboxApp (Update Prospect Context)
```

## Available Operations

| Resource | Operations |
|----------|-----------|
| **Threads** | List, Create, Get, Update, Delete, Lookup by ID, Lookup by Username |
| **Messages** | List, Send, Update, Delete, View Edit History, Add/Remove Reactions |
| **Prospects** | Get, Lookup, Update Context |
| **Tags** | List, Create, Get, Update, Delete |
| **Statuses** | List, Create, Get, Update, Delete |
| **Account Links** | List |
| **Members** | List, Get |
| **Team** | Get Info |
| **Events** | List |
| **Colors** | List (for tags & statuses) |

## Example: DM Outreach Workflow

A complete outreach workflow might look like:

1. **Trigger** — New row in Google Sheets (your lead list)
2. **InboxApp: Lookup by Username** — Find or create the DM thread
3. **InboxApp: Send Message** — Send your personalized outreach DM
4. **InboxApp: Create Tag** — Tag the prospect as "Outreach - Week 1"
5. **Wait** — Pause for follow-up timing
6. **InboxApp: Send Message** — Send follow-up if no reply

This replaces hours of manual DMing with a fully automated pipeline.

## API Docs

Full API documentation: [inboxapp.com/docs/api](https://inboxapp.com/docs/api)

## Links

- 🌐 [InboxApp](https://inboxapp.com)
- 📖 [API Documentation](https://inboxapp.com/docs/api)
- 🐛 [Report Issues](https://github.com/inboxhq/n8n-nodes-inboxapp/issues)
- 💬 [n8n Community](https://community.n8n.io/)

## License

[MIT](LICENSE.md)
