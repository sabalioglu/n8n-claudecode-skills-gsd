# Kemik Repo Kullanimi (Toolkit Repository Usage)

> How to use the n8n-claudecode-skills-gsd toolkit repository

---

## What is This Repository?

This is a **kemik repo** (skeleton/toolkit repository) - a template repository containing all the tools, configurations, and templates needed to start new AI-powered development projects.

**Components included:**
- **Get Shit Done (GSD)** - Meta-prompting and spec-driven development
- **n8n Skills** - Claude Code skills for n8n workflow building
- **n8n-MCP** - Model Context Protocol server for n8n
- **Ralph Wiggum** - Iterative AI development plugin
- **Project Templates** - Ready-to-use project starters
- **Validators** - Build, lint, and test checkers
- **MCP Configs** - Pre-configured MCP server templates

---

## Repository Structure

```
n8n-claudecode-skills-gsd/
├── getshitdone/              # GSD methodology
├── n8n-skills/               # Claude Code skills
├── n8n-mcp/                  # MCP server
├── plugins/
│   └── ralph-wiggum/         # Iterative development
├── templates/
│   ├── project-starter/      # New project template
│   │   ├── PROJECT.md
│   │   ├── REQUIREMENTS.md
│   │   ├── ROADMAP.md
│   │   ├── STATE.md
│   │   ├── README.md
│   │   ├── .mcp.json
│   │   ├── .claude/
│   │   └── context/
│   └── validators/           # Validation scripts
├── .mcp-config-templates/    # MCP configurations
├── docs/                     # Documentation
└── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sabalioglu/n8n-claudecode-skills-gsd.git
cd n8n-claudecode-skills-gsd
```

### 2. Install GSD (Get Shit Done)

```bash
npx get-shit-done-cc
```

### 3. Install n8n Skills

```bash
# For Claude Code
/plugin install czlonkowski/n8n-skills

# Or manually
cp -r n8n-skills/skills/* ~/.claude/skills/
```

### 4. Configure MCP Servers

```bash
# Copy the MCP config template
cp .mcp-config-templates/n8n-mcp.json ~/.claude/.mcp.json

# Set environment variables
export N8N_MCP_URL='https://your-n8n.com'
export N8N_MCP_TOKEN='your-token'
```

---

## Using This as a Template

### Create a New Project

1. **Copy the project starter template:**
   ```bash
   cp -r templates/project-starter/ /path/to/new-project/
   ```

2. **Initialize git:**
   ```bash
   cd /path/to/new-project
   git init
   ```

3. **Fill in the templates:**
   - Edit `PROJECT.md` with your project vision
   - Define requirements in `REQUIREMENTS.md`
   - Create roadmap in `ROADMAP.md`

4. **Start development with GSD:**
   ```bash
   /gsd:new-project
   /gsd:create-roadmap
   /gsd:plan-phase 1
   /gsd:execute-plan
   ```

---

## Multi-Agent Workflow

The toolkit supports a multi-agent development workflow:

```
┌─────────────────────────────────────────────────────────┐
│                     Human (You)                         │
│              Define vision & requirements               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Claude Code                          │
│         Architecture, data model, backend logic         │
│                Writes: specs.json                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    AntiGravity                          │
│          UI components, layouts, styling                │
│                 Writes: ui.json                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Validators                           │
│           Build, test, lint verification                │
│                Writes: status.json                      │
└─────────────────────────────────────────────────────────┘
```

---

## Environment Variables

Always use environment variables for sensitive data:

| Variable | Description |
|----------|-------------|
| `N8N_MCP_URL` | Your n8n instance URL |
| `N8N_MCP_TOKEN` | n8n API token |
| `SUPABASE_ACCESS_TOKEN` | Supabase access token |
| `SUPABASE_PROJECT_REF` | Supabase project reference |

**Never commit tokens to git!**

---

## Related Documentation

- [How to Start a New Project](./PROJE-BASLAT.md)
- [MCP Server Setup](./MCP-SETUP.md)
- [Security Best Practices](./SECURITY.md)

---

## Support

- **Issues:** https://github.com/sabalioglu/n8n-claudecode-skills-gsd/issues
- **GSD Documentation:** [getshitdone/README.md](../getshitdone/README.md)
- **n8n Skills Documentation:** [n8n-skills/README.md](../n8n-skills/README.md)

---

*Part of the n8n-claudecode-skills-gsd toolkit*
