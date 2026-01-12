# Google Sheets Database Setup Guide

## Overview
This Google Sheets setup will act as your database during the testing/MVP phase. It's easy to view, debug, and share with your team. Later, you can migrate to Supabase without changing your workflow logic.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Cinematic Adverts Jobs Database"**

## Step 2: Create Required Sheets

### Sheet 1: "Jobs" (Main Job Tracking)

Create a sheet named **"Jobs"** with these columns:

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `job_id` | Text | Unique job identifier | `job_1704067200000_abc123` |
| `project_name` | Text | Name of the project | `Nike Air Max Campaign` |
| `status` | Text | Current job status | `processing`, `completed`, `failed` |
| `stage` | Text | Current pipeline stage | `initialized`, `prompts_generated`, `images_created`, etc. |
| `created_at` | Timestamp | Job creation time | `2024-01-12T10:30:00Z` |
| `updated_at` | Timestamp | Last update time | `2024-01-12T10:35:00Z` |
| `creative_direction` | Text | User's creative brief | `Cinematic sci-fi product reveal...` |
| `core_image_url` | URL | Product/hero image | `https://example.com/product.jpg` |
| `core_elements_url` | URL | Elements board image | `https://example.com/elements.jpg` |
| `voice_id` | Text | ElevenLabs voice ID | `EXAVITQu4vr4xnSDxMaL` |
| `num_scenes` | Number | Number of scenes | `5` |
| `script` | Text | Generated voiceover script | `Introducing the future...` |
| `music_prompt` | Text | Generated music prompt | `Upbeat electronic cinematic...` |
| `video_urls` | Text | Comma-separated video URLs | `https://cdn.com/video1.mp4,...` |
| `music_url` | URL | Generated music file | `https://cdn.com/music.mp3` |
| `voice_url` | URL | Generated voiceover file | `https://cdn.com/voice.mp3` |
| `error_message` | Text | Error details if failed | `API timeout on video generation` |
| `webhook_url` | URL | Callback URL (optional) | `https://yourapp.com/webhook` |
| `total_duration_seconds` | Number | Total processing time | `245` |

**Header Row (Row 1):**
```
job_id | project_name | status | stage | created_at | updated_at | creative_direction | core_image_url | core_elements_url | voice_id | num_scenes | script | music_prompt | video_urls | music_url | voice_url | error_message | webhook_url | total_duration_seconds
```

### Sheet 2: "Scenes" (Individual Scene Details)

Create a sheet named **"Scenes"** with these columns:

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `scene_id` | Text | Unique scene identifier | `scene_job123_1` |
| `job_id` | Text | Parent job ID | `job_1704067200000_abc123` |
| `scene_number` | Number | Scene sequence number | `1` |
| `scene_title` | Text | Scene name | `Scene 1 - The Eye` |
| `starting_image_prompt` | Text | YAML prompt for start frame | `Composition: Extreme close-up...` |
| `ending_image_prompt` | Text | Prompt for end frame | `Camera dollies closer...` |
| `transition_prompt` | Text | Video transition description | `Her focus shifts...` |
| `start_image_url` | URL | Generated start frame | `https://cdn.com/scene1_start.png` |
| `end_image_url` | URL | Generated end frame | `https://cdn.com/scene1_end.png` |
| `video_url` | URL | Generated scene video | `https://cdn.com/scene1_video.mp4` |
| `video_task_id` | Text | Veo API task ID (for polling) | `veo_task_abc123` |
| `video_status` | Text | Video generation status | `processing`, `completed`, `failed` |
| `created_at` | Timestamp | Scene creation time | `2024-01-12T10:31:00Z` |
| `updated_at` | Timestamp | Last update time | `2024-01-12T10:35:00Z` |

**Header Row (Row 1):**
```
scene_id | job_id | scene_number | scene_title | starting_image_prompt | ending_image_prompt | transition_prompt | start_image_url | end_image_url | video_url | video_task_id | video_status | created_at | updated_at
```

### Sheet 3: "API_Keys" (Configuration)

Create a sheet named **"API_Keys"** for storing configuration (NOT actual API keys - those go in n8n credentials):

| Column Name | Type | Description |
|------------|------|-------------|
| `setting_name` | Text | Configuration key name |
| `setting_value` | Text | Configuration value |

**Example Rows:**
```
max_concurrent_videos | 3
default_voice_id | EXAVITQu4vr4xnSDxMaL
default_num_scenes | 5
video_polling_interval_seconds | 15
video_max_wait_minutes | 5
music_polling_interval_seconds | 20
music_max_wait_minutes | 5
enable_webhook_callbacks | true
```

### Sheet 4: "Usage_Tracking" (Optional - for SaaS billing)

| Column Name | Type | Description |
|------------|------|-------------|
| `usage_id` | Text | Unique usage record ID |
| `job_id` | Text | Related job ID |
| `api_name` | Text | Which API was called |
| `api_calls` | Number | Number of API calls |
| `cost_usd` | Number | Estimated cost |
| `timestamp` | Timestamp | When the usage occurred |

**Example:**
```
usage_1 | job_123 | wavespeed_nanoBanana | 2 | 0.04 | 2024-01-12T10:32:00Z
usage_2 | job_123 | kie_veo | 5 | 0.50 | 2024-01-12T10:35:00Z
```

## Step 3: Format Your Sheets

### Jobs Sheet Formatting:
1. **Freeze Row 1** (header row): View → Freeze → 1 row
2. **Set Column Widths**:
   - `job_id`: 200px
   - `project_name`: 200px
   - `status`: 100px
   - `stage`: 150px
   - `creative_direction`: 300px
   - `script`: 400px
   - All URLs: 250px
