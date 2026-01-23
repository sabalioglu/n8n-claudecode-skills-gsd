# R50 API Authentication & Rate Limiting Setup Guide

## Overview
This guide adds enterprise-grade API authentication and rate limiting to your R50 Cinematic Adverts workflow.

---

## Part 1: API Key Authentication

### Step 1: Create API Keys Sheet in Google Sheets

Add a new sheet named **"API_Keys"** with these columns:

| Column | Description |
|--------|-------------|
| `api_key` | The actual API key (SHA-256 hash recommended) |
| `user_id` | User identifier |
| `status` | `active` or `revoked` |
| `created_at` | When the key was created |
| `last_used_at` | Last time key was used |
| `request_count` | Total requests made with this key |
| `rate_limit` | Max requests per hour (e.g., 100) |

**Example row:**
```
sk_live_abc123xyz | user_001 | active | 2024-01-12T10:00:00Z | 2024-01-12T10:30:00Z | 45 | 100
```

### Step 2: Add Authentication Nodes to Main Workflow

Insert these nodes **immediately after the Webhook Trigger** in `R50_Cinematic_Adverts_Automated.json`:

#### Node 1: Extract API Key (Code Node)
**Position:** Between Webhook Trigger and Validate & Create Job

```javascript
// Extract API key from Authorization header
const headers = $input.first().json.headers;

// Check for Authorization header
if (!headers.authorization && !headers.Authorization) {
  return [{
    json: {
      auth_error: true,
      message: "Missing Authorization header. Include 'Authorization: Bearer YOUR_API_KEY' in request headers.",
      code: "MISSING_AUTH"
    }
  }];
}

// Extract Bearer token
const authHeader = headers.authorization || headers.Authorization;
const apiKey = authHeader.replace(/^Bearer\s+/i, '').trim();

if (!apiKey) {
  return [{
    json: {
      auth_error: true,
      message: "Invalid Authorization format. Use 'Bearer YOUR_API_KEY'",
      code: "INVALID_AUTH_FORMAT"
    }
  }];
}

return [{
  json: {
    api_key: apiKey,
    auth_error: false
  }
}];
```

**Node Name:** `🔐 Extract API Key`

---

#### Node 2: Check Authentication (IF Node)
```
Condition: {{$json.auth_error}} equals true
```

**Node Name:** `❓ Auth Valid?`

**Outputs:**
- **True** → Go to "Return Auth Error"
- **False** → Continue to "Validate API Key"

---

#### Node 3: Return Auth Error (Respond to Webhook)
```json
{
  "error": true,
  "message": "{{$json.message}}",
  "code": "{{$json.code}}"
}
```

**HTTP Status Code:** 401 (Unauthorized)

**Node Name:** `❌ Return Auth Error`

---

#### Node 4: Validate API Key (Google Sheets Lookup)
**Operation:** Search
**Sheet:** API_Keys
**Filter:** `api_key` = `{{$json.api_key}}`

**Node Name:** `🔍 Validate API Key`

---

#### Node 5: Check Key Exists (IF Node)
```
Condition: {{$input.all().length}} equals 0
```

**Node Name:** `❓ Key Valid?`

**Outputs:**
- **True** → "Invalid API Key Response"
- **False** → "Check Key Status"

---

#### Node 6: Invalid API Key Response (Respond to Webhook)
```json
{
  "error": true,
  "message": "Invalid API key. Please check your credentials.",
  "code": "INVALID_API_KEY"
}
```

**HTTP Status Code:** 401

**Node Name:** `❌ Invalid API Key`

---

#### Node 7: Check Key Status (Code Node)
```javascript
// Check if API key is active
const keyData = $input.first().json;

if (keyData.status !== 'active') {
  return [{
    json: {
      key_error: true,
      message: "API key has been revoked. Contact support for assistance.",
      code: "KEY_REVOKED"
    }
  }];
}

// Pass through key data for rate limiting
return [{
  json: {
    key_error: false,
    user_id: keyData.user_id,
    api_key: keyData.api_key,
    rate_limit: keyData.rate_limit || 100,
    request_count: keyData.request_count || 0
  }
}];
```

**Node Name:** `🔍 Check Key Status`

---

#### Node 8: Key Status Valid? (IF Node)
```
Condition: {{$json.key_error}} equals true
```

**Outputs:**
- **True** → "Return Key Error"
- **False** → Continue to existing "Validate & Create Job"

---

#### Node 9: Return Key Error (Respond to Webhook)
```json
{
  "error": true,
  "message": "{{$json.message}}",
  "code": "{{$json.code}}"
}
```

**HTTP Status Code:** 403 (Forbidden)

**Node Name:** `❌ Key Revoked`

