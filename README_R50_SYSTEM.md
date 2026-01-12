# R50 Cinematic Adverts System - Complete Documentation

## 🎬 Overview

A **fully automated SaaS workflow** that generates complete cinematic advertisements from a single API request. Takes product images and creative direction, outputs professional videos, music, and voiceover in 5-8 minutes.

**Perfect for:** SaaS products, marketing agencies, content creators, e-commerce brands

---

## ✨ What It Does

**Input:** Product image + creative direction
**Output:** Complete cinematic ad package

- ✅ AI-generated script (40 seconds)
- ✅ Professional music track (Suno AI)
- ✅ Voiceover narration (ElevenLabs)
- ✅ Multiple cinematic video scenes (Google Veo)
- ✅ High-quality images (Nano Banana)

**Execution Time:** 5-8 minutes, fully automated
**Cost per generation:** ~$2-5 (depending on APIs used)

---

## 📦 Complete Package Contents

### Core Workflows (2)

1. **`R50_Cinematic_Adverts_Automated.json`** - Main automation workflow (46 nodes)
   - Webhook trigger for API requests
   - AI prompt generation
   - Parallel image/video/audio generation
   - Async polling with intelligent timeouts
   - Google Sheets integration
   - Optional callback webhooks

2. **`R50_Status_Check_Workflow.json`** - Status monitoring endpoint
   - Real-time progress tracking
   - Scene completion breakdown
   - ETA calculation
   - Final asset delivery

### Setup Guides (4)

3. **`GOOGLE_SHEETS_SETUP.md`** - Database schema and setup
   - Step-by-step sheet creation
   - Column definitions
   - Data validation rules
   - Conditional formatting
   - Migration path to Supabase

4. **`R50_SETUP_CHECKLIST.md`** - Deployment walkthrough
   - Credential configuration
   - Sheet ID replacement
   - Testing procedures
   - Troubleshooting tips

5. **`R50_API_Authentication_Guide.md`** - Security implementation
   - API key authentication
   - Rate limiting (requests per hour)
   - Bearer token validation
   - Cost tracking per user
   - IP whitelisting
   - Key generation scripts

6. **`R50_Testing_Guide.md`** - Complete test suite
   - 45+ test cases
   - Automated testing script
   - Performance benchmarks
   - Asset quality checks
   - Edge case testing

### Technical Documentation (5)

7. **`R50_WORKFLOW_DOCUMENTATION.md`** - Technical deep-dive
   - Complete API specifications
   - Node-by-node breakdown
   - Data flow diagrams
   - Error handling patterns

8. **`R50_WORKFLOW_VISUAL_FLOW.txt`** - ASCII flow diagrams
   - Visual representation of pipeline
   - Connection mapping
   - Stage transitions

9. **`R50_NODES_ADDED_SUMMARY.md`** - Node reference guide
   - Each node explained
   - Purpose and configuration
   - Input/output specs

10. **`QUICK_REFERENCE.txt`** - Command cheat sheet
    - Common cURL commands
    - Troubleshooting tips
    - Quick lookups

11. **`COMPLETION_SUMMARY.md`** - Project overview
    - High-level architecture
    - Feature summary
    - Performance metrics

---

## 🚀 Quick Start (25 minutes)

### Step 1: Set Up Google Sheets (5 min)

1. Create new Google Sheet: "Cinematic Adverts Jobs"
2. Create tabs: "Jobs" and "Scenes"
3. Add column headers (see `GOOGLE_SHEETS_SETUP.md`)
4. Copy Sheet ID from URL

### Step 2: Configure n8n Credentials (10 min)

Add these credentials in n8n:

- ✅ Google Sheets OAuth
- ✅ Google Gemini API (for image analysis)
- ✅ OpenRouter API (for AI agent)
- ✅ WaveSpeed API (for Nano Banana images)
- ✅ Kie AI API (for Veo videos)
- ✅ Suno AI API (for music)
- ✅ ElevenLabs API (for voice)

### Step 3: Import Workflows (5 min)

1. Import `R50_Cinematic_Adverts_Automated.json`
2. Import `R50_Status_Check_Workflow.json`
3. Replace `YOUR_GOOGLE_SHEET_ID` (6 places)
4. Replace `SUNO_CREDENTIAL_ID` (2 places)
5. Replace `ELEVENLABS_CREDENTIAL_ID` (2 places)
6. Activate both workflows

### Step 4: Test (5 min)

```bash
curl -X POST https://your-n8n.com/webhook/generate-advert \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Test Campaign",
    "creative_direction": "Futuristic tech product reveal with slow camera movements",
    "core_image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "core_elements_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "num_scenes": 3
  }'
```

