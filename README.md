# FINCHECK AI - Financial Health Assessment Platform

A financial health assessment tool designed for Small and Medium Enterprises (SMEs) in India. It provides AI-powered insights, creditworthiness scoring, and industry benchmarking.

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT for insights generation
- **Charts**: Recharts

## Features

- CSV/XLSX File Upload with auto-detection of financial columns
- Financial Analysis Engine calculating:
  - Cash Flow Stability (0-100)
  - Expense Ratio (% of revenue)
  - Working Capital Gap
  - Debt Burden Score
  - Overall Creditworthiness (Grade A-E)
- AI-Powered Insights with personalized recommendations
- Industry Benchmarking against 10 industry averages
- Bilingual Support (English and Hindi)
- Dark/Light Mode

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account

### Environment Variables

Create a `.env` file with:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5000
```

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

2. Start the frontend:
```bash
npm run dev
```

## Database Tables (Supabase)

Required tables:
- `profiles` - User profiles with business info
- `financial_uploads` - Uploaded file metadata and data
- `financial_analyses` - Analysis results

## License

© 2026 FINCHECK AI. All rights reserved.
