# Authentication middleware - DISABLED
# All endpoints are now publicly accessible

class MockUser:
    """Mock user object for compatibility"""
    def __init__(self):
        self.id = "demo-user-001"
        self.email = "demo@fincheck.ai"
        self.user_metadata = {
            "business_name": "Demo Business",
            "industry": "technology",
            "annual_revenue": "1Cr-5Cr",
            "language": "en"
        }

# Always return mock user - no authentication required
async def get_current_user():
    """Return mock user since authentication is disabled"""
    return MockUser()

async def get_optional_user():
    """Return mock user since authentication is disabled"""
    return MockUser()