3. **Add Data Validation for `status` column**:
   - Select the `status` column (column C)
   - Data → Data validation
   - Criteria: List of items
   - Items: `processing,completed,failed,timeout`
4. **Add Data Validation for `stage` column**:
   - Select the `stage` column (column D)
   - Data → Data validation
   - Criteria: List of items
   - Items: `initialized,prompts_generated,images_created,videos_processing,videos_completed,audio_processing,audio_completed,completed`

### Conditional Formatting:

**For Status Column** (makes it visual):
1. Select column C (status)
2. Format → Conditional formatting
3. Add rules:
   - **Green background**: `Text is exactly` → `completed`
   - **Yellow background**: `Text is exactly` → `processing`
   - **Red background**: `Text is exactly` → `failed`
   - **Orange background**: `Text is exactly` → `timeout`

**For Stage Column**:
1. Select column D (stage)
2. Format → Conditional formatting
3. Add rules:
   - **Light blue**: `Text contains` → `processing`
   - **Light green**: `Text is exactly` → `completed`

## Step 4: Connect to n8n

### Get Your Google Sheet ID:
1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. Copy the `YOUR_SHEET_ID` part

### Set up Google Sheets Credentials in n8n:
1. In n8n, go to **Credentials** → **New**
2. Select **Google Sheets API**
3. Choose **OAuth2** authentication
4. Click **Connect My Account**
5. Authorize n8n to access your Google Sheets
6. Test the connection

### Update Workflow:
1. Open the workflow JSON file
2. Find all instances of `YOUR_GOOGLE_SHEET_ID`
3. Replace with your actual Sheet ID
4. Save and import to n8n

## Step 5: Test Your Setup

### Test with Sample Data:

Use this cURL command to test your webhook:

```bash
curl -X POST https://your-n8n-instance.com/webhook/generate-advert \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Test Campaign 001",
    "creative_direction": "A cinematic sci-fi product reveal with futuristic lighting and smooth camera movements. The product should feel premium and cutting-edge.",
    "core_image_url": "https://example.com/product-image.jpg",
    "core_elements_url": "https://example.com/elements-board.jpg",
    "voice_id": "EXAVITQu4vr4xnSDxMaL",
    "num_scenes": 3
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "job_id": "job_1704067200000_abc123",
  "status": "processing",
  "message": "Your cinematic advert is being generated. Use the job_id to check status.",
  "status_url": "https://your-n8n-instance.com/webhook/check-status?job_id=job_1704067200000_abc123",
  "created_at": "2024-01-12T10:30:00Z"
}
```

### Check Your Google Sheet:
1. Open the **Jobs** sheet
2. You should see a new row with:
   - `job_id`: The generated job ID
   - `status`: `processing`
   - `stage`: `initialized`
   - All your input data populated

## Step 6: Monitoring & Debugging

### How to Monitor Jobs:

**View All Active Jobs:**
```
Filter: status = "processing"
Sort by: created_at (newest first)
```

**View Failed Jobs:**
```
Filter: status = "failed"
Check: error_message column for details
```

**View Completed Jobs:**
```
Filter: status = "completed"
Check: video_urls, music_url, voice_url columns
```

### Common Issues:

| Issue | Sheet Column to Check | Solution |
|-------|----------------------|----------|
| Job stuck in processing | `stage`, `updated_at` | Check which stage it's stuck at, review n8n execution logs |
| Missing video URLs | `video_urls`, `error_message` | Check if Veo API had errors |
| No music generated | `music_url`, `error_message` | Check if Suno API had errors |
| Script is empty | `script`, `music_prompt` | AI Agent may have failed, check prompts |

## Step 7: Migration to Supabase (When Ready)

When you're ready to scale, migrate to Supabase with minimal changes:

### Supabase Tables (equivalent to your sheets):

**`jobs` table:**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT UNIQUE NOT NULL,
  project_name TEXT NOT NULL,
  status TEXT NOT NULL,
  stage TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  creative_direction TEXT,
  core_image_url TEXT,
  core_elements_url TEXT,
  voice_id TEXT,
  num_scenes INTEGER,
  script TEXT,
  music_prompt TEXT,
  video_urls TEXT[],
  music_url TEXT,
  voice_url TEXT,
  error_message TEXT,
  webhook_url TEXT,
  total_duration_seconds INTEGER
);

CREATE INDEX idx_jobs_job_id ON jobs(job_id);
CREATE INDEX idx_jobs_status ON jobs(status);
```

**`scenes` table:**
```sql
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id TEXT UNIQUE NOT NULL,
  job_id TEXT REFERENCES jobs(job_id),
  scene_number INTEGER,
  scene_title TEXT,
  starting_image_prompt TEXT,
  ending_image_prompt TEXT,
  transition_prompt TEXT,
  start_image_url TEXT,
  end_image_url TEXT,
  video_url TEXT,
  video_task_id TEXT,
  video_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scenes_job_id ON scenes(job_id);
```

### n8n Changes:
1. Replace **Google Sheets** nodes with **Supabase** nodes
2. Update queries to use SQL instead of sheet operations
3. All logic stays the same!

## Benefits of Starting with Google Sheets

✅ **Visual**: See all data at a glance
✅ **Easy Debugging**: Manually edit rows to test scenarios
✅ **No Setup**: No database provisioning needed
✅ **Shareable**: Easily share with team members
✅ **Free**: No database costs during testing
✅ **Fast Iteration**: Change schema instantly by adding columns

## Next Steps

1. ✅ Set up your Google Sheet with the schema above
2. ✅ Connect n8n to your Google Sheet
3. ✅ Import the automated workflow
4. ✅ Test with sample data
5. ✅ Monitor the Jobs sheet to see progress in real-time

Once you have real users and need better performance, migration to Supabase is straightforward!
