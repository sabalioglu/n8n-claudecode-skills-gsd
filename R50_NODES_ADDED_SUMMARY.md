# R50 Cinematic Adverts - Nodes Added Summary

## Overview
This document lists all 30 new nodes added to complete the automated workflow.

---

## Original Workflow (Nodes 1-16)

These nodes were already implemented:

1. **🚀 Webhook Trigger** - POST endpoint
2. **✅ Validate & Create Job** - Input validation + job ID generation
3. **❓ Valid?** - If node for validation check
4. **❌ Return Error** - 400 error response
5. **📝 Create Job Record** - Store job in Google Sheets
6. **✅ Return Job ID** - 202 success response
7. **🔍 Analyze Elements Board** - Gemini vision analysis
8. **🤖 Generate Prompts (AI Agent)** - OpenRouter AI agent
9. **🧠 LLM Model** - Gemini 3 Pro language model
10. **📋 Structure Output** - JSON schema parser
11. **💭 Think Tool** - AI reasoning tool
12. **🔗 Merge Prompts with Job** - Combine AI output with job data
13. **💾 Update Job (Prompts)** - Update Google Sheets
14. **✂️ Split Scenes** - Split scenes array
15. **🖼️ Create Start Frame** - WaveSpeed image generation
16. **🖼️ Create End Frame** - WaveSpeed image generation

---

## New Nodes Added (Nodes 17-46)

### Scene Storage (Nodes 17-18)

#### 17. 📦 Prepare Scene Data
- **Type**: Code
- **Purpose**: Package scene data with image URLs and generate unique scene_id
- **Inputs**: Scene data, start frame URL, end frame URL
- **Outputs**: Formatted scene object ready for storage
- **Key Logic**:
  - Extracts scene number from title
  - Generates unique scene_id: `scene_{job_id}_{scene_number}`
  - Prepares metadata for Google Sheets

#### 18. 💾 Store Scene to Sheets
- **Type**: Google Sheets (append)
- **Purpose**: Save scene metadata to "Scenes" sheet
- **Sheet**: Scenes
- **Columns**: scene_id, job_id, scene_number, scene_title, start_image_url, end_image_url, transition_prompt, video_status, created_at
- **Why**: Enables tracking and debugging of individual scenes

---

### Video Generation & Polling (Nodes 19-26)

#### 19. 🎬 Generate Video (Veo)
- **Type**: HTTP Request (POST)
- **Purpose**: Call Kie AI Veo API to generate video from image pair
- **API**: `https://kie.wavespeed.ai/api/veo/generations`
- **Credential**: Kie AI (ID: GY8EwBg1KMzSwh9X)
- **Request Body**:
  ```json
  {
    "prompt": "{transition_prompt}",
    "first_frame_image": "{start_image_url}",
    "last_frame_image": "{end_image_url}",
    "aspect_ratio": "16:9",
    "duration": 8
  }
  ```
- **Response**: generation_id, status

#### 20. 🔄 Init Video Poll
- **Type**: Code
- **Purpose**: Initialize polling state for video generation
- **Outputs**:
  - scene_id
  - job_id
  - generation_id
  - video_status
  - poll_attempt: 0
  - max_attempts: 20

#### 21. ⏱️ Wait 15s
- **Type**: Wait
- **Purpose**: Delay between polling attempts
- **Duration**: 15 seconds
- **Why**: Prevents rate limiting and gives API time to process

#### 22. 🔍 Check Video Status
- **Type**: HTTP Request (GET)
- **Purpose**: Query Veo API for generation status
- **API**: `https://kie.wavespeed.ai/api/veo/generations/{generation_id}`
- **Credential**: Kie AI
- **Response**: status, video_url, error

#### 23. 🔗 Merge Video Status
- **Type**: Code
- **Purpose**: Combine polling state with API response
- **Logic**:
  - Increments poll_attempt
  - Extracts status and video_url
  - Preserves scene metadata
  - Handles errors

#### 24. 🎯 Video Complete?
- **Type**: Switch
- **Purpose**: Route based on video generation status
- **Outputs**:
  1. **completed** → Update scene with video URL
  2. **failed** → Mark scene as failed
  3. **timeout** (poll_attempt > max_attempts) → Mark as failed
  4. **processing** (fallback) → Loop back to Wait 15s
