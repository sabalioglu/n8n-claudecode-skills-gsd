# n8n Claude Code Skills & Development Toolkit

> **Kemik Repo** (Skeleton/Toolkit Repository) - A comprehensive template for AI-powered multi-agent development projects

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

---

## What is This?

This is a **kemik repo** (toolkit repository) containing all the tools, templates, configurations, and documentation needed to start new AI-powered development projects. It combines proven methodologies for reliable Claude Code execution with n8n workflow automation.

**Use this repository to:**
- Start new projects with best-practice templates
- Configure multi-agent development workflows
- Integrate n8n workflows with Claude Code
- Set up MCP servers for external tool access
- Implement iterative AI development with Ralph Wiggum

---

## Components

| Component | Description | Location |
|-----------|-------------|----------|
| **Get Shit Done (GSD)** | Meta-prompting and spec-driven development | [`/getshitdone`](./getshitdone/) |
| **n8n Skills** | Claude Code skills for n8n workflow building | [`/n8n-skills`](./n8n-skills/) |
| **n8n-MCP** | Model Context Protocol server for n8n | [`/n8n-mcp`](./n8n-mcp/) |
| **Ralph Wiggum** | Iterative AI development plugin | [`/plugins/ralph-wiggum`](./plugins/ralph-wiggum/) |
| **Project Templates** | Ready-to-use project starters | [`/templates`](./templates/) |
| **Validators** | Build, lint, and test checkers | [`/templates/validators`](./templates/validators/) |
| **MCP Configs** | Pre-configured MCP server templates | [`/.mcp-config-templates`](./.mcp-config-templates/) |

---

## Multi-Agent Workflow

This toolkit supports a multi-agent development workflow where specialized agents collaborate through handoff files:

```
                    ┌─────────────────────┐
                    │      Human (You)    │
                    │   Vision & Goals    │
                    └──────────┬──────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                         Claude Code                              │
│                                                                  │
│  Responsibilities:                                               │
│  - Architecture design                                           │
│  - Data model definition                                         │
│  - Backend logic implementation                                  │
│  - API development                                               │
│                                                                  │
│  Writes: context/specs.json                                      │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                        AntiGravity                               │
│                                                                  │
│  Responsibilities:                                               │
│  - UI component development                                      │
│  - Layout and styling                                            │
│  - User experience                                               │
│  - Frontend implementation                                       │
│                                                                  │
│  Reads: context/specs.json                                       │
│  Writes: context/ui.json                                         │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                         Validators                               │
│                                                                  │
│  Responsibilities:                                               │
│  - Build verification                                            │
│  - Test execution                                                │
│  - Lint checking                                                 │
│  - Status reporting                                              │
│                                                                  │
│  Writes: context/status.json                                     │
└──────────────────────────────────────────────────────────────────┘
```

**Handoff Files:**
- `specs.json` - Architecture and data model (Claude Code writes)
- `ui.json` - UI components and layouts (AntiGravity writes)
- `status.json` - Build/test/lint results (Validators write)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sabalioglu/n8n-claudecode-skills-gsd.git
cd n8n-claudecode-skills-gsd
```

### 2. Install GSD

```bash
npx get-shit-done-cc
```

### 3. Start a New Project

```bash
# Copy project template
cp -r templates/project-starter/ ../my-new-project/
cd ../my-new-project

# Initialize
git init
npx get-shit-done-cc --local

# Start Claude Code
claude
/gsd:new-project
```

### 4. Configure MCP (Optional)

```bash
# Set environment variables
export N8N_MCP_URL='https://your-n8n.com'
export N8N_MCP_TOKEN='your-token'

# MCP config is in templates/project-starter/.mcp.json
```

---

## Repository Structure

```
n8n-claudecode-skills-gsd/
├── README.md                 # This file
├── getshitdone/              # GSD methodology
│   ├── README.md
│   ├── bin/
│   ├── commands/
│   └── get-shit-done/
├── n8n-skills/               # n8n Claude Code skills
│   ├── README.md
│   ├── skills/
│   └── docs/
├── n8n-mcp/                  # n8n MCP server
│   ├── README.md
│   ├── src/
│   └── docs/
├── plugins/
│   └── ralph-wiggum/         # Iterative development plugin
│       └── README.md
├── templates/
│   ├── project-starter/      # New project template
│   │   ├── PROJECT.md
│   │   ├── REQUIREMENTS.md
│   │   ├── ROADMAP.md
│   │   ├── STATE.md
│   │   ├── README.md
│   │   ├── .mcp.json
│   │   ├── .claude/
│   │   │   └── settings.json
│   │   └── context/
│   │       ├── specs.json
│   │       ├── ui.json
│   │       └── status.json
│   └── validators/           # Validation scripts
│       ├── check-build.sh
│       ├── check-lint.sh
│       └── update-status.js
├── .mcp-config-templates/    # MCP configurations
│   ├── n8n-mcp.json
│   └── supabase-mcp.json
└── docs/                     # Documentation
    ├── KEMIK-REPO-KULLANIMI.md
    ├── PROJE-BASLAT.md
    ├── MCP-SETUP.md
    └── SECURITY.md
