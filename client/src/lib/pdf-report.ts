// PDF Report Generator for FINCHECK AI

interface AnalysisData {
    cash_flow_stability: { score: number; status: string; explanation: string };
    expense_ratio: { score: number; ratio: number; status: string; explanation: string };
    working_capital: { score: number; gap: number; status: string; explanation: string };
    debt_burden: { score: number; debt_service_ratio: number; debt_to_revenue: number; status: string; explanation: string };
    creditworthiness: { score: number; grade: string; status: string; explanation: string };
}

interface BenchmarkData {
    industry: string;
    industry_name: string;
    comparisons: Record<string, { actual: number; benchmark: number; difference: number; percentage_diff: number; status: string; comparison: string; is_better: boolean }>;
    overall_status: string;
    overall_message: string;
}

interface ReportData {
    businessName: string;
    industry: string;
    analysisData: AnalysisData;
    benchmarkData?: BenchmarkData;
    insights?: string;
    generatedAt: string;
}

function getGradeColor(grade: string): string {
    const colors: Record<string, string> = {
        'A': '#10b981',
        'B': '#22c55e',
        'C': '#eab308',
        'D': '#f97316',
        'E': '#ef4444',
    };
    return colors[grade] || '#6b7280';
}

function getStatusColor(status: string): string {
    if (status.includes('good') || status.includes('healthy') || status.includes('low')) {
        return '#10b981';
    } else if (status.includes('moderate') || status.includes('average')) {
        return '#eab308';
    } else {
        return '#ef4444';
    }
}

export function generatePDFReport(data: ReportData): void {
    const { businessName, industry, analysisData, benchmarkData, insights, generatedAt } = data;

    const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Financial Health Report - ${businessName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: white;
          padding: 40px;
        }
        .header {
          text-align: center;
          padding-bottom: 30px;
          border-bottom: 3px solid #10b981;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #10b981;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header .subtitle {
          color: #6b7280;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .score-card {
          display: inline-block;
          width: 48%;
          vertical-align: top;
          padding: 15px;
          margin: 5px 1%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }
        .score-card h3 {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .score-card .value {
          font-size: 24px;
          font-weight: 700;
        }
        .score-card .status {
          font-size: 12px;
          margin-top: 5px;
        }
        .credit-grade {
          text-align: center;
          padding: 30px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .credit-grade .grade {
          font-size: 64px;
          font-weight: 700;
        }
        .credit-grade .score {
          font-size: 24px;
          color: #6b7280;
        }
        .credit-grade .label {
          font-size: 14px;
          color: #6b7280;
          margin-top: 10px;
        }
        .benchmark-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .benchmark-table th, .benchmark-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .benchmark-table th {
          background: #f9fafb;
          font-weight: 600;
        }
        .insights-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 20px;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }
        .better { color: #10b981; }
        .worse { color: #ef4444; }
        .average { color: #eab308; }
        @media print {
          body { padding: 20px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 FINCHECK AI</h1>
        <div class="subtitle">Financial Health Assessment Report</div>
        <div style="margin-top: 20px;">
          <strong style="font-size: 20px;">${businessName}</strong>
          <div style="color: #6b7280; margin-top: 5px;">Industry: ${industry} | Generated: ${generatedAt}</div>
        </div>
      </div>

      <div class="section">
        <div class="credit-grade">
          <div class="label">Overall Creditworthiness</div>
          <div class="grade" style="color: ${getGradeColor(analysisData.creditworthiness.grade)}">${analysisData.creditworthiness.grade}</div>
          <div class="score">${analysisData.creditworthiness.score}/100</div>
          <div class="label">${analysisData.creditworthiness.explanation}</div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Financial Health Metrics</h2>
        <div>
          <div class="score-card">
            <h3>Cash Flow Stability</h3>
            <div class="value" style="color: ${getStatusColor(analysisData.cash_flow_stability.status)}">${analysisData.cash_flow_stability.score}/100</div>
            <div class="status">${analysisData.cash_flow_stability.status}</div>
          </div>
          <div class="score-card">
            <h3>Expense Ratio</h3>
            <div class="value" style="color: ${getStatusColor(analysisData.expense_ratio.status)}">${analysisData.expense_ratio.ratio.toFixed(1)}%</div>
            <div class="status">${analysisData.expense_ratio.status}</div>
          </div>
          <div class="score-card">
            <h3>Working Capital</h3>
            <div class="value" style="color: ${getStatusColor(analysisData.working_capital.status)}">₹${(analysisData.working_capital.gap / 100000).toFixed(1)}L</div>
            <div class="status">${analysisData.working_capital.status}</div>
          </div>
          <div class="score-card">
            <h3>Debt Burden</h3>
            <div class="value" style="color: ${getStatusColor(analysisData.debt_burden.status)}">${analysisData.debt_burden.debt_to_revenue.toFixed(1)}%</div>
            <div class="status">${analysisData.debt_burden.status}</div>
          </div>
        </div>
      </div>

      ${benchmarkData ? `
      <div class="section">
        <h2 class="section-title">Industry Benchmark Comparison</h2>
        <p style="margin-bottom: 15px; color: #6b7280;">Compared against: ${benchmarkData.industry_name}</p>
        <table class="benchmark-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Your Value</th>
              <th>Industry Avg</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(benchmarkData.comparisons).map(([key, comp]) => `
              <tr>
                <td>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td>${comp.actual}</td>
                <td>${comp.benchmark}</td>
                <td class="${comp.is_better ? 'better' : 'worse'}">${comp.is_better ? '↑' : '↓'} ${Math.abs(comp.percentage_diff).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top: 15px; padding: 10px; background: #f9fafb; border-radius: 6px;">
          <strong>Summary:</strong> ${benchmarkData.overall_message}
        </p>
      </div>
      ` : ''}

      ${insights ? `
      <div class="section">
        <h2 class="section-title">AI-Powered Insights & Recommendations</h2>
        <div class="insights-box">${insights}</div>
      </div>
      ` : ''}

      <div class="footer">
        <p>Generated by FINCHECK AI - Financial Health Assessment Platform</p>
        <p style="margin-top: 5px;">This report is for informational purposes only and should not be considered as financial advice.</p>
      </div>
    </body>
    </html>
  `;

    // Open a new window with the report and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 250);
        };
    }
}
