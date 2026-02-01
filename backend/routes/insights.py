from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Optional
import os
from openai import OpenAI
from auth_middleware import get_current_user

router = APIRouter()

OPENAI_API_KEY = os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL", "")

client = OpenAI(
    api_key=OPENAI_API_KEY,
    base_url=OPENAI_BASE_URL
)

class InsightsRequest(BaseModel):
    analysis_data: Dict
    language: str = "en"
    business_name: Optional[str] = None
    industry: Optional[str] = None

SYSTEM_PROMPT = """You are a financial advisor AI for small and medium enterprises (SMEs). 
Your role is to provide actionable, easy-to-understand financial insights.
Speak in a non-technical way that business owners can understand.
Be specific with recommendations and provide practical steps.
Focus on:
1. Summarizing financial health clearly
2. Identifying risks and opportunities
3. Suggesting concrete improvements
4. Recommending suitable financial products when appropriate"""

INSIGHTS_PROMPT_EN = """Based on the following financial analysis for {business_name} (Industry: {industry}):

Financial Health Scores:
- Cash Flow Stability: {cash_flow_score}/100 ({cash_flow_status})
- Expense-to-Revenue Ratio: {expense_ratio}% ({expense_status})
- Working Capital: {working_capital_status}
- Debt Burden: {debt_status}
- Overall Creditworthiness: {credit_score}/100 (Grade: {credit_grade})

Please provide:

1. **Health Summary** (5 bullet points summarizing the overall financial health)
2. **Top 3 Risks** (most critical financial risks to address)
3. **Cost Optimization Ideas** (3 specific ways to reduce expenses)
4. **Working Capital Improvements** (3 ways to improve cash flow)
5. **Recommended Financial Products** (generic bank/NBFC products suitable for this business)

Format your response in clear sections with headers."""

INSIGHTS_PROMPT_HI = """निम्नलिखित वित्तीय विश्लेषण के आधार पर {business_name} (उद्योग: {industry}):

वित्तीय स्वास्थ्य स्कोर:
- नकदी प्रवाह स्थिरता: {cash_flow_score}/100 ({cash_flow_status})
- व्यय-से-राजस्व अनुपात: {expense_ratio}% ({expense_status})
- कार्यशील पूंजी: {working_capital_status}
- ऋण बोझ: {debt_status}
- समग्र साख: {credit_score}/100 (ग्रेड: {credit_grade})

कृपया प्रदान करें:

1. **स्वास्थ्य सारांश** (समग्र वित्तीय स्वास्थ्य का सारांश देते हुए 5 बुलेट पॉइंट)
2. **शीर्ष 3 जोखिम** (सबसे महत्वपूर्ण वित्तीय जोखिम)
3. **लागत अनुकूलन विचार** (खर्च कम करने के 3 विशिष्ट तरीके)
4. **कार्यशील पूंजी सुधार** (नकदी प्रवाह में सुधार के 3 तरीके)
5. **अनुशंसित वित्तीय उत्पाद** (इस व्यवसाय के लिए उपयुक्त सामान्य बैंक/NBFC उत्पाद)

अपनी प्रतिक्रिया को हेडर के साथ स्पष्ट खंडों में प्रारूपित करें।"""

@router.post("/generate")
async def generate_insights(request: InsightsRequest, current_user = Depends(get_current_user)):
    try:
        analysis = request.analysis_data
        
        prompt_template = INSIGHTS_PROMPT_HI if request.language == "hi" else INSIGHTS_PROMPT_EN
        
        prompt = prompt_template.format(
            business_name=request.business_name or "Your Business",
            industry=request.industry or "General",
            cash_flow_score=analysis.get("cash_flow_stability", {}).get("score", "N/A"),
            cash_flow_status=analysis.get("cash_flow_stability", {}).get("status", "unknown"),
            expense_ratio=analysis.get("expense_ratio", {}).get("ratio", "N/A"),
            expense_status=analysis.get("expense_ratio", {}).get("status", "unknown"),
            working_capital_status=analysis.get("working_capital", {}).get("status", "unknown"),
            debt_status=analysis.get("debt_burden", {}).get("status", "unknown"),
            credit_score=analysis.get("creditworthiness", {}).get("score", "N/A"),
            credit_grade=analysis.get("creditworthiness", {}).get("grade", "N/A")
        )
        
        response = client.chat.completions.create(
            model="gpt-5.2",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            max_completion_tokens=2048,
            temperature=0.7
        )
        
        insights_text = response.choices[0].message.content
        
        return {
            "insights": insights_text,
            "language": request.language,
            "tokens_used": response.usage.total_tokens if response.usage else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@router.post("/quick-summary")
async def generate_quick_summary(request: InsightsRequest, current_user = Depends(get_current_user)):
    try:
        analysis = request.analysis_data
        credit_score = analysis.get("creditworthiness", {}).get("score", 50)
        credit_grade = analysis.get("creditworthiness", {}).get("grade", "C")
        
        if request.language == "hi":
            prompt = f"""एक SME के लिए जिसका क्रेडिट स्कोर {credit_score}/100 (ग्रेड {credit_grade}) है, 
            एक 2-वाक्य सारांश दें जो उनकी वित्तीय स्थिति और एक प्राथमिकता कार्रवाई बताता है।"""
        else:
            prompt = f"""For an SME with credit score {credit_score}/100 (Grade {credit_grade}), 
            provide a 2-sentence summary of their financial position and one priority action."""
        
        response = client.chat.completions.create(
            model="gpt-5.2",
            messages=[
                {"role": "system", "content": "You are a concise financial advisor. Be brief and actionable."},
                {"role": "user", "content": prompt}
            ],
            max_completion_tokens=200
        )
        
        return {
            "summary": response.choices[0].message.content,
            "language": request.language
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")
