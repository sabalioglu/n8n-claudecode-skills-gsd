# R50 Cinematic Adverts - Complete Automated Workflow

## Overview
This n8n workflow automates the entire process of generating cinematic advertisements from a single webhook request. The workflow handles prompt generation, scene creation, video generation with polling, parallel audio generation (music + voice), and final asset delivery.

## File Location
`/home/user/n8n-claudecode-skills-gsd/R50_Cinematic_Adverts_Automated.json`

## Workflow Architecture

### Phase 1: Initialization & Validation
1. **🚀 Webhook Trigger** - Receives POST request at `/generate-advert`
2. **✅ Validate & Create Job** - Validates input and generates unique job ID
3. **❓ Valid?** - Routes to error or success path
4. **❌ Return Error** - Returns 400 error for invalid requests
5. **📝 Create Job Record** - Stores initial job in Google Sheets "Jobs" tab
6. **✅ Return Job ID** - Returns immediate response with job_id for tracking

### Phase 2: AI Prompt Generation
7. **🔍 Analyze Elements Board** - Uses Gemini 3 Pro to analyze the elements board image
8. **🤖 Generate Prompts (AI Agent)** - OpenRouter + Gemini generates script, music prompt, and scene prompts
9. **🧠 LLM Model** - Google Gemini 3 Pro Preview via OpenRouter
10. **📋 Structure Output** - JSON schema parser for consistent output
11. **💭 Think Tool** - Enables AI reasoning before generation
12. **🔗 Merge Prompts with Job** - Combines AI output with job data
13. **💾 Update Job (Prompts)** - Updates Google Sheets with generated prompts

### Phase 3: Scene Processing (Per Scene Loop)
14. **✂️ Split Scenes** - Splits scenes array into individual items
15. **🖼️ Create Start Frame** - WaveSpeed API generates starting image
16. **🖼️ Create End Frame** - WaveSpeed API generates ending image using start frame
17. **📦 Prepare Scene Data** - Packages scene data with image URLs
18. **💾 Store Scene to Sheets** - Saves scene metadata to "Scenes" tab

### Phase 4: Video Generation with Polling Loop (Per Scene)
19. **🎬 Generate Video (Veo)** - Kie AI Veo API creates video from start/end frames
20. **🔄 Init Video Poll** - Initializes polling state (max 20 attempts)
21. **⏱️ Wait 15s** - Wait node (15 second intervals)
22. **🔍 Check Video Status** - Queries Veo API for generation status
23. **🔗 Merge Video Status** - Combines polling state with API response
24. **🎯 Video Complete?** - Switch node routes based on status:
    - **completed** → Update scene with video URL
    - **failed** → Mark scene as failed
    - **timeout** → Mark scene as failed
    - **processing** → Loop back to Wait 15s
25. **✅ Update Scene (Video Complete)** - Updates "Scenes" sheet with video URL
26. **❌ Mark Video Failed** - Marks scene as failed in Sheets

### Phase 5: Scene Aggregation
27. **📊 Aggregate All Scenes** - Waits for all scenes to complete, aggregates into array
28. **🎵 Prepare Audio Generation** - Prepares data for parallel audio generation

### Phase 6: Parallel Audio Generation

#### Music Branch (runs in parallel)
29. **🎵 Generate Music (Suno)** - Calls Suno AI to generate background music
30. **🔄 Init Music Poll** - Initializes music polling state
31. **⏱️ Wait Music 15s** - Wait 15 seconds
32. **🔍 Check Music Status** - Queries Suno API for status
33. **🔗 Merge Music Status** - Combines polling data with response
34. **🎯 Music Complete?** - Routes based on status:
    - **completed** → Proceeds to merge
    - **failed** → Stops (error handling needed)
    - **processing** → Loop back to Wait Music 15s