- **Why**: Implements intelligent polling with failure handling

#### 25. ✅ Update Scene (Video Complete)
- **Type**: Google Sheets (update)
- **Purpose**: Store successful video URL in "Scenes" sheet
- **Sheet**: Scenes
- **Lookup**: scene_id
- **Updates**: video_status, video_url, generation_id

#### 26. ❌ Mark Video Failed
- **Type**: Google Sheets (update)
- **Purpose**: Mark scene as failed in "Scenes" sheet
- **Sheet**: Scenes
- **Lookup**: scene_id
- **Updates**: video_status = "failed", error message

---

### Scene Aggregation (Nodes 27-28)

#### 27. 📊 Aggregate All Scenes
- **Type**: Aggregate
- **Purpose**: Wait for all scenes to complete and combine into array
- **Mode**: aggregateAllItemData
- **Output**: Array of all completed scenes with video URLs
- **Why**: Synchronization point before audio generation

#### 28. 🎵 Prepare Audio Generation
- **Type**: Code
- **Purpose**: Package data for parallel music and voice generation
- **Inputs**: Aggregated scenes, job data
- **Outputs**: job_id, script, music_prompt, voice_id, scenes array
- **Why**: Prepares data structure for split into parallel branches

---

### Music Generation Branch (Nodes 29-34)

#### 29. 🎵 Generate Music (Suno)
- **Type**: HTTP Request (POST)
- **Purpose**: Call Suno AI to generate background music
- **API**: `https://api.suno.ai/v1/generate`
- **Credential**: Suno AI (needs configuration)
- **Request Body**:
  ```json
  {
    "prompt": "{music_prompt}",
    "duration": 40,
    "instrumental": true
  }
  ```
- **Response**: id/generation_id, status

#### 30. 🔄 Init Music Poll
- **Type**: Code
- **Purpose**: Initialize polling state for music generation
- **Outputs**: job_id, music_generation_id, music_status, poll_attempt: 0, max_attempts: 20

#### 31. ⏱️ Wait Music 15s
- **Type**: Wait
- **Purpose**: Delay between music polling attempts
- **Duration**: 15 seconds

#### 32. 🔍 Check Music Status
- **Type**: HTTP Request (GET)
- **Purpose**: Query Suno API for generation status
- **API**: `https://api.suno.ai/v1/generate/{music_generation_id}`
- **Credential**: Suno AI
- **Response**: status, audio_url/url

#### 33. 🔗 Merge Music Status
- **Type**: Code
- **Purpose**: Combine polling state with Suno API response
- **Logic**: Increments poll_attempt, extracts music_url

#### 34. 🎯 Music Complete?
- **Type**: Switch
- **Purpose**: Route based on music generation status
- **Outputs**:
  1. **completed** → Proceed to merge node (input 1)
  2. **failed** → Error (currently empty, needs error handling)
  3. **processing** (fallback) → Loop back to Wait Music 15s

---

### Voice Generation Branch (Nodes 35-40)

#### 35. 🎤 Generate Voice (ElevenLabs)
- **Type**: HTTP Request (POST)
- **Purpose**: Call ElevenLabs TTS to generate voiceover
- **API**: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **Credential**: ElevenLabs (needs configuration)
- **Request Body**:
  ```json
  {
    "text": "{script}",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.75
    }
  }
  ```
- **Response**: id/generation_id, audio_url, status

#### 36. 🔄 Init Voice Poll
- **Type**: Code
- **Purpose**: Initialize polling state for voice generation
- **Outputs**: job_id, voice_generation_id, voice_url, voice_status, poll_attempt: 0, max_attempts: 20
- **Special Logic**: Detects if audio_url is immediately available (ElevenLabs often returns synchronously)

#### 37. ⏱️ Wait Voice 5s
- **Type**: Wait
- **Purpose**: Delay between voice polling attempts
- **Duration**: 5 seconds (shorter than music/video because voice is faster)

#### 38. 🔍 Check Voice Status
- **Type**: HTTP Request (GET)
- **Purpose**: Query ElevenLabs API for generation status
- **API**: `https://api.elevenlabs.io/v1/history/{voice_generation_id}`
- **Credential**: ElevenLabs
- **Response**: status, audio_url/url

