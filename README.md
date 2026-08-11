# 🔍 Image Authenticity Verification System

[![Enterprise CI/CD Deployment](https://github.com/InthaSindhu/imageauthenticity-pdd/actions/workflows/deploy-and-test.yml/badge.svg)](https://github.com/InthaSindhu/imageauthenticity-pdd/actions/workflows/deploy-and-test.yml)
[![Image Authenticity Verification E2E Tests](https://github.com/InthaSindhu/imageauthenticity-pdd/actions/workflows/e2e.yml/badge.svg)](https://github.com/InthaSindhu/imageauthenticity-pdd/actions/workflows/e2e.yml)
[![Security Review](https://github.com/InthaSindhu/imageauthenticity-pdd/actions/workflows/security-review.yml/badge.svg)](https://github.com/InthaSindhu/imageauthenticity-pdd/actions/workflows/security-review.yml)

An enterprise-grade Image Authenticity Verification system combining **Node.js/Express API Gateway**, **FastAPI/PyTorch Deep Learning Engine (EfficientNet-B3 + ELA + Copy-Move ORB)**, **Capacitor Mobile Android Application**, and an **Automated E2E Testing Pipeline (1,800 Test Cases)**.

---

## 🚀 Live Deployment & Reports

- **Live Web Application**: [https://InthaSindhu.github.io/imageauthenticity-pdd/](https://InthaSindhu.github.io/imageauthenticity-pdd/)
- **GitHub Actions Workflows**: [https://github.com/InthaSindhu/imageauthenticity-pdd/actions](https://github.com/InthaSindhu/imageauthenticity-pdd/actions)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons
- **Mobile**: Capacitor 6, Android Native Java / Gradle (`com.imageauth.verifier`)
- **Backend API Gateway**: Node.js v20 / Express.js (Port 5000)
- **AI Forensic Microservice**: FastAPI / PyTorch 2.3, OpenCV, EfficientNet-B3 (Port 5001)
- **Test Automation**: Selenium WebDriver, Appium Mobile, PyTest, OpenPyXL, Chart.js HTML Dashboards

---

## 📊 E2E Test Suite Matrix (1,800 Test Cases)

| Suite Name | Test Cases | Target Scope |
| :--- | :-: | :--- |
| 🌐 **Selenium — Website Tests** | **300** | Live Web Application Routes & POM |
| 📱 **Appium — Android Tests** | **300** | Mobile APK Views & Native Android Elements |
| 🐍 **Unit Tests — API** | **300** | Gateway & AI Forensic Service Endpoints |
| ✅ **Validation Tests** | **300** | Security Payload Limits & Input Sanitization |
| 🚀 **Deployment Status** | **300** | CDN Health & Live Availability Checks |
| 📊 **Load Testing — Performance** | **300** | RPS, Latency Distribution & Concurrent Load |
| **TOTAL** | **1,800** | **Full-Stack Assurance** |

---

## 💻 Quick Start

### 1. Install Dependencies
```bash
npm install
pip install -r requirements.txt
```

### 2. Start Services Locally
```bash
# Start Express API Gateway (Port 5000)
npm run server

# Start AI Forensic Service (Port 5001)
python server/ai_service/main.py

# Start Vite Development Server (Port 5173)
npm run dev
```

### 3. Run E2E Automation Suites
```bash
# Run 1,800 Master Test Suite
python automation/runners/run_scaled_1800_suite.py

# Run Live Web Selenium Suite
python automation/runners/test_runner.py --mode live
```