**Expected:** Job ID returned, check Google Sheets for progress

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR SAAS FRONTEND                        │
│              (React, Next.js, Vue, etc.)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ POST /webhook/generate-advert
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    N8N WORKFLOW ENGINE                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Stage 1: AI Prompt Generation (30-60s)              │  │
│  │  • Analyze product images                            │  │
│  │  • Generate script, music prompt, scene descriptions │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Stage 2: Image Generation (10-25s, parallel)        │  │
│  │  • Generate start frames for each scene              │  │
│  │  • Generate end frames for each scene                │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Stage 3: Video Generation (3-5 min, parallel)       │  │
│  │  • Create transitions between frames                 │  │
│  │  • Poll until all videos complete                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Stage 4: Audio Generation (1-3 min, PARALLEL)       │  │
│  │  ├─> Music (Suno AI)      ├─> Voice (ElevenLabs)    │  │
│  │  │   40s instrumental      │   Script narration      │  │
│  │  └────────────────┬────────┴───────────┬─────────────┘  │
│  │                   └─────── Merge ──────┘                │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Stage 5: Final Assembly & Callback                  │  │
│  │  • Update job status to "completed"                  │  │
│  │  • Notify via webhook (optional)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS                             │
│  • Jobs table (status tracking)                             │
│  • Scenes table (scene-level progress)                      │
│  • API_Keys table (authentication)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 API Reference

### Create Advert Job

