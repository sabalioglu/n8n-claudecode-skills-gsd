# Proje Baslat (How to Start a New Project)

> Step-by-step guide to starting a new project with the GSD toolkit

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js >= 18 installed
- [ ] Git installed and configured
- [ ] Claude Code installed
- [ ] Access to this toolkit repository

---

## Quick Start (5 minutes)

### 1. Create Project Directory

```bash
# Create new project
mkdir my-new-project
cd my-new-project

# Initialize git
git init
```

### 2. Copy Project Template

```bash
# From toolkit repo, copy the starter template
cp -r /path/to/toolkit/templates/project-starter/* .
cp -r /path/to/toolkit/templates/project-starter/.* . 2>/dev/null || true
```

### 3. Install GSD

```bash
npx get-shit-done-cc --local
```

### 4. Start Claude Code

```bash
claude
```

### 5. Initialize Project

```
/gsd:new-project
```

---

## Detailed Setup

### Step 1: Project Structure

After copying the template, your project should have:

```
my-new-project/
├── PROJECT.md          # Fill this first!
├── REQUIREMENTS.md     # Define requirements
├── ROADMAP.md          # Will be generated
├── STATE.md            # Will be updated automatically
├── README.md           # Project documentation
├── .mcp.json           # MCP server config
├── .claude/
│   └── settings.json   # Claude Code settings
└── context/
    ├── specs.json      # Architecture (Claude writes)
    ├── ui.json         # UI specs (AntiGravity writes)
    └── status.json     # Build status (Validators write)
```

### Step 2: Configure Environment

Create a `.env` file (add to `.gitignore`!):

```bash
# .env
N8N_MCP_URL=https://your-n8n-instance.com
N8N_MCP_TOKEN=your-api-token
SUPABASE_ACCESS_TOKEN=your-supabase-token
SUPABASE_PROJECT_REF=your-project-ref
```

Load environment:
```bash
source .env
```

### Step 3: Define Your Project

Edit `PROJECT.md` with:

1. **Vision** - What are you building?
2. **Goals** - What should it accomplish?
3. **Scope** - What's in/out of scope?
4. **Technical Constraints** - Stack, requirements
5. **User Types** - Who will use it?

### Step 4: GSD Workflow

```
# 1. Initialize (if not done)
/gsd:new-project

# 2. Create roadmap
/gsd:create-roadmap

# 3. Plan first phase
/gsd:plan-phase 1

# 4. Execute the plan
/gsd:execute-plan

# 5. Check progress
/gsd:progress

# 6. Continue to next phase
/gsd:plan-phase 2
/gsd:execute-plan
```

---

## Project Types

### Greenfield (New Project)

1. Copy template
2. Run `/gsd:new-project`
3. Answer questions about your idea
4. Run `/gsd:create-roadmap`
5. Start building!

### Brownfield (Existing Codebase)

1. Copy template files to existing project
2. Run `/gsd:map-codebase` first
3. Run `/gsd:new-project`
4. GSD will understand your existing code
5. Continue with roadmap

---

## Integrating n8n Workflows

If your project uses n8n:

### 1. Install n8n Skills

```bash
# In Claude Code
/plugin install czlonkowski/n8n-skills
```

### 2. Configure n8n MCP

Ensure `.mcp.json` has n8n configured:

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

### 3. Build Workflows

```
# In Claude Code
Build a webhook that receives order data,
validates it, stores in Supabase, and sends
confirmation to Slack.
```

---

## Using Ralph for Iteration

For complex tasks, use Ralph Wiggum plugin:

```bash
# Start iterative development
/ralph-loop "implement user authentication" --completion-promise "All auth tests pass" --max-iterations 25
```

**Remember:** Always use `--max-iterations`!

---

## Running Validators

After development, validate your build:

```bash
# Run build check
./validators/check-build.sh .

# Run lint check
./validators/check-lint.sh .

# View status
node ./validators/update-status.js status
```

---

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `/gsd:new-project` | Start new project definition |
| `/gsd:create-roadmap` | Generate development roadmap |
| `/gsd:plan-phase N` | Plan specific phase |
| `/gsd:execute-plan` | Execute current plan |
| `/gsd:progress` | Check current progress |
| `/gsd:pause-work` | Save state for later |
| `/gsd:resume-work` | Resume from last session |
| `/gsd:help` | Show all GSD commands |

---

## Troubleshooting

### Commands not found
```bash
# Reinstall GSD
npx get-shit-done-cc@latest --local
```

### MCP not connecting
```bash
# Verify environment variables are set
echo $N8N_MCP_URL
echo $N8N_MCP_TOKEN

# Test MCP directly
npx n8n-mcp
```

### Context files missing
```bash
# Recreate context directory
mkdir -p context
cp /path/to/toolkit/templates/project-starter/context/* ./context/
```

---

## Next Steps

After project setup:

1. **Review** [MCP Setup Guide](./MCP-SETUP.md) for MCP configuration
2. **Read** [Security Best Practices](./SECURITY.md) before production
3. **Check** [Toolkit Usage](./KEMIK-REPO-KULLANIMI.md) for advanced features

---

*Part of the n8n-claudecode-skills-gsd toolkit*
