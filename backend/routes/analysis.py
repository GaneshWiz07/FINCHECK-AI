from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import json

router = APIRouter()

class FinancialData(BaseModel):
    revenue: Optional[List[float]] = []
    expenses: Optional[List[float]] = []
    cash_inflow: Optional[List[float]] = []
    cash_outflow: Optional[List[float]] = []
    receivables: Optional[List[float]] = []
    payables: Optional[List[float]] = []
    loans: Optional[List[float]] = []
    emi: Optional[List[float]] = []

class AnalysisRequest(BaseModel):
    upload_id: Optional[str] = None
    financial_data: Optional[FinancialData] = None

def calculate_cash_flow_stability(cash_inflow: List[float], cash_outflow: List[float]) -> dict:
    if not cash_inflow or not cash_outflow:
        return {"score": 50, "status": "unknown", "explanation": "Insufficient cash flow data"}
    
    net_cash_flow = [inflow - outflow for inflow, outflow in zip(cash_inflow, cash_outflow)]
    
    positive_months = sum(1 for ncf in net_cash_flow if ncf > 0)
    stability_ratio = positive_months / len(net_cash_flow)
    
    avg_inflow = sum(cash_inflow) / len(cash_inflow)
    variance = sum((cf - avg_inflow) ** 2 for cf in cash_inflow) / len(cash_inflow)
    cv = (variance ** 0.5) / avg_inflow if avg_inflow > 0 else 1
    
    score = min(100, max(0, int((stability_ratio * 60) + ((1 - min(cv, 1)) * 40))))
    
    if score >= 70:
        status = "healthy"
        explanation = "Your cash flow is stable with consistent positive net flows."
    elif score >= 50:
        status = "moderate"
        explanation = "Your cash flow shows some variability. Consider building cash reserves."
    else:
        status = "at_risk"
        explanation = "Your cash flow is unstable. Immediate attention to cash management is needed."
    
    return {"score": score, "status": status, "explanation": explanation}

def calculate_expense_ratio(revenue: List[float], expenses: List[float]) -> dict:
    if not revenue or not expenses:
        return {"score": 50, "ratio": 0, "status": "unknown", "explanation": "Insufficient data"}
    
    total_revenue = sum(revenue)
    total_expenses = sum(expenses)
    
    if total_revenue == 0:
        return {"score": 0, "ratio": 100, "status": "critical", "explanation": "No revenue recorded"}
    
    ratio = (total_expenses / total_revenue) * 100
    
    if ratio < 60:
        score = 100
        status = "excellent"
        explanation = f"Excellent expense management! Your expenses are {ratio:.1f}% of revenue."
    elif ratio < 75:
        score = 80
        status = "healthy"
        explanation = f"Good expense control. Expenses at {ratio:.1f}% of revenue."
    elif ratio < 90:
        score = 60
        status = "moderate"
        explanation = f"Expenses at {ratio:.1f}% of revenue. Look for cost optimization opportunities."
    elif ratio < 100:
        score = 40
        status = "warning"
        explanation = f"High expenses at {ratio:.1f}% of revenue. Profitability is at risk."
    else:
        score = 20
        status = "critical"
        explanation = f"Expenses exceed revenue at {ratio:.1f}%. Urgent cost reduction needed."
    
    return {"score": score, "ratio": round(ratio, 2), "status": status, "explanation": explanation}

def calculate_working_capital_gap(receivables: List[float], payables: List[float]) -> dict:
    if not receivables or not payables:
        return {"score": 50, "gap": 0, "status": "unknown", "explanation": "Insufficient data"}
    
    avg_receivables = sum(receivables) / len(receivables)
    avg_payables = sum(payables) / len(payables)
    
    gap = avg_receivables - avg_payables
    
    if avg_payables > 0:
        gap_ratio = gap / avg_payables
    else:
        gap_ratio = 0
    
    if gap_ratio < 0:
        score = 90
        status = "excellent"
        explanation = "You collect faster than you pay. Strong working capital position."
    elif gap_ratio < 0.5:
        score = 70
        status = "healthy"
        explanation = "Balanced working capital. Collections and payments are well managed."
    elif gap_ratio < 1:
        score = 50
        status = "moderate"
        explanation = "Working capital gap is widening. Consider faster collection strategies."
    else:
        score = 30
        status = "at_risk"
        explanation = "Significant working capital gap. May face cash flow issues."
    
    return {"score": score, "gap": round(gap, 2), "status": status, "explanation": explanation}

