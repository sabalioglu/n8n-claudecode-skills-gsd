# R50 Cinematic Adverts - Setup Checklist

## Quick Start Guide

Follow this checklist to get your workflow running in minutes.

---

## ☑️ Step 1: Create Google Sheet

### 1.1 Create New Google Sheet
- [ ] Go to Google Sheets
- [ ] Create a new spreadsheet
- [ ] Name it: "Cinematic Adverts Jobs"

### 1.2 Create "Jobs" Sheet
- [ ] Rename "Sheet1" to "Jobs"
- [ ] Add these column headers in Row 1:
```
job_id | project_name | status | stage | created_at | updated_at | creative_direction | core_image_url | core_elements_url | voice_id | num_scenes | script | music_prompt | music_url | voice_url | completed_at
```

### 1.3 Create "Scenes" Sheet
- [ ] Create a new sheet (tab) named "Scenes"
- [ ] Add these column headers in Row 1:
```
scene_id | job_id | scene_number | scene_title | start_image_url | end_image_url | transition_prompt | video_status | video_url | generation_id | error | created_at
```

### 1.4 Get Sheet ID
- [ ] Copy the Google Sheet ID from the URL
  - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
  - Copy only the `SHEET_ID_HERE` part

---

## ☑️ Step 2: Configure n8n Credentials

### 2.1 Already Configured (from original workflow)
- ✅ Google Gemini API (ID: `Uf69yXezkjIZP6Ah`)
- ✅ OpenRouter API (ID: `hmP48RU4dJfJaaSV`)
- ✅ WaveSpeed AI (ID: `IZqnM1MEeUfWcob3`)
- ✅ Kie AI / Veo (ID: `GY8EwBg1KMzSwh9X`)

### 2.2 Need to Configure

#### Suno AI Credential
- [ ] Go to n8n: Settings → Credentials → Add Credential
- [ ] Select "Header Auth"
- [ ] Name: "Suno AI Credentials"
- [ ] Add header:
  - Name: `Authorization`
  - Value: `Bearer YOUR_SUNO_API_KEY`
- [ ] Save and copy the credential ID

#### ElevenLabs Credential
- [ ] Go to n8n: Settings → Credentials → Add Credential
- [ ] Select "Header Auth"
- [ ] Name: "ElevenLabs Credentials"
- [ ] Add header:
  - Name: `xi-api-key`
  - Value: `YOUR_ELEVENLABS_API_KEY`
- [ ] Save and copy the credential ID

#### Google Sheets Credential
- [ ] Go to n8n: Settings → Credentials → Add Credential
- [ ] Select "Google Sheets API"
- [ ] Follow OAuth flow to connect your Google account
- [ ] Ensure it has access to your "Cinematic Adverts Jobs" sheet

---

## ☑️ Step 3: Update Workflow JSON

### 3.1 Open the Workflow File
- [ ] Open `/home/user/n8n-claudecode-skills-gsd/R50_Cinematic_Adverts_Automated.json` in a text editor

### 3.2 Replace Google Sheet ID
- [ ] Find all instances of: `"value": "YOUR_GOOGLE_SHEET_ID"`
- [ ] Replace with: `"value": "YOUR_ACTUAL_SHEET_ID"`
- [ ] There are 6 occurrences total

**Quick Find/Replace:**
```bash
# Linux/Mac
sed -i 's/YOUR_GOOGLE_SHEET_ID/YOUR_ACTUAL_SHEET_ID/g' R50_Cinematic_Adverts_Automated.json

# Or use your text editor's Find & Replace feature
```

### 3.3 Replace Suno Credential ID
- [ ] Find all instances of: `"id": "SUNO_CREDENTIAL_ID"`
- [ ] Replace with: `"id": "YOUR_ACTUAL_SUNO_CREDENTIAL_ID"`
- [ ] There are 2 occurrences total

### 3.4 Replace ElevenLabs Credential ID
- [ ] Find all instances of: `"id": "ELEVENLABS_CREDENTIAL_ID"`
- [ ] Replace with: `"id": "YOUR_ACTUAL_ELEVENLABS_CREDENTIAL_ID"`
- [ ] There are 2 occurrences total

---

## ☑️ Step 4: Import Workflow to n8n

### 4.1 Import JSON
- [ ] Open n8n
- [ ] Click "Workflows" in the sidebar
- [ ] Click "+ Add Workflow" or import icon
- [ ] Select "Import from File"
- [ ] Choose `R50_Cinematic_Adverts_Automated.json`
- [ ] Click "Import"

### 4.2 Verify Connections
- [ ] Open the imported workflow
- [ ] Check that all nodes are connected (no red error icons)
- [ ] If there are credential errors, click each node and reselect the correct credential

### 4.3 Test Webhook URL
- [ ] Click on the "🚀 Webhook Trigger" node
- [ ] Note the webhook URL (e.g., `https://n8n.example.com/webhook/generate-advert`)
- [ ] Copy this URL for testing

---

## ☑️ Step 5: Activate Workflow

- [ ] Click "Active" toggle in the top-right corner
- [ ] Confirm workflow is activated (toggle should be green/blue)
- [ ] Webhook is now listening for requests

---

## ☑️ Step 6: Test the Workflow

### 6.1 Prepare Test Request
Create a file named `test_request.json`:

```json
{
  "project_name": "Test Campaign",
  "creative_direction": "A futuristic tech advertisement with slow camera movements and cinematic lighting. Features a modern product in a sleek environment.",
  "core_image_url": "https://example.com/product-image.jpg",
  "core_elements_url": "https://example.com/elements-board.jpg",
  "voice_id": "EXAVITQu4vr4xnSDxMaL",
  "num_scenes": 3,
  "webhook_url": "https://webhook.site/YOUR-UNIQUE-URL"
}
```

### 6.2 Send Test Request
```bash
curl -X POST https://YOUR-N8N-DOMAIN/webhook/generate-advert \
  -H "Content-Type: application/json" \
  -d @test_request.json
```

### 6.3 Expected Response
```json
{
  "success": true,
  "job_id": "job_1704123456789_abc123xyz",
  "status": "processing",
  "message": "Your cinematic advert is being generated. Use the job_id to check status.",
  "created_at": "2024-01-01T12:00:00.000Z"
}
```

### 6.4 Monitor Progress
- [ ] Open Google Sheets
- [ ] Check "Jobs" tab for your job
- [ ] Watch "stage" column update as workflow progresses:
  - `initialized` → `prompts_generated` → `scenes_completed` → `final_assets_ready`
- [ ] Check "Scenes" tab for individual scene progress
- [ ] Monitor n8n execution logs in the UI

### 6.5 Wait for Completion
- [ ] Typical completion time: 5-8 minutes
- [ ] Check your webhook callback URL (if provided) for final notification
- [ ] Or check Google Sheets "Jobs" tab for `status: "completed"`

---

## ☑️ Step 7: Verify Final Output

### 7.1 Check Google Sheets
- [ ] "Jobs" tab should show:
  - `status`: "completed"
  - `music_url`: URL to generated music
  - `voice_url`: URL to generated voiceover
- [ ] "Scenes" tab should show:
  - All scenes with `video_status`: "completed"
  - All scenes with `video_url`: URLs to generated videos

### 7.2 Check Callback (if provided)
- [ ] Verify callback webhook received POST request
- [ ] Verify response contains:
  - `job_id`
  - `music_url`
  - `voice_url`
  - `video_urls[]` (array of video URLs)

---

## 🎯 Configuration Summary

### Files to Edit:
```
R50_Cinematic_Adverts_Automated.json
  ├─ Replace: YOUR_GOOGLE_SHEET_ID (6 places)
  ├─ Replace: SUNO_CREDENTIAL_ID (2 places)
  └─ Replace: ELEVENLABS_CREDENTIAL_ID (2 places)
```

### Credentials Needed:
```
✅ Google Gemini API          (already configured)
✅ OpenRouter API             (already configured)
✅ WaveSpeed AI               (already configured)
✅ Kie AI / Veo               (already configured)
⚠️  Suno AI                   (needs configuration)
⚠️  ElevenLabs                (needs configuration)
⚠️  Google Sheets OAuth       (needs configuration)
```

### Google Sheet Structure:
```
Cinematic Adverts Jobs (Spreadsheet)
  ├─ Jobs (Sheet 1)      → 16 columns
  └─ Scenes (Sheet 2)    → 12 columns
```

---

## 🔧 Troubleshooting

### Issue: "Credential not found" error
**Solution:**
- Open each node with the error
- Reselect the credential from the dropdown
- Save the workflow

### Issue: "Sheet not found" error
**Solution:**
- Verify Google Sheet has "Jobs" and "Scenes" tabs (exact names)
- Check Google Sheets credential has access to the sheet
- Verify Sheet ID is correct

### Issue: Webhook not responding
**Solution:**
- Check workflow is activated (toggle is on)
- Verify webhook URL is correct
- Test with `curl -X POST` to ensure connectivity

### Issue: Videos not generating
**Solution:**
- Check Kie AI / Veo credential is valid
- Verify API has sufficient credits
- Check "Scenes" sheet for error messages
- Review n8n execution logs for API errors

### Issue: Music/Voice generation failing
**Solution:**
- Verify Suno/ElevenLabs credentials are correct
- Check API keys have sufficient credits
- Review API response in n8n execution logs
- Verify API endpoints are correct

### Issue: Polling loops timeout
**Solution:**
- Increase `max_attempts` in polling initialization nodes
- Check API service status (may be slow/down)
- Review Google Sheets for partial results

---

## 📞 Support Resources

- **n8n Documentation**: https://docs.n8n.io
- **Workflow File**: `/home/user/n8n-claudecode-skills-gsd/R50_Cinematic_Adverts_Automated.json`
- **Full Documentation**: `/home/user/n8n-claudecode-skills-gsd/R50_WORKFLOW_DOCUMENTATION.md`
- **Visual Flow**: `/home/user/n8n-claudecode-skills-gsd/R50_WORKFLOW_VISUAL_FLOW.txt`

---

## ✅ Setup Complete!

Once all checkboxes are checked, your workflow is ready to generate cinematic advertisements automatically!

**Next Steps:**
1. Test with sample data
2. Adjust polling intervals if needed
3. Scale up with production data
4. Monitor Google Sheets for job tracking
5. Set up monitoring/alerts for failures

**Estimated Setup Time:** 15-30 minutes (first time)

---

**Version**: 1.0
**Last Updated**: 2024-01-12