#### Voice Branch (runs in parallel)
35. **🎤 Generate Voice (ElevenLabs)** - Calls ElevenLabs TTS API
36. **🔄 Init Voice Poll** - Initializes voice polling state
37. **⏱️ Wait Voice 5s** - Wait 5 seconds (voice is typically faster)
38. **🔍 Check Voice Status** - Queries ElevenLabs API for status
39. **🔗 Merge Voice Status** - Combines polling data with response
40. **🎯 Voice Complete?** - Routes based on status:
    - **completed** → Proceeds to merge
    - **failed** → Stops (error handling needed)
    - **processing** → Loop back to Wait Voice 5s

### Phase 7: Final Assembly & Delivery
41. **🔗 Merge Music + Voice** - Merge node waits for both music AND voice to complete
42. **📦 Prepare Final Assets** - Packages all URLs (music, voice, videos)
43. **✅ Update Job (Complete)** - Updates "Jobs" sheet with final status and URLs
44. **❓ Has Callback?** - Checks if webhook_url was provided
45. **📞 Send Callback Webhook** - Sends completion notification to user's webhook (if provided)
46. **⏭️ Skip Callback** - No-op node if no callback URL

## API Integrations

### 1. Google Gemini (via Google PaLM API)
- **Purpose**: Analyze elements board image
- **Credential ID**: `Uf69yXezkjIZP6Ah`
- **Model**: `models/gemini-3-pro-preview`

### 2. OpenRouter (Gemini 3 Pro)
- **Purpose**: Generate prompts (script, music, scenes)
- **Credential ID**: `hmP48RU4dJfJaaSV`
- **Model**: `google/gemini-3-pro-preview`

### 3. WaveSpeed AI (Nano Banana Pro)
- **Purpose**: Generate start and end frame images
- **Credential ID**: `IZqnM1MEeUfWcob3` (httpHeaderAuth)
- **Endpoint**: `https://api.wavespeed.ai/api/v3/google/nano-banana-pro/edit`
- **Rate Limiting**: 1 request per 2 seconds (batch processing)

### 4. Kie AI (Veo Video Generation)
- **Purpose**: Generate videos from image pairs
- **Credential ID**: `GY8EwBg1KMzSwh9X` (httpHeaderAuth)
- **Endpoints**:
  - POST: `https://kie.wavespeed.ai/api/veo/generations`
  - GET: `https://kie.wavespeed.ai/api/veo/generations/{id}`
- **Polling**: 15 second intervals, max 20 attempts (5 minutes total)

### 5. Suno AI (Music Generation)
- **Purpose**: Generate background music
- **Credential ID**: `SUNO_CREDENTIAL_ID` (httpHeaderAuth) - **USER MUST CONFIGURE**
- **Endpoints**:
  - POST: `https://api.suno.ai/v1/generate`
  - GET: `https://api.suno.ai/v1/generate/{id}`
- **Polling**: 15 second intervals, max 20 attempts

### 6. ElevenLabs (Voice Generation)
- **Purpose**: Text-to-speech for script voiceover
- **Credential ID**: `ELEVENLABS_CREDENTIAL_ID` (httpHeaderAuth) - **USER MUST CONFIGURE**
- **Endpoints**:
  - POST: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
  - GET: `https://api.elevenlabs.io/v1/history/{id}`
- **Polling**: 5 second intervals, max 20 attempts
- **Default Voice ID**: `EXAVITQu4vr4xnSDxMaL`

### 7. Google Sheets
- **Purpose**: Store job metadata and scene data
- **Document ID**: `YOUR_GOOGLE_SHEET_ID` - **USER MUST CONFIGURE**
- **Sheets Required**:
  - **Jobs**: Stores job metadata, status, and final URLs
  - **Scenes**: Stores individual scene data, images, and video URLs

## Required Setup

### 1. Create Google Sheet
Create a Google Sheet with two tabs:

