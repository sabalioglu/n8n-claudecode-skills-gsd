# n8n Claude Code Skills & Development Toolkit

**A comprehensive toolkit for building n8n workflows with AI-powered development tools**

This repository combines three powerful projects for automated workflow development with Claude Code and n8n:

## 📦 What's Inside

### 1. [Get Shit Done (GSD)](./getshitdone/)
**Meta-prompting and spec-driven development system for Claude Code**

A lightweight and powerful system for building projects consistently using Claude Code. No enterprise theater - just an incredibly effective workflow that gives Claude everything it needs to do the work and verify it.

**Key Features:**
- 🎯 Context engineering layer for reliable Claude Code execution
- 📝 XML prompt formatting optimized for Claude
- 🔄 Subagent orchestration for consistent quality
- ✅ Atomic Git commits for better traceability
- 📊 Modular phase-based development

[→ Read more about Get Shit Done](./getshitdone/README.md)

---

### 2. [n8n Skills](./n8n-skills/)
**Expert Claude Code skills for building flawless n8n workflows**

7 complementary skills that teach AI assistants how to build production-ready n8n workflows using the n8n-mcp MCP server.

**Included Skills:**
1. **n8n Expression Syntax** - Correct expression syntax and patterns
2. **n8n MCP Tools Expert** - Effective tool usage (HIGHEST PRIORITY)
3. **n8n Workflow Patterns** - 5 proven architectural patterns
4. **n8n Validation Expert** - Error interpretation and fixing
5. **n8n Node Configuration** - Operation-aware configuration
6. **n8n Code JavaScript** - Effective JavaScript in Code nodes
7. **n8n Code Python** - Python limitations and workarounds

**Coverage:**
- 525+ n8n nodes supported
- 2,653+ workflow templates for examples
- 10 production-tested Code node patterns

[→ Read more about n8n Skills](./n8n-skills/README.md)

---

### 3. [n8n-MCP](./n8n-mcp/)
**Model Context Protocol server for comprehensive n8n access**

An MCP server that provides AI assistants with deep knowledge about n8n's workflow automation platform.

**Key Features:**
- 🔌 1,084 n8n nodes (537 core + 547 community)
- 📚 99% property coverage with detailed schemas
- 🎯 63.6% operation coverage
- 📖 87% documentation coverage from official n8n docs
- 🤖 265 AI-capable tool variants with full documentation
- 📦 2,709 workflow templates with 100% metadata coverage

**Deployment Options:**
- Hosted service (dashboard.n8n-mcp.com)
- npx (quick local setup)
- Docker (isolated & reproducible)
- Railway cloud deployment (one-click)

[→ Read more about n8n-MCP](./n8n-mcp/README.md)

---

## 🚀 Quick Start

### For Get Shit Done (GSD)
```bash
npx get-shit-done-cc
```

### For n8n Skills
```bash
# Claude Code
/plugin install czlonkowski/n8n-skills

# Or manual installation
cp -r n8n-skills/skills/* ~/.claude/skills/
```

### For n8n-MCP
```bash
# Run with npx
npx n8n-mcp

# Or with Docker
docker pull ghcr.io/czlonkowski/n8n-mcp:latest
```

---

## 📖 Documentation

Each project has its own comprehensive documentation:

- **GSD Documentation**: [getshitdone/README.md](./getshitdone/README.md)
- **n8n Skills Documentation**: [n8n-skills/docs/](./n8n-skills/docs/)
- **n8n-MCP Documentation**: [n8n-mcp/docs/](./n8n-mcp/docs/)

---

## 🔗 How They Work Together

These three projects create a powerful workflow automation development environment:

1. **Get Shit Done** provides the meta-framework for reliable Claude Code execution
2. **n8n-MCP** gives Claude deep knowledge of n8n nodes and operations
3. **n8n Skills** teaches Claude how to build production-ready workflows

**Example Workflow:**
```
User: "Build a webhook to Slack workflow"
    ↓
GSD: Structures the development process
    ↓
n8n-MCP: Provides node documentation and templates
    ↓
n8n Skills: Guides proper configuration and validation
    ↓
Result: Production-ready n8n workflow ✅
```

---

## 🤝 Contributing

Each project accepts contributions independently. Please refer to individual project documentation:

- [GSD Development](./getshitdone/README.md#contributing)
- [n8n Skills Development](./n8n-skills/docs/DEVELOPMENT.md)
- [n8n-MCP Development](./n8n-mcp/CONTRIBUTING.md)

---

## 📜 License

All projects in this repository are MIT licensed:

- **Get Shit Done**: MIT License - see [getshitdone/LICENSE](./getshitdone/LICENSE)
- **n8n Skills**: MIT License - see [n8n-skills/LICENSE](./n8n-skills/LICENSE)
- **n8n-MCP**: MIT License - see [n8n-mcp/LICENSE](./n8n-mcp/LICENSE)

---

## 🙏 Credits

### Original Authors

- **Get Shit Done**: TCHES / [@glittercowboy](https://github.com/glittercowboy)
- **n8n Skills**: Romuald Czonkowski / [@czlonkowski](https://github.com/czlonkowski)
- **n8n-MCP**: Romuald Czonkowski / [@czlonkowski](https://github.com/czlonkowski)

### This Repository

Forked and combined by [@sabalioglu](https://github.com/sabalioglu) for unified workflow automation development.

---

## ⭐ Support

If you find these tools useful:

- ⭐ Star this repository
- 🐛 Report issues in individual project directories
- 💡 Share your workflows and experiences
- 🤝 Contribute improvements

---

## 📊 Repository Structure

```
n8n-claudecode-skills-gsd/
├── README.md                 # This file
├── getshitdone/             # GSD project files
│   ├── README.md
│   ├── bin/
│   ├── commands/
│   └── ...
├── n8n-skills/              # n8n Skills project files
│   ├── README.md
│   ├── skills/
│   ├── docs/
│   └── ...
└── n8n-mcp/                 # n8n-MCP project files
    ├── README.md
    ├── src/
    ├── docs/
    └── ...
```

---

## 🔧 System Requirements

- **Node.js**: 16.x or higher
- **Claude Code**: Latest version
- **Docker** (optional): For containerized deployments
- **Git**: For version control

---

## 📞 Support & Community

- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **GitHub Issues**: Use individual project issue trackers
- **Documentation**: Comprehensive docs in each project directory

---

**Built with ❤️ for the n8n and Claude Code communities**
