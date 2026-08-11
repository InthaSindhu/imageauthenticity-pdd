# Enterprise Android Appium E2E Automation & CI/CD Guide

This document provides a comprehensive operational guide for executing, maintaining, and troubleshooting the **Enterprise Android Appium E2E Automation Framework** and the **21-Stage GitHub Actions CI/CD Pipeline**.

---

## 🏗️ Architecture & Component Overview

The framework provides 420+ automated test cases across 20 core functional modules, producing multi-sheet Excel reports, HTML interactive dashboards, JSON metrics, and GitHub Action Step Summaries.

```
automation/
├── config/
│   └── appium_config.py            # Android capabilities, timeouts, directory configuration
├── data/
│   └── test_data_generator.py      # Test case dataset generator (420+ cases)
├── pages/                          # Page Object Model (POM) representations
│   ├── base_page.py
│   ├── auth_page.py
│   ├── profile_page.py
│   ├── upload_analysis_page.py
│   ├── history_dashboard_page.py
│   ├── settings_page.py
│   └── error_dialog_page.py
├── utils/                          # Framework utilities
│   ├── excel_reporter.py           # 7-Sheet Excel Generator (openpyxl)
│   ├── html_reporter.py            # HTML Dashboards & Execution Reports
│   ├── logger.py                   # Appium & system logger
│   └── screenshot_util.py          # Failure screenshot utility
├── runners/
│   └── run_enterprise_suite.py     # Master test execution runner
└── tests/
    └── test_all_modules.py         # Test suites for all 20 modules (420 cases)
```

---

## 🚀 1. Local Execution Guide

### Prerequisites
1. **Node.js** (v18+ or v20+)
2. **Python** (v3.9+)
3. **Android SDK & ADB** (set `ANDROID_HOME`)
4. **Appium 2.x** (`npm install -g appium`)
5. **Appium UiAutomator2 Driver** (`appium driver install uiautomator2`)

### Installation & Execution Steps

```bash
# 1. Install Node.js dependencies
npm install

# 2. Install Python requirements
pip install -r automation/requirements.txt

# 3. Start Appium Server (in a separate terminal)
appium --log-no-colors

# 4. Execute the Master Enterprise Suite (420+ Test Cases)
python automation/runners/run_enterprise_suite.py

# 5. Alternatively, run Node.js Mobile Appium Suite
npm run test:appium
```

---

## ⚙️ 2. CI/CD Execution Guide (GitHub Actions)

The pipeline is defined in `.github/workflows/android-e2e.yml` and runs automatically on:
- **`push`** to `main`, `master`, or `develop` branches.
- **`pull_request`** targeting `main` or `master`.
- **`workflow_dispatch`** (manual trigger from GitHub UI).
- **`schedule`** (cron nightly execution at midnight UTC).

### Pipeline 21-Stage Workflow Breakdown

1. **Stage 1**: Checkout Repository
2. **Stage 2**: Setup Java (JDK 17)
3. **Stage 3**: Setup Android SDK
4. **Stage 4**: Setup Node.js & Install Dependencies
5. **Stage 5**: Build Android APK (`npm run android:build`)
6. **Stage 6**: Start Android Emulator (KVM / UiAutomator2 API 33)
7. **Stage 7**: Verify Emulator Readiness (`adb wait-for-device`)
8. **Stage 8**: Install APK on Emulator (`adb install`)
9. **Stage 9**: Start Appium Server
10. **Stage 10**: Verify Appium Health (`curl http://127.0.0.1:4723/status`)
11. **Stage 11**: Execute Appium E2E Tests (420+ Test Cases)
12. **Stage 12**: Capture Screenshots
13. **Stage 13**: Capture Logs (`adb logcat`)
14. **Stage 14**: Generate Excel Reports
15. **Stage 15**: Generate HTML Reports
16. **Stage 16**: Generate JSON Report
17. **Stage 17**: Generate Markdown Summary
18. **Stage 18**: Upload Artifacts (30 Days Retention)
19. **Stage 19**: Publish Reports to GitHub Pages (`reports/latest/` & `reports/history/build-N/`)
20. **Stage 20**: Update Historical Execution Trends
21. **Stage 21**: Publish GitHub Action Summary (`$GITHUB_STEP_SUMMARY`)

---

## 🌐 3. Live GitHub Pages Report URL

After the GitHub Actions workflow completes, reports are hosted at:

```
https://<github-username>.github.io/<repository-name>/reports/latest/execution-report.html
```

---

## 📂 4. Generated Output Reports & Artifacts

All results are saved under `Test Results/`:

- `Test Results/Excel/Automation_Test_Report.xlsx` (Master workbook with 7 sheets: Executed Test Cases, Passed Tests, Failed Tests, Skipped Tests, Execution Metrics, Defect Summary, Pass Rate Summary)
- `Test Results/Excel/Passed_Test_Cases.xlsx`
- `Test Results/Excel/Failed_Test_Cases.xlsx`
- `Test Results/Excel/Execution_Summary.xlsx`
- `Test Results/HTML/execution-report.html` (Interactive search & filtering table)
- `Test Results/HTML/dashboard.html` (Visual KPI cards & Doughnut charts)
- `Test Results/HTML/trends.html` (Historical pass rate trend)
- `Test Results/JSON/execution-results.json`
- `Test Results/Summary/summary.md`

---

## 🔧 5. Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `ECONNREFUSED 127.0.0.1:4723` | Appium Server is not running on port 4723 | Run `appium --log-no-colors &` before executing tests |
| `Could not find a connected Android device` | ADB daemon missing emulator | Ensure `adb devices` lists emulator; run `adb kill-server && adb start-server` |
| `openpyxl missing` | Python Excel dependency not installed | Run `pip install openpyxl` |
| `GitHub Pages 404` | Pages not enabled in repository settings | Go to Repository Settings -> Pages -> Source: Deploy from branch `gh-pages` |
