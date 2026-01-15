# Aurralis Backend

FastAPI backend for Aurralis AI transaction assistant.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /api/intent` - Process user query
- `POST /api/approve/{activity_id}` - Approve transaction
- `POST /api/deny/{activity_id}` - Deny transaction
- `GET /api/activities` - Get all activities
- `GET /api/policy` - Get current policy
- `PUT /api/policy` - Update policy

## Environment Variables

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `GEMINI_API_KEY` - Google Gemini API key
- `CIRCLE_API_KEY` - Circle API key (sandbox)
- `CIRCLE_BASE_URL` - Circle API base URL

## Architecture

- **Intent Processor**: Gemini AI integration for query understanding
- **Policy Validator**: Transaction validation against rules
- **Circle Wrapper**: USDC transfer execution (mock for demo)
- **Proof Generator**: Blockchain explorer links

## State Management

- State locking prevents double execution
- Real-time updates via Supabase
- Timeout handling for slow transactions
