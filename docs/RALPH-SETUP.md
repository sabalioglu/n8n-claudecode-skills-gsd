# Ralph Orchestrator Kullanım Rehberi

## Kurulum
Ralph Orchestrator NPM üzerinden kullanılır (global install gerektirmez):

\`\`\`bash
npx @ralph-orchestrator/ralph-cli --version
\`\`\`

## Yeni Proje Başlatma
1. Template'i kopyala:
   \`\`\`bash
   cp -r ~/Desktop/KEMIK/templates/project-starter ~/Projects/yeni-proje
   cd ~/Projects/yeni-proje
   git init
   \`\`\`

2. `.env` dosyası oluştur (ASLA git'e ekleme):
   \`\`\`bash
   cp .env.example .env
   # Tokenları doldur
   \`\`\`

3. Ralph'ı başlat:
   \`\`\`bash
   npx ralph init --backend claude
   npx ralph run -p "Bu projeyi REQUIREMENTS.md'ye göre inşa et"
   \`\`\`

## Hat Sistemi (Roller)
- **research_architect**: Şartname analizi, teknoloji seçimi
- **ui_designer**: context/ui.json üretimi, AntiGravity handoff
- **code_builder**: Kod yazımı, MCP kullanımı
- **qa_validator**: Test, lint, typecheck
- **documenter**: README, API docs
- **final_reviewer**: Kalite kontrol, teslim

## MCP Bağlantıları
\`\`\`bash
# n8n MCP
source .env
claude mcp add --scope project n8n-mcp -- npx -y supergateway \\
  --streamableHttp "$N8N_MCP_URL" \\
  --header "authorization:Bearer $N8N_BEARER_TOKEN"

# Supabase MCP
claude mcp add --scope project --transport http supabase \\
  "https://mcp.supabase.com/mcp?project_ref=$SUPABASE_PROJECT_REF" \\
  --header "Authorization: Bearer $SUPABASE_ACCESS_TOKEN"
\`\`\`

## AntiGravity Handoff
Ralph `ui.design.ready` event'inde durur. `context/ui.json` ve `HANDOFF.md`'yi AntiGravity'ye ver:
\`\`\`bash
# AntiGravity'de UI üret
# Sonra Ralph'a devam et:
npx ralph resume
\`\`\`

## Guardrails
- ❌ Kemik repo'ya proje kodu yazma
- ✅ Her proje ayrı GitHub repo
- ✅ Tokenlar `.env`'de, asla git'e ekleme
- ✅ Ralph scratchpad `.agent/scratchpad.md` güncel