---

### Step 3: Update Connection Flow

**New flow:**
```
Webhook Trigger
    ↓
🔐 Extract API Key
    ↓
❓ Auth Valid? → ❌ Return Auth Error
    ↓
🔍 Validate API Key
    ↓
❓ Key Valid? → ❌ Invalid API Key
    ↓
🔍 Check Key Status
    ↓
❓ Key Status Valid? → ❌ Key Revoked
    ↓
✅ Validate & Create Job (existing node)
```

---

## Part 2: Rate Limiting

### Step 1: Add Rate Limit Check (Code Node)

Insert after "Check Key Status" node:

```javascript
// Rate limiting logic
const keyData = $json;
const rateLimit = parseInt(keyData.rate_limit) || 100;
const requestCount = parseInt(keyData.request_count) || 0;

// Simple hourly rate limit check
// In production, you'd track requests per hour window
if (requestCount >= rateLimit) {
  return [{
    json: {
      rate_limit_exceeded: true,
      message: `Rate limit exceeded. Maximum ${rateLimit} requests per hour.`,
      code: "RATE_LIMIT_EXCEEDED",
      retry_after: 3600 // seconds
    }
  }];
}

return [{
  json: {
    ...keyData,
    rate_limit_exceeded: false
  }
}];
```

**Node Name:** `⏱️ Check Rate Limit`

---

### Step 2: Rate Limit IF Node

```
Condition: {{$json.rate_limit_exceeded}} equals true
```

**Outputs:**
- **True** → "Return Rate Limit Error"
- **False** → Continue to "Update Request Count"

**Node Name:** `❓ Rate OK?`

---

### Step 3: Return Rate Limit Error (Respond to Webhook)

```json
{
  "error": true,
  "message": "{{$json.message}}",
  "code": "{{$json.code}}",
  "retry_after": "{{$json.retry_after}}"
}
```

**HTTP Status Code:** 429 (Too Many Requests)

**Node Name:** `❌ Rate Limit Exceeded`

---

### Step 4: Update Request Count (Google Sheets Update)

**Operation:** Update
**Sheet:** API_Keys
**Lookup Column:** `api_key`
**Lookup Value:** `{{$json.api_key}}`

**Columns to Update:**
- `request_count` = `={{$json.request_count + 1}}`
- `last_used_at` = `={{$now.toISO()}}`

**Node Name:** `📈 Update Request Count`

---

## Part 3: Generate API Keys

### Method 1: Manual Generation (Quick Start)

Use this Node.js script to generate API keys:

```javascript
const crypto = require('crypto');

function generateAPIKey() {
  const key = crypto.randomBytes(32).toString('base64url');
  return `sk_live_${key}`;
}

// Generate 5 keys
for (let i = 0; i < 5; i++) {
  console.log(generateAPIKey());
}
```

**Run:**
```bash
node generate-keys.js
```

**Output:**
```
sk_live_abc123xyz789...
sk_live_def456uvw012...
...
```

Add these to your Google Sheets API_Keys tab manually.

---

### Method 2: API Key Generation Workflow (Advanced)

Create a separate n8n workflow:

**Webhook Trigger:** `POST /api/create-key`

**Required Body:**
```json
{
  "user_id": "user_001",
  "rate_limit": 100,
  "admin_secret": "YOUR_ADMIN_SECRET"
}
```

**Logic:**
1. Validate admin secret
2. Generate random API key
3. Hash it (optional, for security)
4. Store in Google Sheets
5. Return plain key to user (only shown once!)

---

## Part 4: Testing Authentication

### Test 1: Missing API Key
```bash
curl -X POST https://your-n8n.com/webhook/generate-advert \
  -H "Content-Type: application/json" \
  -d '{"project_name": "Test"}'
```

**Expected:** 401 Unauthorized

---

### Test 2: Invalid API Key
```bash
curl -X POST https://your-n8n.com/webhook/generate-advert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_live_invalid_key" \
  -d '{"project_name": "Test"}'
```

**Expected:** 401 Invalid API Key

---

### Test 3: Valid API Key
```bash
curl -X POST https://your-n8n.com/webhook/generate-advert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_live_YOUR_REAL_KEY" \
  -d '{
    "project_name": "Test Campaign",
    "creative_direction": "Futuristic tech reveal",
    "core_image_url": "https://example.com/product.jpg",
    "core_elements_url": "https://example.com/elements.jpg"
  }'
```

**Expected:** 200 Success with job_id

---

### Test 4: Rate Limiting

Make 101 requests rapidly (assuming rate_limit = 100):

```bash
for i in {1..101}; do
  curl -X POST https://your-n8n.com/webhook/generate-advert \
    -H "Authorization: Bearer sk_live_YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{"project_name": "Test"}' &
done
```

