# Aurralis Setup Guide

Complete setup instructions for the Aurralis AI Transaction Assistant.

---

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account
- Google Gemini API key (optional, for AI features)
- Circle API sandbox key (optional, for real transactions)

---

## Part 1: Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Database Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file `Aurralis/supabase/schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** to execute

This will create:
- `policies` table
- `agent_activities` table
- `transactions` table
- Indexes and triggers
- Default policy record

### 3. Verify Tables

Go to **Table Editor** and verify you see:
- ✅ policies (1 row)
- ✅ agent_activities (0 rows)
- ✅ transactions (0 rows)

---

## Part 2: Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory

```bash
cd "c:\Users\Rana PC\Desktop\Aurralis\Aurralis"
```

### 2. Install Dependencies

Dependencies should already be installed, but if needed:

```bash
npm install
```

### 3. Configure Environment

The `.env.local` file is already created with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://brmonwostzbqzxlsffzb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_26yxEXxATRYwchbdRsKPVg_jVbYlvgB
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Frontend

The frontend is already running:

```bash
npm run dev
```

Access at: http://localhost:3000

---

## Part 3: Backend Setup (FastAPI)

### 1. Navigate to Backend Directory

```bash
cd "c:\Users\Rana PC\Desktop\Aurralis\backend"
```

### 2. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Edit `backend/.env` and add your API keys:

```env
# Supabase (already filled)
SUPABASE_URL=https://brmonwostzbqzxlsffzb.supabase.co
SUPABASE_KEY=sb_publishable_26yxEXxATRYwchbdRsKPVg_jVbYlvgB
SUPABASE_SERVICE_KEY=your_service_role_key_here  # Get from Supabase Settings > API

# Gemini API (Get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Circle API (Get from https://developers.circle.com/)
CIRCLE_API_KEY=your_circle_sandbox_key_here
CIRCLE_BASE_URL=https://api-sandbox.circle.com

# App Config (already filled)
APP_ENV=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 5. Get Supabase Service Key

1. Open your Supabase project
2. Go to **Settings** > **API**
3. Copy the `service_role` key (NOT the anon key)
4. Add it to `SUPABASE_SERVICE_KEY` in `.env`

### 6. Run Backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Access API docs at: http://localhost:8000/docs

---

## Part 4: Testing the System

### 1. Check Backend Health

Open http://localhost:8000/health

You should see:
```json
{"status": "healthy"}
```

### 2. Test Frontend

1. Open http://localhost:3000
2. You should see the chat interface
3. Navigate to "Policy" - you should see:
   - Max Transaction: $1,000
   - Monthly Limit: $5,000
   - Approved Vendors list

### 3. Test Complete Flow

1. **Send a transaction request:**
   ```
   Send $50 to Stripe
   ```

2. **AI processes the request:**
   - Shows thinking skeleton (pulsing dots)
   - After 2 seconds, decision card appears

3. **Decision card shows:**
   - Amount: $50.00
   - Recipient: Stripe (0x1234...5678)
   - AI Reasoning
   - Policy checks (all should pass)

4. **Click "Approve":**
   - Button shows loading state
   - Toast notification appears
   - After 2 seconds, transaction executes
   - State changes to "Executing" → "Confirmed"

5. **Check Activity tab:**
   - Should show the approved transaction
   - Green checkmark icon
   - Transaction hash displayed
   - "View Explorer" button

### 4. Test Demo Mode

1. Click the demo mode toggle (top-right)
2. "Demo Mode" badge appears
3. Transactions now complete instantly (1s instead of 2s)
4. Perfect for presentations!

---

## Part 5: Real-Time Sync Verification

### 1. Open Multiple Browser Windows

- Window 1: http://localhost:3000
- Window 2: http://localhost:3000

### 2. Approve Transaction in Window 1

Watch Window 2 - it should update automatically without refresh!

This is Supabase Realtime in action.

---

## Troubleshooting

### Frontend Issues

**"Failed to fetch policy"**
- Check Supabase connection
- Verify database migration ran successfully
- Check browser console for errors

**Real-time not working**
- Check Supabase Realtime is enabled in dashboard
- Verify channel subscriptions in browser devtools

### Backend Issues

**"Module not found" errors**
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`

**"SUPABASE_SERVICE_KEY not set"**
- Get service key from Supabase Settings > API
- Add to `backend/.env`

**"Gemini API error"**
- Get API key from https://makersuite.google.com/app/apikey
- Add to `backend/.env`
- Restart backend server

### Database Issues

**Tables not created**
- Re-run the SQL migration in Supabase SQL Editor
- Check for error messages in the SQL Editor

**No default policy**
- Manually insert via Supabase Table Editor:
  ```sql
  INSERT INTO policies (max_tx_amount, monthly_budget, current_monthly_spent)
  VALUES (1000, 5000, 0);
  ```

---

## Demo Mode Features

When demo mode is enabled:

✅ Instant transaction confirmations  
✅ Mock transaction hashes generated  
✅ No real Circle API calls  
✅ Perfect for 3-minute judge demo  
✅ Toggle on/off anytime  

---

## Architecture Overview

```
┌─────────────────┐
│   Next.js UI    │ ← User interacts
└────────┬────────┘
         │ HTTP/WebSocket
┌────────▼────────┐
│  FastAPI Backend│ ← Gemini AI + Circle API
└────────┬────────┘
         │ REST API
┌────────▼────────┐
│    Supabase     │ ← PostgreSQL + Realtime
└─────────────────┘
```

---

## What's Implemented

✅ Conversational chat interface  
✅ Decision cards with approve/deny  
✅ Policy dashboard with live spending  
✅ Activity timeline with status indicators  
✅ Real-time UI updates (WebSocket)  
✅ State locking (prevent double-click)  
✅ Timeout handling  
✅ Gemini AI integration  
✅ Circle API wrapper (mock)  
✅ Blockchain proof with explorer links  
✅ Toast notifications  
✅ Demo mode toggle  

---

## Next Steps

1. **Add Real Gemini API Key** - Enable AI reasoning
2. **Add Circle API Key** - Enable real USDC transfers
3. **Deploy Backend** - Use Railway, Render, or Vercel
4. **Deploy Frontend** - Use Vercel or Netlify
5. **Production Supabase** - Upgrade from free tier
6. **Add Authentication** - Implement user accounts

---

## Support

For issues or questions:
1. Check browser console (F12)
2. Check backend logs
3. Verify Supabase connectivity
4. Review this setup guide

**Your Aurralis system is ready! 🚀**
