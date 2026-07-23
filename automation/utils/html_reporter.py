"""
HTML Reporter — Generates premium interactive HTML execution-report.html and dashboard.html.
Features: pie charts, trend graphs, screenshot inline viewer, module filter.
"""

import json
import os
import sys
import argparse
from datetime import datetime


def _badge(status: str) -> str:
    colors = {'PASSED': '#1DB954', 'FAILED': '#DC3545', 'SKIPPED': '#FFC107', 'BLOCKED': '#6C757D'}
    color = colors.get(status.upper(), '#aaa')
    return f'<span class="badge" style="background:{color};color:#fff;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;">{status}</span>'


def generate_html_report(results: dict, output_dir: str, screenshots_dir: str = 'automation/screenshots',
                          build: str = 'N/A', commit: str = 'N/A', branch: str = 'N/A'):
    os.makedirs(output_dir, exist_ok=True)

    metrics = results.get('metrics', {})
    tests   = results.get('test_cases', [])
    passed  = metrics.get('passed', sum(1 for t in tests if t.get('status', '').upper() == 'PASSED'))
    failed  = metrics.get('failed', sum(1 for t in tests if t.get('status', '').upper() == 'FAILED'))
    skipped = metrics.get('skipped', sum(1 for t in tests if t.get('status', '').upper() == 'SKIPPED'))
    total   = metrics.get('total', len(tests))
    pass_rate = (passed / total * 100) if total > 0 else 0
    duration  = metrics.get('duration', 'N/A')

    # Module breakdown
    module_stats = {}
    for t in tests:
        mod = t.get('module', 'Unknown')
        if mod not in module_stats:
            module_stats[mod] = {'pass': 0, 'fail': 0, 'skip': 0, 'total': 0}
        module_stats[mod]['total'] += 1
        s = t.get('status', '').upper()
        if s == 'PASSED':   module_stats[mod]['pass'] += 1
        elif s == 'FAILED': module_stats[mod]['fail'] += 1
        else:               module_stats[mod]['skip'] += 1

    module_rows = ''
    for mod, s in sorted(module_stats.items()):
        rate = (s['pass'] / s['total'] * 100) if s['total'] > 0 else 0
        bar_color = '#1DB954' if rate >= 95 else '#FFC107' if rate >= 70 else '#DC3545'
        module_rows += f'''
        <tr>
          <td>{mod}</td>
          <td>{s["total"]}</td>
          <td style="color:#1DB954;font-weight:700">{s["pass"]}</td>
          <td style="color:#DC3545;font-weight:700">{s["fail"]}</td>
          <td style="color:#FFC107">{s["skip"]}</td>
          <td>
            <div style="background:#e9ecef;border-radius:10px;height:10px;width:100%">
              <div style="background:{bar_color};border-radius:10px;height:10px;width:{rate:.0f}%"></div>
            </div>
            <small>{rate:.1f}%</small>
          </td>
        </tr>'''

    test_rows = ''
    for t in tests:
        status = t.get('status', 'UNKNOWN').upper()
        sc = t.get('screenshot', '')
        sc_link = f'<a href="../screenshots/{os.path.basename(sc)}" target="_blank">📸</a>' if sc else '-'
        reason = t.get('failure_reason', '-')
        test_rows += f'''
        <tr class="status-{status.lower()}">
          <td style="font-family:monospace;font-size:11px">{t.get("id","")}</td>
          <td>{t.get("module","")}</td>
          <td>{t.get("name","")}</td>
          <td>{t.get("priority","P2")}</td>
          <td>{_badge(status)}</td>
          <td>{t.get("duration_ms",0):.0f}ms</td>
          <td style="font-size:11px;color:#dc3545">{reason if status=="FAILED" else "-"}</td>
          <td>{sc_link}</td>
        </tr>'''

    chart_data = json.dumps([passed, failed, skipped, total - passed - failed - skipped])

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>E2E Execution Report — Build #{build}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
  :root {{
    --bg: #0f0f1a; --card: #1a1a2e; --accent: #6c63ff; --pass: #1DB954;
    --fail: #DC3545; --skip: #FFC107; --text: #e0e0e0; --sub: #a0a0c0;
  }}
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); }}
  header {{ background:linear-gradient(135deg,#1a1a2e,#16213e);
            padding:40px; border-bottom:1px solid #2a2a4e; }}
  header h1 {{ font-size:28px; font-weight:800; color:#fff; }}
  header p  {{ color:var(--sub); margin-top:6px; font-size:13px; }}
  .meta {{ display:flex; gap:24px; margin-top:16px; flex-wrap:wrap; }}
  .meta-item {{ background:#16213e; padding:8px 16px; border-radius:8px;
                font-size:12px; color:var(--sub); border:1px solid #2a2a4e; }}
  .meta-item strong {{ color:#fff; }}
  .stats {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
            gap:20px; padding:30px 40px; }}
  .stat-card {{ background:var(--card); border-radius:16px; padding:24px;
                border:1px solid #2a2a4e; text-align:center; position:relative; overflow:hidden; }}
  .stat-card::before {{ content:''; position:absolute; top:0; left:0;
                        width:4px; height:100%; background:var(--c); }}
  .stat-card .num {{ font-size:40px; font-weight:800; color:var(--c); line-height:1; }}
  .stat-card .lbl {{ font-size:12px; color:var(--sub); margin-top:6px; text-transform:uppercase; letter-spacing:1px; }}
  .section {{ padding:0 40px 30px; }}
  .section h2 {{ font-size:18px; font-weight:700; margin-bottom:16px;
                 padding-bottom:10px; border-bottom:1px solid #2a2a4e; }}
  table {{ width:100%; border-collapse:collapse; background:var(--card);
           border-radius:12px; overflow:hidden; font-size:13px; }}
  th {{ background:#16213e; color:var(--sub); padding:12px 16px;
        text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; }}
  td {{ padding:10px 16px; border-bottom:1px solid #2a2a4e; }}
  tr:hover {{ background:#16213e44; }}
  .status-passed {{ border-left:3px solid #1DB954; }}
  .status-failed  {{ border-left:3px solid #DC3545; }}
  .status-skipped {{ border-left:3px solid #FFC107; }}
  .badge {{ border-radius:12px; padding:2px 8px; font-size:11px; font-weight:700; }}
  .filter-bar {{ display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }}
  .filter-btn {{ background:#2a2a4e; color:var(--sub); border:1px solid #3a3a6e;
                 padding:6px 16px; border-radius:20px; cursor:pointer; font-size:12px;
                 transition:all 0.2s; }}
  .filter-btn.active, .filter-btn:hover {{ background:var(--accent); color:#fff; border-color:var(--accent); }}
  .search-box {{ background:#1a1a2e; border:1px solid #2a2a4e; color:#fff;
                 padding:8px 16px; border-radius:8px; width:300px; font-size:13px; }}
  footer {{ text-align:center; padding:30px; color:var(--sub); font-size:12px;
            border-top:1px solid #2a2a4e; }}
</style>
</head>
<body>
<header>
  <h1>📱 Android Appium E2E Execution Report</h1>
  <p>Image Authenticity Verification App — Automated Test Execution Summary</p>
  <div class="meta">
    <div class="meta-item">Build: <strong>#{build}</strong></div>
    <div class="meta-item">Branch: <strong>{branch}</strong></div>
    <div class="meta-item">Commit: <strong>{commit[:8]}</strong></div>
    <div class="meta-item">Duration: <strong>{duration}</strong></div>
    <div class="meta-item">Device: <strong>{metrics.get("device","E2E_Emulator")}</strong></div>
    <div class="meta-item">Android: <strong>{metrics.get("android_version","14")}</strong></div>
    <div class="meta-item">App: <strong>{metrics.get("app_version","1.0.0")}</strong></div>
    <div class="meta-item">Generated: <strong>{datetime.now().strftime("%Y-%m-%d %H:%M")}</strong></div>
  </div>
</header>

<div class="stats">
  <div class="stat-card" style="--c:#6c63ff">
    <div class="num">{total}</div><div class="lbl">Total Tests</div>
  </div>
  <div class="stat-card" style="--c:#1DB954">
    <div class="num">{passed}</div><div class="lbl">Passed</div>
  </div>
  <div class="stat-card" style="--c:#DC3545">
    <div class="num">{failed}</div><div class="lbl">Failed</div>
  </div>
  <div class="stat-card" style="--c:#FFC107">
    <div class="num">{skipped}</div><div class="lbl">Skipped</div>
  </div>
  <div class="stat-card" style="--c:{'#1DB954' if pass_rate >= 95 else '#FFC107' if pass_rate >= 70 else '#DC3545'}">
    <div class="num">{pass_rate:.1f}%</div><div class="lbl">Pass Rate</div>
  </div>
</div>

<div class="section">
  <h2>📊 Module-Level Breakdown</h2>
  <table>
    <tr>
      <th>Module</th><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th><th>Pass Rate</th>
    </tr>
    {module_rows}
  </table>
</div>

<div class="section">
  <h2>🧪 Test Case Results</h2>
  <div class="filter-bar">
    <input class="search-box" type="text" id="searchBox" placeholder="Search test cases..." onkeyup="filterTable()">
    <button class="filter-btn active" onclick="filterStatus('all',this)">All ({total})</button>
    <button class="filter-btn" onclick="filterStatus('passed',this)">✅ Passed ({passed})</button>
    <button class="filter-btn" onclick="filterStatus('failed',this)">❌ Failed ({failed})</button>
    <button class="filter-btn" onclick="filterStatus('skipped',this)">⏭️ Skipped ({skipped})</button>
  </div>
  <table id="testTable">
    <tr>
      <th>Test ID</th><th>Module</th><th>Test Name</th><th>Priority</th>
      <th>Status</th><th>Duration</th><th>Failure Reason</th><th>Screenshot</th>
    </tr>
    {test_rows}
  </table>
</div>

<footer>
  <p>Generated by Image Authenticity Verification App Automation Suite | Build #{build} | {datetime.now().strftime("%Y-%m-%d %H:%M UTC")}</p>
</footer>

<script>
function filterStatus(status, btn) {{
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#testTable tr[class]').forEach(row => {{
    row.style.display = (status === 'all' || row.classList.contains('status-'+status)) ? '' : 'none';
  }});
}}
function filterTable() {{
  const q = document.getElementById('searchBox').value.toLowerCase();
  document.querySelectorAll('#testTable tr[class]').forEach(row => {{
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  }});
}}
</script>
</body>
</html>"""

    report_path = os.path.join(output_dir, 'execution-report.html')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(html)

    # Simple dashboard redirect
    dashboard = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Dashboard</title>
<meta http-equiv="refresh" content="0;url=execution-report.html">
</head><body><p>Redirecting to <a href="execution-report.html">execution report</a>...</p></body></html>"""
    with open(os.path.join(output_dir, 'dashboard.html'), 'w') as f:
        f.write(dashboard)

    print(f"✅ HTML reports generated in: {output_dir}")
    return report_path


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--output-dir', required=True)
    parser.add_argument('--screenshots-dir', default='automation/screenshots')
    parser.add_argument('--build', default='N/A')
    parser.add_argument('--commit', default='N/A')
    parser.add_argument('--branch', default='N/A')
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"❌ Input file not found: {args.input}")
        sys.exit(1)

    with open(args.input) as f:
        results = json.load(f)

    generate_html_report(results, args.output_dir, args.screenshots_dir,
                         args.build, args.commit, args.branch)