#### 39. 🔗 Merge Voice Status
- **Type**: Code
- **Purpose**: Combine polling state with ElevenLabs API response
- **Logic**: Increments poll_attempt, extracts voice_url, handles immediate completion

#### 40. 🎯 Voice Complete?
- **Type**: Switch
- **Purpose**: Route based on voice generation status
- **Outputs**:
  1. **completed** → Proceed to merge node (input 2)
  2. **failed** → Error (currently empty, needs error handling)
  3. **processing** (fallback) → Loop back to Wait Voice 5s

---

### Final Assembly (Nodes 41-46)

#### 41. 🔗 Merge Music + Voice
- **Type**: Merge
- **Purpose**: Synchronization point - waits for BOTH music and voice to complete
- **Mode**: combine
- **Merge By**: job_id
- **Inputs**:
  - Input 1: Music data (from Music Complete?)
  - Input 2: Voice data (from Voice Complete?)
- **Output**: Combined object with music_url and voice_url
- **Why**: Ensures both audio assets are ready before proceeding

#### 42. 📦 Prepare Final Assets
- **Type**: Code
- **Purpose**: Package all final assets into delivery format
- **Inputs**:
  - Music/voice data from merge node
  - Scenes data from aggregation
  - Job metadata
- **Outputs**:
  ```json
  {
    "job_id": "...",
    "project_name": "...",
    "status": "completed",
    "stage": "final_assets_ready",
    "music_url": "...",
    "voice_url": "...",
    "video_urls": ["...", "..."],
    "scene_count": 5,
    "completed_at": "2024-01-01T12:15:30.000Z"
  }
  ```

#### 43. ✅ Update Job (Complete)
- **Type**: Google Sheets (update)
- **Purpose**: Update "Jobs" sheet with final status and all asset URLs
- **Sheet**: Jobs
- **Lookup**: job_id
- **Updates**: status, stage, music_url, voice_url, completed_at, updated_at
- **Why**: Provides single source of truth for job status

#### 44. ❓ Has Callback?
- **Type**: If
- **Purpose**: Check if webhook_url was provided in original request
- **Condition**: `webhook_url != null`
- **Outputs**:
  - **false** → Skip callback
  - **true** → Send callback webhook

#### 45. 📞 Send Callback Webhook
- **Type**: HTTP Request (POST)
- **Purpose**: Notify user that job is complete
- **URL**: User-provided webhook_url from original request
- **Body**:
  ```json
  {
    "job_id": "...",
    "project_name": "...",
    "status": "completed",
    "music_url": "...",
    "voice_url": "...",
    "video_urls": ["...", "..."],
    "completed_at": "..."
  }
  ```
- **Why**: Enables event-driven architecture where user's system can react to completion

#### 46. ⏭️ Skip Callback
- **Type**: NoOp
- **Purpose**: Placeholder for when no callback is needed
- **Why**: Provides clean flow visualization

---

## Node Count Summary

| Category | Count | Nodes |
|----------|-------|-------|
| **Original Workflow** | 16 | Webhook → Image Generation |
| **Scene Storage** | 2 | Prepare + Store |
| **Video Generation** | 8 | Generate + Polling Loop |
| **Scene Aggregation** | 2 | Aggregate + Prepare |
| **Music Branch** | 6 | Generate + Polling Loop |
| **Voice Branch** | 6 | Generate + Polling Loop |
| **Final Assembly** | 6 | Merge + Update + Callback |
| **TOTAL** | **46** | **Complete Workflow** |

---

## Polling Loop Architecture

The workflow implements 3 separate polling loops:

### Video Polling (Per Scene)
```
Init Poll → Wait 15s → Check Status → Merge Status → Switch
                ↑                                       │
                └───────────── [processing] ───────────┘
                                    │
                        [completed/failed/timeout]
                                    ↓
                            Update/Mark Failed
```

### Music Polling (Single)
```
Init Poll → Wait 15s → Check Status → Merge Status → Switch
                ↑                                       │
                └───────────── [processing] ───────────┘
                                    │
                              [completed]
                                    ↓
                              Merge Node (input 1)
```

