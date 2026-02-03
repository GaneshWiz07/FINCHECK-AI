import os

# Groq API Configuration (OpenAI-compatible)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"

# Supabase has been removed - authentication is disabled
supabase = None