```

---

## Usage Instructions

### Starting a New Project

1. **Copy the template:**
   ```bash
   cp -r templates/project-starter/ /path/to/new-project/
   ```

2. **Fill in project definition:**
   - Edit `PROJECT.md` with your vision
   - Define requirements in `REQUIREMENTS.md`

3. **Use GSD workflow:**
   ```
   /gsd:new-project         # Define project
   /gsd:create-roadmap      # Create phases
   /gsd:plan-phase 1        # Plan first phase
   /gsd:execute-plan        # Execute automatically
   ```

### Using n8n Integration

```bash
# Install n8n skills
/plugin install czlonkowski/n8n-skills

# Configure MCP (set env vars first)
# Then Claude can build n8n workflows directly
```

### Running Validators

```bash
# Check build
./templates/validators/check-build.sh .

# Check lint
./templates/validators/check-lint.sh .

# View status
node ./templates/validators/update-status.js status
```

### Using Ralph for Iteration

```bash
# Start iterative loop (always use --max-iterations!)
/ralph-loop "implement feature X" --completion-promise "DONE" --max-iterations 25
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [Toolkit Usage](./docs/KEMIK-REPO-KULLANIMI.md) | How to use this toolkit |
| [Start New Project](./docs/PROJE-BASLAT.md) | Step-by-step project setup |
| [MCP Setup](./docs/MCP-SETUP.md) | Configure n8n and Supabase MCP |
| [Security](./docs/SECURITY.md) | Token management and best practices |

**Component Documentation:**
- [GSD Documentation](./getshitdone/README.md)
- [n8n Skills Documentation](./n8n-skills/README.md)
- [n8n-MCP Documentation](./n8n-mcp/README.md)
- [Ralph Wiggum](./plugins/ralph-wiggum/README.md)

---

## Environment Variables

**Important:** Never hardcode tokens! Always use environment variables.

| Variable | Description |
|----------|-------------|
| `N8N_MCP_URL` | Your n8n instance URL |
| `N8N_MCP_TOKEN` | n8n API token |
| `SUPABASE_ACCESS_TOKEN` | Supabase access token |
| `SUPABASE_PROJECT_REF` | Supabase project reference |

---

## System Requirements

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **Claude Code:** Latest version
- **Git:** For version control
- **Docker** (optional): For containerized MCP servers

---

## Security

- All `.mcp.json` files use environment variables (`${VAR}`) for tokens
- Never commit `.env` files or actual tokens
- See [Security Guide](./docs/SECURITY.md) for best practices
- Enable branch protection for production branches

---

## Contributing

Each component accepts contributions independently:

- [GSD Contributing](./getshitdone/README.md#contributing)
- [n8n Skills Development](./n8n-skills/docs/DEVELOPMENT.md)
- [n8n-MCP Contributing](./n8n-mcp/CONTRIBUTING.md)

---

## License

All projects in this repository are MIT licensed:

- **Get Shit Done:** MIT - [getshitdone/LICENSE](./getshitdone/LICENSE)
- **n8n Skills:** MIT - [n8n-skills/LICENSE](./n8n-skills/LICENSE)
- **n8n-MCP:** MIT - [n8n-mcp/LICENSE](./n8n-mcp/LICENSE)

---

## Credits

### Original Authors

- **Get Shit Done:** TCHES / [@glittercowboy](https://github.com/glittercowboy)
- **n8n Skills:** Romuald Czonkowski / [@czlonkowski](https://github.com/czlonkowski)
- **n8n-MCP:** Romuald Czonkowski / [@czlonkowski](https://github.com/czlonkowski)

### This Repository

Forked, combined, and extended by [@sabalioglu](https://github.com/sabalioglu) for unified multi-agent workflow automation.

---

## Support

- **Issues:** https://github.com/sabalioglu/n8n-claudecode-skills-gsd/issues
- **n8n Community:** [community.n8n.io](https://community.n8n.io)
- **Documentation:** See [/docs](./docs/) folder

---

**Built for the n8n and Claude Code communities**