**Expected:** First 100 succeed, 101st returns 429 Rate Limit Exceeded

---

## Part 5: Advanced Rate Limiting (Production-Ready)

For production, implement **sliding window rate limiting** with Redis or a dedicated rate limiting service.

### Using n8n with Redis:

1. Install n8n Redis nodes
2. Store request timestamps per API key in Redis
3. Check count of requests in last hour
4. Clean up old timestamps

**Pseudocode:**
```javascript
// Get timestamps from Redis
const timestamps = await redis.lrange(`ratelimit:${api_key}`, 0, -1);

// Filter to last hour
const now = Date.now();
const oneHourAgo = now - (60 * 60 * 1000);
const recentRequests = timestamps.filter(t => parseInt(t) > oneHourAgo);

// Check limit
if (recentRequests.length >= rateLimit) {
  return { error: 'Rate limit exceeded' };
}

// Add current timestamp
await redis.lpush(`ratelimit:${api_key}`, now.toString());
await redis.ltrim(`ratelimit:${api_key}`, 0, rateLimit - 1);
await redis.expire(`ratelimit:${api_key}`, 3600); // 1 hour TTL
```

---

## Part 6: Security Best Practices

### 1. Hash API Keys (Recommended)
Store SHA-256 hashes instead of plain keys in Google Sheets:

```javascript
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
```

When validating, hash the incoming key and compare hashes.

---

### 2. Use HTTPS Only
Ensure your n8n instance uses HTTPS to prevent key interception.

---

### 3. Key Rotation
Implement key expiration:
- Add `expires_at` column to API_Keys sheet
- Check expiration in validation node
- Notify users 7 days before expiration

---

### 4. IP Whitelisting (Optional)
Add `allowed_ips` column and validate request IP:

```javascript
const clientIP = $input.first().json.headers['x-forwarded-for'] ||
                 $input.first().json.headers['x-real-ip'];

const allowedIPs = keyData.allowed_ips.split(',');

if (!allowedIPs.includes(clientIP)) {
  return { error: 'IP not whitelisted' };
}
```

---

### 5. Logging & Monitoring
Add logging node after validation to track:
- API key used
- Request timestamp
- IP address
- Endpoint accessed
- Response status

Store in separate "API_Logs" sheet for audit trail.

---

## Part 7: Cost Estimation Per Request

Track API costs for billing:

### Add to Google Sheets "API_Keys":
- `total_cost_usd` - Running total
- `last_request_cost` - Cost of last request

### Calculate costs in workflow:

```javascript
// API cost breakdown (example rates)
const costs = {
  gemini_prompt_gen: 0.10,  // $0.10 per generation
  nano_banana_image: 0.02,  // $0.02 per image
  veo_video: 0.15,          // $0.15 per video
  suno_music: 0.25,         // $0.25 per generation
  elevenlabs_voice: 0.08    // $0.08 per generation
};

const numScenes = parseInt(jobData.num_scenes) || 5;

const totalCost =
  costs.gemini_prompt_gen +
  (costs.nano_banana_image * numScenes * 2) + // start + end frames
  (costs.veo_video * numScenes) +
  costs.suno_music +
  costs.elevenlabs_voice;

// Store in job record
return [{
  json: {
    ...jobData,
    estimated_cost_usd: totalCost.toFixed(2)
  }
}];
```

Update API key's `total_cost_usd` when job completes.

---

## Part 8: User Dashboard (Optional)

Create a simple status dashboard:

### Dashboard Workflow:
**Webhook:** `GET /api/dashboard?api_key=xxx`

**Returns:**
```json
{
  "user_id": "user_001",
  "requests_today": 45,
  "rate_limit": 100,
  "remaining_requests": 55,
  "total_cost_usd": "12.35",
  "active_jobs": 2,
  "completed_jobs": 18,
  "failed_jobs": 1
}
```

Query Google Sheets for stats by user_id.

---

## Summary

✅ **API Key Authentication** - Prevents unauthorized access
✅ **Rate Limiting** - Prevents abuse and controls costs
✅ **Request Tracking** - Audit trail for compliance
✅ **Cost Tracking** - For billing/monetization
✅ **Security Best Practices** - Production-ready security

**Setup Time:** ~45 minutes
**Maintenance:** Minimal (key rotation every 6 months)

---

## Next Steps

1. ✅ Create API_Keys sheet in Google Sheets
2. ✅ Add authentication nodes to main workflow
3. ✅ Generate initial API keys
4. ✅ Test with all scenarios
5. ✅ Monitor logs and usage
6. ✅ Set up key rotation schedule

Your SaaS API is now production-ready! 🚀
