# Security Best Practices

> Token management, branch protection, and production warnings

---

## Token Management

### Golden Rule: Never Hardcode Tokens

```json
// BAD - Never do this!
{
  "env": {
    "API_KEY": "sk-1234567890abcdef"
  }
}

// GOOD - Use environment variables
{
  "env": {
    "API_KEY": "${MY_API_KEY}"
  }
}
```

### Environment Variables

**Setting Variables:**

```bash
# In shell profile (~/.bashrc, ~/.zshrc)
export N8N_MCP_URL='https://your-n8n.com'
export N8N_MCP_TOKEN='your-token'
export SUPABASE_ACCESS_TOKEN='your-token'

# Or in .env file (add to .gitignore!)
N8N_MCP_URL=https://your-n8n.com
N8N_MCP_TOKEN=your-token
```

**Loading .env Files:**

```bash
# Using dotenv
source .env

# Or with direnv (recommended)
# Install direnv, then:
echo 'dotenv' > .envrc
direnv allow
```

### Token Rotation

Rotate tokens regularly:

| Token Type | Rotation Frequency |
|------------|-------------------|
| Development | Monthly |
| Staging | Bi-weekly |
| Production | Weekly |

**Rotation Process:**
1. Generate new token
2. Update environment variable
3. Test new token works
4. Revoke old token
5. Document rotation date

### Secure Storage

**For individuals:**
- Use password manager (1Password, Bitwarden)
- OS keychain (macOS Keychain, Windows Credential Manager)

**For teams:**
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault
- Doppler

---

## Git Security

### .gitignore Essentials

Ensure these are in `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.*.local
*.env

# Secret files
secrets.json
credentials.json
**/secrets/
**/.secrets/

# API keys
*.pem
*.key
*.p12

# Claude/MCP configs with tokens
.mcp.json.local
```

### Pre-commit Hooks

Install git-secrets to prevent accidental commits:

```bash
# Install
brew install git-secrets

# Configure for repo
cd your-project
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'N8N_MCP_TOKEN=[A-Za-z0-9]+'
git secrets --add 'SUPABASE_ACCESS_TOKEN=[A-Za-z0-9]+'
```

### Checking for Leaked Secrets

```bash
# Scan git history
git log -p | grep -i "token\|secret\|api_key\|password"

# Use trufflehog
trufflehog git file://. --only-verified

# Use gitleaks
gitleaks detect --source=.
```

---

## Branch Protection

### Recommended Settings

For production branches (main/master):

1. **Require pull request reviews**
   - At least 1 approval required
   - Dismiss stale reviews on new commits

2. **Require status checks**
   - Build must pass
   - Tests must pass
   - Lint must pass

3. **Require signed commits** (optional but recommended)

4. **Restrict force pushes**
   - Prevent history rewriting

5. **Restrict deletions**
   - Prevent accidental branch deletion

### GitHub Branch Protection Setup

```bash
# Via GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":["build","test"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}'
```

### Environment-Specific Branches

| Branch | Purpose | Protection Level |
|--------|---------|-----------------|
| `main` | Production | Maximum |
| `staging` | Pre-production | High |
| `develop` | Development | Medium |
| `feature/*` | Features | Low |

---

## Production Warnings

### Before Deploying to Production

**Checklist:**

- [ ] All tokens are environment variables
- [ ] No secrets in git history
- [ ] Branch protection enabled
- [ ] CI/CD pipeline validates builds
- [ ] Error handling in place
- [ ] Logging configured (no sensitive data)
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Input validation active

### Production MCP Configuration

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "N8N_MCP_BASE_URL": "${N8N_PROD_URL}",
        "N8N_MCP_API_KEY": "${N8N_PROD_TOKEN}",
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Environment Separation

**Never share tokens between environments!**

```bash
# Development
export N8N_DEV_URL='https://dev.n8n.example.com'
export N8N_DEV_TOKEN='dev-token-xxx'

# Staging
export N8N_STAGING_URL='https://staging.n8n.example.com'
export N8N_STAGING_TOKEN='staging-token-xxx'

# Production
export N8N_PROD_URL='https://n8n.example.com'
export N8N_PROD_TOKEN='prod-token-xxx'
```

---

## Claude Code Security

### Skip Permissions Mode

When using `--dangerously-skip-permissions`:

```bash
# Understand the risks:
# - Claude can execute any command
# - No confirmation prompts
# - Full file system access

# Only use in:
# - Isolated development environments
# - Containers/VMs
# - Trusted projects

# Never use in:
# - Production servers
# - Shared machines
# - Unknown codebases
```

### Alternative: Granular Permissions

For better security, use specific permissions:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(git:*)",
      "Bash(ls:*)",
      "Bash(cat:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(curl:*)",
      "Bash(wget:*)"
    ]
  }
}
```

---

## Incident Response

### If Tokens Are Leaked

**Immediate Actions:**

1. **Revoke immediately**
   ```bash
   # Revoke in n8n/Supabase dashboard
   # Generate new tokens
   ```

2. **Audit access logs**
   - Check for unauthorized access
   - Note suspicious activity

3. **Rotate all related credentials**
   - If one token leaked, others may be compromised

4. **Update all deployments**
   - CI/CD secrets
   - Production configs
   - Team documentation

5. **Document the incident**
   - What happened
   - When discovered
   - Actions taken
   - Prevention measures

### Reporting Security Issues

- **n8n-mcp:** https://github.com/czlonkowski/n8n-mcp/security
- **Supabase:** security@supabase.io
- **This toolkit:** Create private security advisory

---

## Security Checklist

### Development

- [ ] Using environment variables for all secrets
- [ ] .gitignore includes sensitive files
- [ ] Pre-commit hooks prevent secret commits
- [ ] Tokens have minimal required permissions

### Staging/Production

- [ ] Separate tokens per environment
- [ ] Branch protection enabled
- [ ] CI/CD validates before deploy
- [ ] Logs don't contain sensitive data
- [ ] Token rotation schedule in place

### Ongoing

- [ ] Regular secret scanning
- [ ] Token rotation executed
- [ ] Access logs reviewed
- [ ] Team trained on security practices

---

## Additional Resources

- **GitHub Branch Protection:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- **OWASP Security Practices:** https://owasp.org/www-project-top-ten/
- **Git Secrets:** https://github.com/awslabs/git-secrets
- **Gitleaks:** https://github.com/gitleaks/gitleaks

---

*Part of the n8n-claudecode-skills-gsd toolkit*