**Endpoint:** `POST /webhook/generate-advert`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY (optional, if auth enabled)
```

**Body:**
```json
{
  "project_name": "Campaign Name",
  "creative_direction": "Detailed description of desired style and mood",
  "core_image_url": "https://example.com/product.jpg",
  "core_elements_url": "https://example.com/elements.jpg",
  "num_scenes": 5,
  "voice_id": "EXAVITQu4vr4xnSDxMaL",
  "webhook_url": "https://yourapp.com/webhook/callback"
}
```

**Required Fields:**
- `project_name` - Campaign identifier
- `creative_direction` - Style and mood description
- `core_image_url` - Main product image (publicly accessible)
- `core_elements_url` - Elements board image (publicly accessible)

**Optional Fields:**
- `num_scenes` - Number of video scenes (default: 5)
- `voice_id` - ElevenLabs voice ID (default: professional male)
- `webhook_url` - Callback URL for completion notification

**Response (200 OK):**
```json
{
  "success": true,
  "job_id": "job_1704123456789_abc123",
  "status": "processing",
  "message": "Your cinematic advert is being generated...",
  "created_at": "2024-01-12T10:30:00.000Z"
}
```

---

### Check Job Status

**Endpoint:** `GET /webhook/check-status?job_id=xxx`

**Response (Processing):**
```json
{
  "success": true,
  "job_id": "job_1704123456789_abc123",
  "project_name": "Campaign Name",
  "status": "processing",
  "stage": "scenes_completed",
  "progress_percent": 70,
  "estimated_completion": "2 minutes",
  "created_at": "2024-01-12T10:30:00Z",
  "updated_at": "2024-01-12T10:35:00Z",
  "scenes": {
    "total": 5,
    "completed": 4,
    "processing": 1,
    "failed": 0
  }
}
```

**Response (Completed):**
```json
{
  "success": true,
  "job_id": "job_1704123456789_abc123",
  "status": "completed",
  "stage": "final_assets_ready",
  "progress_percent": 100,
  "results": {
    "music_url": "https://cdn.suno.ai/music_abc123.mp3",
    "voice_url": "https://cdn.elevenlabs.io/voice_xyz789.mp3",
    "video_urls": [
      "https://cdn.veo.ai/scene1.mp4",
      "https://cdn.veo.ai/scene2.mp4",
      "https://cdn.veo.ai/scene3.mp4",
      "https://cdn.veo.ai/scene4.mp4",
      "https://cdn.veo.ai/scene5.mp4"
    ],
    "completed_at": "2024-01-12T10:37:00Z"
  }
}
```

---

## 💰 Cost Breakdown

**Per Generation (5 scenes):**

| Service | Usage | Cost |
|---------|-------|------|
| Google Gemini | 1 image analysis | $0.10 |
| OpenRouter (Gemini) | 1 prompt generation | $0.15 |
| Nano Banana | 10 images (start + end) | $0.20 |
| Google Veo | 5 videos (8s each) | $0.75 |
| Suno AI | 1 music track (40s) | $0.25 |
| ElevenLabs | 1 voiceover | $0.08 |
| **Total** | | **~$1.53** |

**With markup for SaaS pricing:** $5-10 per generation

---

## 🔐 Security Features

### API Authentication (Optional)
- Bearer token validation
- API key storage in Google Sheets
- Active/revoked status checking
- Request tracking

### Rate Limiting
- Requests per hour limits
- Per-key quotas
- 429 status codes for exceeded limits
- Retry-After headers

### Best Practices
- HTTPS only
- API key hashing (SHA-256)
- IP whitelisting capability
- Request logging and audit trail

---

## 📈 Performance Metrics

**Execution Time:**
- 1 scene: 3-4 minutes
- 3 scenes: 5-7 minutes
- 5 scenes: 7-9 minutes
- 10 scenes: 12-15 minutes

**Scalability:**
- Multiple jobs run in parallel
- No interference between jobs
- Horizontal scaling possible

**Reliability:**
- Automatic retries on API failures
- Intelligent timeout handling
- Failed scenes don't block workflow
- All progress tracked in Google Sheets

---

## 🛠️ Tech Stack

**Automation:** n8n workflow engine
**Database:** Google Sheets (MVP) → Supabase (production)
**AI Models:**
- Google Gemini 3 Pro (image analysis & prompts)
- Nano Banana Pro (image generation)
- Google Veo 3 Fast (video generation)
- Suno AI V5 (music generation)
- ElevenLabs Turbo v2.5 (voice synthesis)

---

## 📊 Monitoring & Debugging

### Google Sheets Dashboard
- Real-time job status
- Scene-level progress
- Error messages
- Request counts
- Cost tracking

### n8n Execution Logs
- Complete execution history
- Node-level debugging
- Error stack traces
- Performance timing

### Optional: External Monitoring
- Datadog integration
- Slack notifications
- Email alerts for failures

---

## 🚨 Troubleshooting

### Job Stuck in "Processing"
1. Check n8n execution logs
2. Verify all API credentials valid
3. Check Google Sheets for last update time
4. Look for timeout in polling loops

### Videos Not Generating
1. Verify Veo API key is valid
2. Check image URLs are accessible
3. Increase polling timeout (max_attempts)
4. Check Veo API status page

### Google Sheets Not Updating
1. Verify OAuth permissions granted
2. Check Sheet ID is correct
3. Verify sheet tabs exist ("Jobs", "Scenes")
4. Check Google Sheets API quota

### Authentication Failing
1. Verify API key exists in API_Keys sheet
2. Check key status is "active"
3. Verify Authorization header format
4. Check rate limit not exceeded

---

## 🎓 Learning Resources

**Read in this order:**

1. Start: `COMPLETION_SUMMARY.md` - High-level overview
2. Setup: `R50_SETUP_CHECKLIST.md` - Step-by-step deployment
3. Database: `GOOGLE_SHEETS_SETUP.md` - Sheet configuration
4. Security: `R50_API_Authentication_Guide.md` - Add authentication
5. Testing: `R50_Testing_Guide.md` - Verify everything works
6. Reference: `QUICK_REFERENCE.txt` - Commands and tips

**Advanced Topics:**

7. Architecture: `R50_WORKFLOW_DOCUMENTATION.md` - Technical deep-dive
8. Visuals: `R50_WORKFLOW_VISUAL_FLOW.txt` - Flow diagrams
9. Nodes: `R50_NODES_ADDED_SUMMARY.md` - Node reference

---

## 🎯 Production Deployment Checklist

### Pre-Launch
- [ ] All tests passing (see `R50_Testing_Guide.md`)
- [ ] API authentication enabled
- [ ] Rate limiting configured
- [ ] Google Sheets production sheet created
- [ ] All credentials configured
- [ ] Backup procedures documented
- [ ] Monitoring alerts set up

### Launch
- [ ] Deploy to production n8n instance
- [ ] Update DNS/URLs in frontend
- [ ] Test with real customer data
- [ ] Monitor first 10 jobs closely
- [ ] Document any issues

### Post-Launch
- [ ] Set up daily health checks
- [ ] Monitor API costs
- [ ] Track success/failure rates
- [ ] Collect user feedback
- [ ] Plan optimizations

---

## 🔄 Migration to Supabase (When Ready)

When you outgrow Google Sheets:

1. Create Supabase project
2. Run SQL schema (provided in `GOOGLE_SHEETS_SETUP.md`)
3. Replace Google Sheets nodes with Supabase nodes
4. Test thoroughly
5. Migrate existing data
6. Switch DNS

**Benefit:** Better performance, SQL queries, row-level security

---

## 📞 Support

### Issues or Questions?

1. Check `R50_Testing_Guide.md` for troubleshooting
2. Review n8n execution logs
3. Check Google Sheets for error messages
4. Verify all API credentials are valid

### Feature Requests

Want to add:
- Custom voice cloning?
- Multiple language support?
- Video editing/compositing?
- Custom music styles?
- Batch processing?

All possible with extensions to the base workflow!

---

## 🎉 What You've Built

You now have a **production-ready SaaS API** that can:

✅ Generate complete cinematic ads in 5-8 minutes
✅ Handle multiple concurrent jobs
✅ Track progress in real-time
✅ Authenticate and rate-limit requests
✅ Scale to handle 100s of requests/day
✅ Cost $1.53 per generation, sell for $5-10
✅ Fully automated with error handling
✅ Enterprise-grade security and monitoring

**Potential Revenue:**
- 100 generations/day × $7 = $700/day = $21k/month
- Minus API costs: $153/day = $4.6k/month
- **Net: $16.4k/month potential**

Your AI-powered cinematic ad generation SaaS is ready to launch! 🚀

---

## 📝 License & Credits

**System by:** Jay E | R50
**Framework:** n8n workflow automation
**AI Models:** Google, Suno, ElevenLabs
**Documentation:** Comprehensive guides included

**Use freely for commercial projects!**

---

**Questions? Check the docs or create an issue in the repo.**

**Happy building! 🎬✨**
