from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Optional
import pandas as pd
import io
import json

router = APIRouter()

EXPECTED_COLUMNS = {
    "revenue": ["revenue", "sales", "income", "total_revenue", "gross_revenue"],
    "expenses": ["expenses", "costs", "expenditure", "total_expenses", "operating_expenses"],
    "cash_inflow": ["cash_inflow", "cash_in", "receipts", "collections", "inflow"],
    "cash_outflow": ["cash_outflow", "cash_out", "payments", "disbursements", "outflow"],
    "receivables": ["receivables", "accounts_receivable", "ar", "debtors", "trade_receivables"],
    "payables": ["payables", "accounts_payable", "ap", "creditors", "trade_payables"],
    "loans": ["loans", "debt", "borrowings", "loan_balance", "outstanding_loans"],
    "emi": ["emi", "loan_payment", "installment", "monthly_payment", "repayment"]
}

def detect_columns(df: pd.DataFrame) -> dict:
    detected = {}
    df_columns_lower = [col.lower().replace(" ", "_") for col in df.columns]
    
    for field, aliases in EXPECTED_COLUMNS.items():
        for idx, col in enumerate(df_columns_lower):
            if col in aliases or any(alias in col for alias in aliases):
                detected[field] = df.columns[idx]
                break
    
    return detected

def validate_and_process_file(file_content: bytes, filename: str) -> dict:
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(file_content))
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(file_content))
        else:
            raise ValueError("Unsupported file format. Please upload CSV or XLSX files.")
        
        if df.empty:
            raise ValueError("The uploaded file is empty.")
        
        detected_columns = detect_columns(df)
        
        if len(detected_columns) < 3:
            raise ValueError(
                "Could not detect enough financial columns. "
                "Please ensure your file has columns for: revenue, expenses, cash flow, receivables, payables, or loans."
            )
        
        financial_data = {}
        for field, column in detected_columns.items():
            values = pd.to_numeric(df[column], errors='coerce').dropna().tolist()
            financial_data[field] = values
        
        summary = {
            "total_rows": len(df),
            "columns_detected": list(detected_columns.keys()),
            "column_mapping": detected_columns,
            "preview": df.head(5).to_dict(orient='records')
        }
        
        return {
            "success": True,
            "summary": summary,
            "financial_data": financial_data,
            "raw_data": df.to_dict(orient='records')
        }
        
    except Exception as e:
        raise ValueError(str(e))

@router.post("/file")
async def upload_file(file: UploadFile = File(...)):
    """Process uploaded financial file - no authentication required"""
    try:
        if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(
                status_code=400, 
                detail="Invalid file format. Please upload CSV or XLSX files."
            )
        
        content = await file.read()
        
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")
        
        result = validate_and_process_file(content, file.filename)
        
        return {
            "message": "File processed successfully",
            "summary": result["summary"],
            "financial_data": result["financial_data"]
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/history")
async def get_upload_history():
    """No database - return empty history"""
    return {"uploads": [], "message": "Upload history is stored locally only"}
