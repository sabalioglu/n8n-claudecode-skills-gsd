# [Project Name]

> [One-line description of what this project does]

---

## Quick Start

```bash
# Clone the repository
git clone [repository-url]
cd [project-name]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

---

## Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Framework] |
| Backend | [Framework] |
| Database | [Database] |
| Hosting | [Platform] |

---

## Project Structure

```
[project-name]/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Route pages
│   ├── api/            # API routes
│   ├── lib/            # Utilities
│   └── types/          # TypeScript types
├── public/             # Static assets
├── tests/              # Test files
├── context/            # Multi-agent handoff files
│   ├── specs.json      # Architecture specs (Claude Code)
│   ├── ui.json         # UI specs (AntiGravity)
│   └── status.json     # Build/test status (Validators)
├── .claude/            # Claude Code settings
├── PROJECT.md          # Project definition
├── REQUIREMENTS.md     # Detailed requirements
├── ROADMAP.md          # Development phases
├── STATE.md            # Session state
└── README.md           # This file
```

---

## Development

### Prerequisites

- Node.js >= 18
- npm >= 9
- [Other requirements]

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `API_KEY` | External API key | Yes |

---

## Multi-Agent Workflow

This project uses the GSD multi-agent workflow:

```
Claude Code          AntiGravity         Validators
    │                    │                   │
    ▼                    ▼                   ▼
specs.json ───────► ui.json ───────► status.json
(architecture)      (components)       (build/test)
```

---

## Contributing

1. Create feature branch from `main`
2. Make changes following project conventions
3. Run tests and linting
4. Submit pull request

---

## License

[License type] - see [LICENSE](LICENSE) for details.

---

## Support

- [Documentation link]
- [Issue tracker link]
- [Contact information]

---

*Built with [Get Shit Done (GSD)](https://github.com/glittercowboy/get-shit-done) methodology*