def calculate_debt_burden(revenue: List[float], loans: List[float], emi: List[float]) -> dict:
    if not revenue:
        return {"score": 50, "ratio": 0, "status": "unknown", "explanation": "Insufficient data"}
    
    total_revenue = sum(revenue)
    total_loans = sum(loans) if loans else 0
    total_emi = sum(emi) if emi else 0
    
    if total_revenue == 0:
        return {"score": 0, "ratio": 100, "status": "critical", "explanation": "No revenue to service debt"}
    
    debt_service_ratio = (total_emi / total_revenue) * 100 if total_emi else 0
    debt_to_revenue = (total_loans / total_revenue) * 100 if total_loans else 0
    
    combined_ratio = (debt_service_ratio * 0.6) + (min(debt_to_revenue, 100) * 0.4)
    
    if combined_ratio < 15:
        score = 95
        status = "excellent"
        explanation = "Very low debt burden. Strong financial position."
    elif combined_ratio < 30:
        score = 80
        status = "healthy"
        explanation = "Manageable debt levels. Good capacity for growth."
    elif combined_ratio < 50:
        score = 60
        status = "moderate"
        explanation = "Moderate debt burden. Be cautious with additional borrowing."
    elif combined_ratio < 70:
        score = 40
        status = "warning"
        explanation = "High debt burden. Focus on debt reduction."
    else:
        score = 20
        status = "critical"
        explanation = "Very high debt burden. Debt restructuring may be needed."
    
    return {
        "score": score, 
        "debt_service_ratio": round(debt_service_ratio, 2),
        "debt_to_revenue": round(debt_to_revenue, 2),
        "status": status, 
        "explanation": explanation
    }

def calculate_creditworthiness(scores: dict) -> dict:
    weights = {
        "cash_flow_stability": 0.25,
        "expense_ratio": 0.20,
        "working_capital": 0.20,
        "debt_burden": 0.35
    }
    
    weighted_score = sum(
        scores.get(metric, {}).get("score", 50) * weight 
        for metric, weight in weights.items()
    )
    
    final_score = min(100, max(0, int(weighted_score)))
    
    if final_score >= 80:
        grade = "A"
        status = "excellent"
        explanation = "Excellent creditworthiness. Eligible for best loan terms."
    elif final_score >= 65:
        grade = "B"
        status = "good"
        explanation = "Good creditworthiness. Eligible for competitive loan products."
    elif final_score >= 50:
        grade = "C"
        status = "fair"
        explanation = "Fair creditworthiness. Some loan products may be available."
    elif final_score >= 35:
        grade = "D"
        status = "poor"
        explanation = "Below average creditworthiness. Limited financing options."
    else:
        grade = "E"
        status = "very_poor"
        explanation = "Poor creditworthiness. Consider improving finances before applying for credit."
    
    return {
        "score": final_score,
        "grade": grade,
        "status": status,
        "explanation": explanation
    }

@router.post("/calculate")
async def calculate_financial_health(request: AnalysisRequest):
    print(f"Received analysis request: {request}")
    try:
        if request.financial_data:
            financial_data = request.financial_data.model_dump()
            print(f"Financial data: {financial_data}")
        else:
            raise HTTPException(status_code=400, detail="No financial data provided")
        
        cash_flow_stability = calculate_cash_flow_stability(
            financial_data.get("cash_inflow", []),
            financial_data.get("cash_outflow", [])
        )
        
        expense_ratio = calculate_expense_ratio(
            financial_data.get("revenue", []),
            financial_data.get("expenses", [])
        )
        
        working_capital = calculate_working_capital_gap(
            financial_data.get("receivables", []),
            financial_data.get("payables", [])
        )
        
        debt_burden = calculate_debt_burden(
            financial_data.get("revenue", []),
            financial_data.get("loans", []),
            financial_data.get("emi", [])
        )
        
        all_scores = {
            "cash_flow_stability": cash_flow_stability,
            "expense_ratio": expense_ratio,
            "working_capital": working_capital,
            "debt_burden": debt_burden
        }
        
        creditworthiness = calculate_creditworthiness(all_scores)
        
        analysis_result = {
            "cash_flow_stability": cash_flow_stability,
            "expense_ratio": expense_ratio,
            "working_capital": working_capital,
            "debt_burden": debt_burden,
            "creditworthiness": creditworthiness,
            "overall_health": creditworthiness["status"]
        }
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_analysis_history():
    # No database - return empty history
    return {"analyses": [], "message": "Analysis history is stored locally only"}

