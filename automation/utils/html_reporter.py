import os
import json
from datetime import datetime
from automation.config.appium_config import AppiumConfig

class EnterpriseHTMLReporter:
    def __init__(self, output_dir=None):
        self.output_dir = output_dir or AppiumConfig.HTML_REPORTS_DIR
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_all_html_reports(self, test_results, metrics):
        report_path = self.generate_execution_report(test_results, metrics)
        dashboard_path = self.generate_dashboard(test_results, metrics)
        trends_path = self.generate_trends(metrics)
        return {
            "execution": report_path,
            "dashboard": dashboard_path,
            "trends": trends_path
        }

    def generate_execution_report(self, test_results, metrics):
        filepath = os.path.join(self.output_dir, "execution-report.html")
        
        rows_html = ""
        for idx, tc in enumerate(test_results, 1):
            status = tc.get("status", "PASS")
            badge_class = "pass" if status == "PASS" else ("fail" if status == "FAIL" else "skip")
            error_msg = f"<span class='error-msg'>{tc.get('error', '')}</span>" if status == "FAIL" else "N/A"
            
            rows_html += f"""
            <tr class="test-row {status.lower()}">
                <td>{tc.get('test_id', f'TC_{idx:03d}')}</td>
                <td><span class="module-tag">{tc.get('module', 'General')}</span></td>
                <td class="test-name">{tc.get('name', 'Test Case')}</td>
                <td><span class="badge priority-{tc.get('priority', 'P2').lower()}">{tc.get('priority', 'P2')}</span></td>
                <td><span class="badge status-{badge_class}">{status}</span></td>
                <td>{round(tc.get('duration', 0.05), 3)}s</td>
                <td>{error_msg}</td>
            </tr>
            """

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android Appium E2E Automation Report</title>
    <style>
        :root {{
            --bg-dark: #0f172a;
            --card-bg: #1e293b;
            --accent-blue: #3b82f6;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --accent-amber: #f59e0b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-main);
            margin: 0;
            padding: 24px;
        }}
        .header {{
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid #334155;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .header h1 {{ margin: 0; font-size: 24px; color: #fff; }}
        .header p {{ margin: 6px 0 0 0; color: var(--text-muted); font-size: 14px; }}
        .kpi-container {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }}
        .kpi-card {{
            background-color: var(--card-bg);
            border: 1px solid #334155;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }}
        .kpi-title {{ font-size: 13px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }}
        .kpi-value {{ font-size: 32px; font-weight: 700; margin-top: 8px; color: #fff; }}
        .controls {{
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
        }}
        .search-input {{
            flex: 1;
            padding: 10px 16px;
            border-radius: 8px;
            border: 1px solid #334155;
            background: var(--card-bg);
            color: #fff;
            font-size: 14px;
        }}
        .filter-btn {{
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid #334155;
            background: var(--card-bg);
            color: #fff;
            cursor: pointer;
            font-weight: 600;
        }}
        .filter-btn.active {{ background: var(--accent-blue); }}
        table {{
            width: 100%;
            border-collapse: collapse;
            background-color: var(--card-bg);
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #334155;
        }}
        th, td {{ padding: 12px 16px; text-align: left; border-bottom: 1px solid #334155; font-size: 14px; }}
        th {{ background-color: #0f172a; color: var(--text-muted); font-weight: 600; }}
        .badge {{
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            display: inline-block;
        }}
        .status-pass {{ background: #065f46; color: #a7f3d0; }}
        .status-fail {{ background: #991b1b; color: #fecaca; }}
        .status-skip {{ background: #92400e; color: #fef3c7; }}
        .module-tag {{ background: #334155; color: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 12px; }}
        .error-msg {{ color: #f87171; font-family: monospace; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>ANDROID APPIUM AUTOMATION E2E REPORT</h1>
            <p>Target Package: {metrics.get('package', 'com.imageauth.verifier')} | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
    </div>

    <div class="kpi-container">
        <div class="kpi-card">
            <div class="kpi-title">Total Test Cases</div>
            <div class="kpi-value">{metrics.get('total', 0)}</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Passed Tests</div>
            <div class="kpi-value" style="color: var(--accent-green);">{metrics.get('passed', 0)}</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Failed Tests</div>
            <div class="kpi-value" style="color: var(--accent-red);">{metrics.get('failed', 0)}</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Pass Rate</div>
            <div class="kpi-value" style="color: var(--accent-blue);">{metrics.get('pass_rate', 0)}%</div>
        </div>
    </div>

    <div class="controls">
        <input type="text" id="searchInput" class="search-input" placeholder="Search test cases by name, module, or status..." onkeyup="filterTable()">
        <button class="filter-btn active" onclick="filterStatus('all', this)">All</button>
        <button class="filter-btn" onclick="filterStatus('pass', this)">Passed</button>
        <button class="filter-btn" onclick="filterStatus('fail', this)">Failed</button>
    </div>

    <table id="testTable">
        <thead>
            <tr>
                <th>Test ID</th>
                <th>Module</th>
                <th>Test Case Name</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Log / Diagnostics</th>
            </tr>
        </thead>
        <tbody>
            {rows_html}
        </tbody>
    </table>

    <script>
        function filterTable() {{
            const input = document.getElementById("searchInput").value.toLowerCase();
            const rows = document.querySelectorAll("#testTable tbody tr");
            rows.forEach(row => {{
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(input) ? "" : "none";
            }});
        }}

        function filterStatus(status, btn) {{
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const rows = document.querySelectorAll("#testTable tbody tr");
            rows.forEach(row => {{
                if (status === "all") row.style.display = "";
                else row.style.display = row.classList.contains(status) ? "" : "none";
            }});
        }}
    </script>
</body>
</html>
"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_content)
            
        return filepath

    def generate_dashboard(self, test_results, metrics):
        filepath = os.path.join(self.output_dir, "dashboard.html")
        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>E2E Automation Metrics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {{ background: #0f172a; color: #fff; font-family: sans-serif; padding: 24px; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }}
        .card {{ background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; }}
    </style>
</head>
<body>
    <h2>Appium Test Metrics & Execution Dashboard</h2>
    <div class="grid">
        <div class="card">
            <h3>Overall Status Breakdown</h3>
            <canvas id="statusChart"></canvas>
        </div>
        <div class="card">
            <h3>Execution Summary Info</h3>
            <p><strong>Total Executed:</strong> {metrics.get('total', 0)}</p>
            <p><strong>Passed:</strong> {metrics.get('passed', 0)}</p>
            <p><strong>Failed:</strong> {metrics.get('failed', 0)}</p>
            <p><strong>Pass Rate:</strong> {metrics.get('pass_rate', 0)}%</p>
            <p><strong>Total Duration:</strong> {metrics.get('duration_s', 0)}s</p>
        </div>
    </div>
    <script>
        const ctx = document.getElementById('statusChart').getContext('2d');
        new Chart(ctx, {{
            type: 'doughnut',
            data: {{
                labels: ['Passed', 'Failed', 'Skipped'],
                datasets: [{{
                    data: [{metrics.get('passed', 0)}, {metrics.get('failed', 0)}, {metrics.get('skipped', 0)}],
                    backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
                }}]
            }}
        }});
    </script>
</body>
</html>"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_content)
        return filepath

    def generate_trends(self, metrics):
        filepath = os.path.join(self.output_dir, "trends.html")
        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Execution Trends</title>
    <style>body {{ background: #0f172a; color: #fff; font-family: sans-serif; padding: 24px; }}</style>
</head>
<body>
    <h2>Historical Execution Trends</h2>
    <p>Build Pass Rate History: Current Build ({metrics.get('pass_rate', 0)}%)</p>
</body>
</html>"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_content)
        return filepath