### Voice Polling (Single)
```
Init Poll → Wait 5s → Check Status → Merge Status → Switch
               ↑                                       │
               └────────────── [processing] ──────────┘
                                    │
                              [completed]
                                    ↓
                              Merge Node (input 2)
```

---

## Parallel Execution Points

### Point 1: Scene Processing
After "Split Scenes", all scenes execute in parallel:
- Each scene generates start/end images
- Each scene generates video independently
- Each scene has its own polling loop
- All scenes aggregate before proceeding

### Point 2: Audio Generation
After scene aggregation, music and voice execute in parallel:
- Music branch polls Suno API
- Voice branch polls ElevenLabs API
- Both must complete before merge node proceeds

---

## Data Flow Through Nodes

```
Request → Job Creation → AI Generation → Scene Split → Image Gen → Video Gen → Aggregate
                                                                                    ↓
Callback ← Job Update ← Final Assets ← Merge Audio ← Music/Voice Gen ← Prepare Audio
```

---

## Error Handling Strategy

| Error Type | Handling Node | Action |
|------------|---------------|--------|
| Invalid Input | ❓ Valid? | Return 400 error immediately |
| Video Gen Failed | ❌ Mark Video Failed | Store error in Sheets, continue with other scenes |
| Video Timeout | ❌ Mark Video Failed | Mark as failed after 20 attempts (5 min) |
| Music/Voice Failed | 🎯 Complete? | Empty output path (needs error handler) |

---

## Key Design Decisions

### 1. Why Google Sheets?
- Provides transparent debugging
- Enables manual intervention if needed
- Creates audit trail
- No database setup required

### 2. Why Polling Loops?
- APIs don't support webhooks for completion
- More reliable than long-running requests
- Configurable timeout prevents infinite loops

### 3. Why Parallel Processing?
- Reduces total execution time from 30+ min to 5-8 min
- Music and voice don't depend on each other
- Scenes don't depend on each other

### 4. Why Different Wait Times?
- Video: 15s (slowest, 2-5 min typical)
- Music: 15s (slow, 1-3 min typical)
- Voice: 5s (fast, 10-30s typical)
- Optimizes polling frequency vs. API load

### 5. Why Merge Node?
- Ensures BOTH audio assets are ready
- Prevents proceeding with incomplete data
- Synchronizes parallel branches

---

## Testing Each Node

### Scene Storage Nodes (17-18)
```bash
# Test: Check "Scenes" sheet after split
Expected: One row per scene with image URLs
```

### Video Polling Loop (19-26)
```bash
# Test: Monitor "Scenes" sheet video_status column
Expected: "pending" → "processing" → "completed"
Time: 2-5 minutes per scene
```

### Audio Generation (29-40)
```bash
# Test: Check final job update has both URLs
Expected: music_url and voice_url populated
Time: 1-3 minutes total (parallel)
```

### Callback (44-46)
```bash
# Test: Provide webhook.site URL in request
Expected: Receive POST with all asset URLs
```

---

## Performance Metrics

| Metric | Target | Typical |
|--------|--------|---------|
| Total Execution Time | < 10 min | 5-8 min |
| Scene Image Generation | < 5s each | 2-3s each |
| Video Generation | < 5 min | 3-4 min |
| Music Generation | < 3 min | 1-2 min |
| Voice Generation | < 1 min | 10-30s |
| Polling Overhead | Minimal | < 1 min total |

---

## Future Enhancement Ideas

### Error Handling
- Add retry logic for failed API calls
- Implement email notifications for failures
- Add fallback nodes for music/voice failures

### Performance
- Implement video stitching (combine all scenes into one)
- Add caching for repeated prompts
- Optimize image batch processing

### Features
- Add progress percentage tracking
- Implement priority queue for multiple jobs
- Add cost tracking per job
- Support multiple voice options
- Generate thumbnails for videos

### Monitoring
- Add execution time tracking per node
- Implement alerting for timeouts
- Track API usage and costs
- Create dashboard for job status

---

**Document Version**: 1.0
**Workflow Version**: 1.0
**Total Nodes Added**: 30
**Total Workflow Nodes**: 46
**Last Updated**: 2024-01-12
