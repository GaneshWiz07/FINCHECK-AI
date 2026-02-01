import os
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
OPENAI_API_KEY = os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL", "")

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

supabase: Client = get_supabase_client()
