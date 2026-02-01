# FINCHECK AI - Financial Health Assessment Platform

## Overview
FINCHECK AI is a financial health assessment tool designed for Small and Medium Enterprises (SMEs) in India. It provides AI-powered insights, creditworthiness scoring, and industry benchmarking.

## Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-5.2 via Replit AI Integrations
- **Charts**: Recharts

## Architecture
```
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI application entry point
│   ├── config.py         # Configuration and Supabase client
│   └── routes/           # API route handlers
│       ├── auth.py       # Authentication endpoints
│       ├── profile.py    # User profile management
│       ├── upload.py     # File upload and processing
│       ├── analysis.py   # Financial analysis engine
│       ├── insights.py   # AI-powered insights generation
│       └── benchmarks.py # Industry benchmarking
├── client/               # React frontend
│   └── src/
│       ├── pages/        # Page components
│       │   ├── landing.tsx
│       │   ├── auth.tsx
│       │   └── dashboard.tsx
│       ├── components/   # Reusable components
│       │   ├── Logo.tsx
│       │   ├── ThemeToggle.tsx
│       │   ├── LanguageToggle.tsx
│       │   ├── ScoreGauge.tsx
│       │   ├── FileUpload.tsx
│       │   ├── MetricCard.tsx
│       │   ├── InsightsPanel.tsx
│       │   └── BenchmarkComparison.tsx
│       ├── context/      # React contexts
│       │   ├── AuthContext.tsx
│       │   └── LanguageContext.tsx
│       └── lib/          # Utilities
│           ├── supabase.ts
│           ├── api.ts
│           └── translations.ts
└── server/               # Node.js server (frontend dev + API proxy)
```

## Key Features
1. **CSV/XLSX File Upload** - Auto-detection of financial columns
2. **Financial Analysis Engine** - Calculates:
   - Cash Flow Stability (0-100)
   - Expense Ratio (% of revenue)
   - Working Capital Gap
   - Debt Burden Score
   - Overall Creditworthiness (Grade A-E)
3. **AI-Powered Insights** - Personalized recommendations via GPT-5.2
4. **Industry Benchmarking** - Compare against 10 industry averages
5. **Bilingual Support** - English and Hindi
6. **Dark/Light Mode** - Premium fintech color palette

## Color Palette
- **Deep Slate**: #0F172A (background in dark mode)
- **Fintech Blue**: #2563EB (primary color)
- **Success Green**: #22C55E
- **Warning Orange**: #F59E0B
- **Cyan Accent**: #06B6D4

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/profile/{user_id}` - Get user profile
- `POST /api/upload/file` - Upload financial data
- `POST /api/analysis/calculate` - Calculate financial metrics
- `POST /api/insights/generate` - Generate AI insights
- `GET /api/benchmarks/industries` - List all industries
- `POST /api/benchmarks/compare` - Compare with industry

## Environment Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_SUPABASE_URL` - Supabase URL for frontend
- `VITE_SUPABASE_ANON_KEY` - Supabase key for frontend

## Database Tables (Supabase)
Required tables:
- `profiles` - User profiles with business info
- `financial_uploads` - Uploaded file metadata and data
- `financial_analyses` - Analysis results

## Running the Application
The application runs automatically:
1. Frontend served on port 5000 (Vite + Express)
2. Python backend on port 8000 (uvicorn)
3. Node.js proxies /api/* requests to Python backend

## Development Notes
- Python backend is spawned as a child process from Node.js
- Hot reload enabled for both frontend and backend
- shadcn/ui components with custom fintech theme
- Recharts for data visualization
