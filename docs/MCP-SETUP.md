# MCP Setup Guide

> How to configure n8n and Supabase MCP servers for Claude Code

---

## What is MCP?

**Model Context Protocol (MCP)** is a standard for connecting AI assistants to external tools and data sources. It allows Claude Code to:

- Access your n8n workflows and nodes
- Query and manage Supabase databases
- Read and write files securely
- Connect to other services

---

## Quick Setup

### 1. Create MCP Configuration

Copy the template to your project:

```bash
cp .mcp-config-templates/n8n-mcp.json .mcp.json
```

Or create manually:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "N8N_MCP_BASE_URL": "${N8N_MCP_URL}",
        "N8N_MCP_API_KEY": "${N8N_MCP_TOKEN}"
      }
    }
  }
}
```

### 2. Set Environment Variables

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc)
export N8N_MCP_URL='https://your-n8n-instance.com'
export N8N_MCP_TOKEN='your-api-token-here'
```

### 3. Verify Connection

Start Claude Code and check MCP is active:

```bash
claude
# Should show MCP servers connected
```

---

## n8n MCP Setup

### Option A: Hosted Service (Easiest)

Use the hosted n8n-MCP service:

1. Go to https://dashboard.n8n-mcp.com
2. Create an account
3. Get your API credentials
4. Configure in `.mcp.json`

### Option B: Local npx

Run n8n-MCP locally:

```bash
# Install and run
npx n8n-mcp

# Or with Docker
docker pull ghcr.io/czlonkowski/n8n-mcp:latest
docker run -p 3000:3000 ghcr.io/czlonkowski/n8n-mcp:latest
```

### Option C: Self-Hosted

For production deployments:

```bash
# Railway (one-click deploy)
# Visit: https://railway.app/template/n8n-mcp

# Or Docker Compose
version: '3.8'
services:
  n8n-mcp:
    image: ghcr.io/czlonkowski/n8n-mcp:latest
    environment:
      - N8N_MCP_BASE_URL=${N8N_MCP_URL}
      - N8N_MCP_API_KEY=${N8N_MCP_TOKEN}
    ports:
      - "3000:3000"
```

### Getting n8n API Token

1. Open your n8n instance
2. Go to Settings > API
3. Create new API key
4. Copy the token (shown only once!)
5. Store securely

---

## Supabase MCP Setup

### 1. Get Supabase Credentials

**Access Token:**
1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Name it (e.g., "Claude MCP")
4. Copy immediately (shown only once!)

**Project Reference:**
1. Open your Supabase project
2. Look at URL: `app.supabase.com/project/YOUR_PROJECT_REF`
3. Copy the project reference ID

### 2. Configure MCP

Add to `.mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}",
        "SUPABASE_PROJECT_REF": "${SUPABASE_PROJECT_REF}"
      }
    }
  }
}
```

### 3. Set Environment

```bash
export SUPABASE_ACCESS_TOKEN='your-access-token'
export SUPABASE_PROJECT_REF='your-project-ref'
```

---

## Combined Configuration

For projects using both n8n and Supabase:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "N8N_MCP_BASE_URL": "${N8N_MCP_URL}",
        "N8N_MCP_API_KEY": "${N8N_MCP_TOKEN}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}",
        "SUPABASE_PROJECT_REF": "${SUPABASE_PROJECT_REF}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-server-filesystem",
        "${PROJECT_ROOT}/src",
        "${PROJECT_ROOT}/docs"
      ]
    }
  }
}
```

---

## MCP Capabilities

### n8n MCP Provides:

| Capability | Description |
|------------|-------------|
| Node Documentation | 1,084 n8n nodes with schemas |
| Workflow Templates | 2,709 templates with metadata |
| Operations | 63.6% operation coverage |
| AI Tools | 265 AI-capable tool variants |

### Supabase MCP Provides:

| Capability | Description |
|------------|-------------|
| Database | Query and manage PostgreSQL |
| Auth | Manage users and authentication |
| Storage | File bucket management |
| Edge Functions | Deploy and manage functions |
| Realtime | Configure subscriptions |

---

## Security Best Practices

1. **Never hardcode tokens** in `.mcp.json`
2. **Use environment variables** with `${VAR}` syntax
3. **Add `.env` to `.gitignore`**
4. **Rotate tokens** periodically
5. **Use minimal permissions** when creating tokens
6. **Review MCP logs** for unauthorized access

---

## Troubleshooting

### MCP not connecting

```bash
# Check if environment variables are set
env | grep N8N
env | grep SUPABASE

# Test npx directly
npx n8n-mcp --help
```

### Invalid token

```bash
# Regenerate token in n8n/Supabase dashboard
# Update environment variable
# Restart Claude Code
```

### Permission denied

```bash
# Ensure token has required permissions
# Check n8n API settings
# Verify Supabase token scope
```

### Connection timeout

```bash
# Check network connectivity
curl -v $N8N_MCP_URL

# Verify firewall rules
# Check if n8n instance is running
```

---

## Additional Resources

- **Claude Code MCP Docs:** https://code.claude.com/docs/en/mcp
- **Supabase MCP Guide:** https://supabase.com/docs/guides/getting-started/mcp
- **n8n-MCP Repository:** https://github.com/czlonkowski/n8n-mcp

---

*Part of the n8n-claudecode-skills-gsd toolkit*