#### Jobs Sheet Columns:
- `job_id` (text)
- `project_name` (text)
- `status` (text)
- `stage` (text)
- `created_at` (datetime)
- `updated_at` (datetime)
- `creative_direction` (text)
- `core_image_url` (text)
- `core_elements_url` (text)
- `voice_id` (text)
- `num_scenes` (number)
- `script` (text)
- `music_prompt` (text)
- `music_url` (text)
- `voice_url` (text)
- `completed_at` (datetime)

#### Scenes Sheet Columns:
- `scene_id` (text)
- `job_id` (text)
- `scene_number` (number)
- `scene_title` (text)
- `start_image_url` (text)
- `end_image_url` (text)
- `transition_prompt` (text)
- `video_status` (text)
- `video_url` (text)
- `generation_id` (text)
- `error` (text)
- `created_at` (datetime)

### 2. Configure Credentials in n8n

#### Already Configured:
- ✅ Google Gemini API
- ✅ OpenRouter API
- ✅ WaveSpeed AI
- ✅ Kie AI (Veo)

#### Need Configuration:
- ⚠️ **Suno AI** - Replace `SUNO_CREDENTIAL_ID` with actual credential
- ⚠️ **ElevenLabs** - Replace `ELEVENLABS_CREDENTIAL_ID` with actual credential
- ⚠️ **Google Sheets** - Replace `YOUR_GOOGLE_SHEET_ID` with actual sheet ID

### 3. Update Credential IDs
Search and replace in the JSON file:
```bash
# Suno AI
Find: "id": "SUNO_CREDENTIAL_ID"
Replace: "id": "YOUR_ACTUAL_SUNO_CREDENTIAL_ID"

# ElevenLabs
Find: "id": "ELEVENLABS_CREDENTIAL_ID"
Replace: "id": "YOUR_ACTUAL_ELEVENLABS_CREDENTIAL_ID"

# Google Sheets
Find: "value": "YOUR_GOOGLE_SHEET_ID"
Replace: "value": "YOUR_ACTUAL_GOOGLE_SHEET_ID"
```

## Input Schema

Send POST request to webhook URL with this JSON body:

```json
{
  "project_name": "Gentle Monster Campaign",
  "creative_direction": "High-fashion futuristic ad featuring Makima-inspired character in a Mars-toned corridor with glass pillars. Slow camera movements, macro details on eyes, experimental electronic music.",
  "core_image_url": "https://example.com/character-reference.jpg",
  "core_elements_url": "https://example.com/elements-board.jpg",
  "voice_id": "EXAVITQu4vr4xnSDxMaL",
  "num_scenes": 5,
  "webhook_url": "https://your-app.com/callback"
}
```

### Required Fields:
- `project_name` - Name of the project
- `creative_direction` - Detailed description of desired outcome
- `core_image_url` - URL to main character/product reference image
- `core_elements_url` - URL to elements board (character, setting, product sections)

### Optional Fields:
- `voice_id` - ElevenLabs voice ID (default: "EXAVITQu4vr4xnSDxMaL")
- `num_scenes` - Number of scenes to generate (default: 5)
- `webhook_url` - URL to receive completion callback (optional)

## Output Schema

### Immediate Response (from webhook):
```json
{
  "success": true,
  "job_id": "job_1704123456789_abc123xyz",
  "status": "processing",
  "message": "Your cinematic advert is being generated. Use the job_id to check status.",
  "status_url": "https://n8n.example.com/webhook/check-status?job_id=job_1704123456789_abc123xyz",
  "created_at": "2024-01-01T12:00:00.000Z"
}
```

### Final Callback (if webhook_url provided):
```json
{
  "job_id": "job_1704123456789_abc123xyz",
  "project_name": "Gentle Monster Campaign",
  "status": "completed",
  "music_url": "https://suno.ai/output/music_12345.mp3",
  "voice_url": "https://elevenlabs.io/output/voice_67890.mp3",
  "video_urls": [
    "https://kie.ai/veo/video_001.mp4",
    "https://kie.ai/veo/video_002.mp4",
    "https://kie.ai/veo/video_003.mp4",
    "https://kie.ai/veo/video_004.mp4",
    "https://kie.ai/veo/video_005.mp4"
  ],
  "completed_at": "2024-01-01T12:15:30.000Z"
}
```

