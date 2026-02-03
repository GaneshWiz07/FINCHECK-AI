# FINCHECK AI - Financial Health Assessment Platform

A financial health assessment tool designed for Small and Medium Enterprises (SMEs) in India. It provides AI-powered insights, creditworthiness scoring, and industry benchmarking.

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Python FastAPI
- **AI**: Groq (LLaMA 3.3 70B) for insights generation - Free tier available!
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
- PDF Report Download
- Bilingual Support (English and Hindi)
- Dark/Light Mode
- **No authentication required** - Start analyzing immediately!

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- Python 3.11+

### Setup

1. Clone the repository
2. Install dependencies:

```bash
# Frontend dependencies
npm install

# Backend dependencies (in a virtual environment recommended)
pip install -r backend/requirements.txt
```

3. Create a `.env` file:
```
# Get free API key from https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here
```

### Running Locally

Open **two terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Deployment on Render (Single Service)

### One-Click Deploy with Blueprint

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Deploy with Blueprint**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New** → **Blueprint**
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml` and create the service

3. **Configure Environment Variables**:
   After deployment, set in the service's Environment tab:
   - `GROQ_API_KEY` - Get free from https://console.groq.com

### Manual Deploy

Create a **Web Service** with:
- **Runtime**: Python 3
- **Build Command**: `npm install && npm run build && pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: `GROQ_API_KEY`

## Project Structure

```
fincheck-ai/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # React contexts
│   │   ├── lib/            # Utilities
│   │   └── pages/          # Page components
│   └── index.html
├── backend/                # Backend (FastAPI)
│   ├── routes/             # API routes
│   ├── main.py             # App entry point
│   └── requirements.txt    # Python dependencies
├── render.yaml             # Render deployment config
├── vite.config.ts          # Vite configuration
└── package.json            # Node.js config
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/upload/file` | POST | Upload CSV/XLSX file |
| `/api/analysis/calculate` | POST | Calculate financial metrics |
| `/api/benchmarks/compare` | POST | Compare with industry |
| `/api/insights/generate` | POST | Generate AI insights |
| `/api/profile/me` | GET/PUT | User profile |

## License

© 2026 FINCHECK AI. All rights reserved.
