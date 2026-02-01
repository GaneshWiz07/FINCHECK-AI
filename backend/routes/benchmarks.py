from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional

router = APIRouter()

INDUSTRY_BENCHMARKS = {
    "retail": {
        "expense_ratio": 75,
        "cash_flow_stability": 65,
        "working_capital_gap": 30,
        "debt_to_revenue": 40,
        "profit_margin": 8,
        "name": "Retail Trade"
    },
    "manufacturing": {
        "expense_ratio": 80,
        "cash_flow_stability": 55,
        "working_capital_gap": 45,
        "debt_to_revenue": 50,
        "profit_margin": 10,
        "name": "Manufacturing"
    },
    "services": {
        "expense_ratio": 65,
        "cash_flow_stability": 70,
        "working_capital_gap": 20,
        "debt_to_revenue": 25,
        "profit_margin": 15,
        "name": "Professional Services"
    },
    "technology": {
        "expense_ratio": 70,
        "cash_flow_stability": 60,
        "working_capital_gap": 15,
        "debt_to_revenue": 20,
        "profit_margin": 20,
        "name": "Technology"
    },
    "healthcare": {
        "expense_ratio": 72,
        "cash_flow_stability": 75,
        "working_capital_gap": 35,
        "debt_to_revenue": 35,
        "profit_margin": 12,
        "name": "Healthcare"
    },
    "construction": {
        "expense_ratio": 85,
        "cash_flow_stability": 45,
        "working_capital_gap": 50,
        "debt_to_revenue": 55,
        "profit_margin": 6,
        "name": "Construction"
    },
    "food_beverage": {
        "expense_ratio": 78,
        "cash_flow_stability": 55,
        "working_capital_gap": 25,
        "debt_to_revenue": 45,
        "profit_margin": 7,
        "name": "Food & Beverage"
    },
    "logistics": {
        "expense_ratio": 82,
        "cash_flow_stability": 50,
        "working_capital_gap": 40,
        "debt_to_revenue": 60,
        "profit_margin": 5,
        "name": "Logistics & Transport"
    },
    "education": {
        "expense_ratio": 70,
        "cash_flow_stability": 80,
        "working_capital_gap": 10,
        "debt_to_revenue": 15,
        "profit_margin": 18,
        "name": "Education"
    },
    "agriculture": {
        "expense_ratio": 75,
        "cash_flow_stability": 40,
        "working_capital_gap": 55,
        "debt_to_revenue": 50,
        "profit_margin": 8,
        "name": "Agriculture"
    }
}

class BenchmarkRequest(BaseModel):
    industry: str
    analysis_data: Dict

def compare_metric(actual: float, benchmark: float, higher_is_better: bool = True) -> dict:
    difference = actual - benchmark
    percentage_diff = (difference / benchmark * 100) if benchmark != 0 else 0
    
    if higher_is_better:
        is_better = difference > 0
    else:
        is_better = difference < 0
    
    if abs(percentage_diff) < 5:
        status = "average"
        comparison = "on par with"
    elif is_better:
        status = "above_average"
        comparison = "better than"
    else:
        status = "below_average"
        comparison = "below"
    
    return {
        "actual": round(actual, 2),
        "benchmark": benchmark,
        "difference": round(difference, 2),
        "percentage_diff": round(percentage_diff, 1),
        "status": status,
        "comparison": comparison,
        "is_better": is_better
    }

@router.get("/industries")
async def get_industries():
    return {
        "industries": [
            {"id": key, "name": value["name"]} 
            for key, value in INDUSTRY_BENCHMARKS.items()
        ]
    }

@router.get("/industry/{industry_id}")
async def get_industry_benchmark(industry_id: str):
    if industry_id not in INDUSTRY_BENCHMARKS:
        raise HTTPException(status_code=404, detail="Industry not found")
    
    return INDUSTRY_BENCHMARKS[industry_id]

@router.post("/compare")
async def compare_with_benchmark(request: BenchmarkRequest):
    try:
        industry = request.industry.lower().replace(" ", "_")
        
        if industry not in INDUSTRY_BENCHMARKS:
            industry = "services"
        
        benchmark = INDUSTRY_BENCHMARKS[industry]
        analysis = request.analysis_data
        
        expense_actual = analysis.get("expense_ratio", {}).get("ratio", 75)
        cash_flow_actual = analysis.get("cash_flow_stability", {}).get("score", 50)
        working_capital_actual = abs(analysis.get("working_capital", {}).get("gap", 0))
        debt_actual = analysis.get("debt_burden", {}).get("debt_to_revenue", 30)
        
        comparisons = {
            "expense_ratio": compare_metric(expense_actual, benchmark["expense_ratio"], higher_is_better=False),
            "cash_flow_stability": compare_metric(cash_flow_actual, benchmark["cash_flow_stability"], higher_is_better=True),
            "working_capital_gap": compare_metric(working_capital_actual, benchmark["working_capital_gap"], higher_is_better=False),
            "debt_to_revenue": compare_metric(debt_actual, benchmark["debt_to_revenue"], higher_is_better=False)
        }
        
        better_count = sum(1 for c in comparisons.values() if c["is_better"])
        total_metrics = len(comparisons)
        
        if better_count >= 3:
            overall_status = "above_average"
            overall_message = f"Your business outperforms the {benchmark['name']} industry average in {better_count} out of {total_metrics} key metrics."
        elif better_count >= 2:
            overall_status = "average"
            overall_message = f"Your business is performing at par with the {benchmark['name']} industry average."
        else:
            overall_status = "below_average"
            overall_message = f"Your business is underperforming compared to the {benchmark['name']} industry average. Focus on improvement areas."
        
        return {
            "industry": industry,
            "industry_name": benchmark["name"],
            "comparisons": comparisons,
            "overall_status": overall_status,
            "overall_message": overall_message,
            "better_metrics": better_count,
            "total_metrics": total_metrics
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