## Polling Mechanism

The workflow uses three separate polling loops:

### Video Polling (Per Scene)
- **Interval**: 15 seconds
- **Max Attempts**: 20 (5 minutes total)
- **Status Check**: Queries Veo API for generation status
- **Completion**: Updates "Scenes" sheet with video URL
- **Failure**: Marks scene as failed, continues with other scenes

### Music Polling (Single)
- **Interval**: 15 seconds
- **Max Attempts**: 20 (5 minutes total)
- **Status Check**: Queries Suno API for generation status
- **Completion**: Proceeds to merge with voice

### Voice Polling (Single)
- **Interval**: 5 seconds (faster than music/video)
- **Max Attempts**: 20 (100 seconds total)
- **Status Check**: Queries ElevenLabs API for generation status
- **Completion**: Proceeds to merge with music

## Parallel Execution

The workflow executes in parallel at two points:

### 1. Scene Processing
All scenes are processed in parallel after the split. Each scene goes through:
- Image generation (start + end)
- Video generation
- Video polling loop
- Scene storage

### 2. Audio Generation
Music and voice generation happen simultaneously:
```
Scenes Complete
       ↓
    [SPLIT]
   ↙      ↘
Music    Voice
  ↓        ↓
Poll     Poll
  ↓        ↓
   ↘      ↙
    [MERGE]
       ↓
 Final Assets
```

## Error Handling

The workflow includes error handling for:

1. **Validation Errors**: Returns 400 with error message
2. **Video Generation Failures**: Marks scene as failed in Sheets
3. **Timeout Handling**: Max attempts prevent infinite loops
4. **API Failures**: Stored in Google Sheets for debugging

## Performance Considerations

### Expected Execution Time:
- **Prompt Generation**: 30-60 seconds
- **Image Generation**: 2-5 seconds per image (10-25s for 5 scenes)
- **Video Generation**: 2-5 minutes per scene (parallel)
- **Music Generation**: 1-3 minutes
- **Voice Generation**: 10-30 seconds
- **Total**: ~5-8 minutes for complete workflow

### Rate Limiting:
- WaveSpeed images: Batch processing with 2-second intervals
- Veo videos: No explicit rate limit, but polling ensures compliance
- Suno/ElevenLabs: Polling prevents excessive requests

## Testing

### Test the Workflow:
1. Import JSON into n8n
2. Configure all credentials and Google Sheet ID
3. Activate workflow
4. Send test POST request to webhook URL
5. Monitor execution in n8n UI
6. Check Google Sheets for job progress
7. Wait for callback (if webhook_url provided)

### Debug Tips:
- Check Google Sheets "Jobs" tab for stage progression
- Check "Scenes" tab for individual scene status
- Review n8n execution logs for API errors
- Verify all credential IDs are correct
- Ensure Google Sheet has both "Jobs" and "Scenes" tabs

## Future Enhancements

Potential improvements:
- Add email notification on completion
- Implement video stitching to combine all scenes
- Add progress percentage updates to Google Sheets
- Implement retry logic for failed API calls
- Add cost tracking for API usage
- Support multiple language voices
- Add thumbnail generation
- Implement priority queue for multiple jobs

## Support

For issues or questions:
1. Check Google Sheets for error messages
2. Review n8n execution logs
3. Verify all API credentials are valid
4. Ensure sufficient API credits/quota
5. Check webhook URL is accessible (if using callbacks)

---

**Workflow Version**: 1.0
**Last Updated**: 2024-01-12
**Total Nodes**: 46
**Estimated Execution Time**: 5-8 minutes
