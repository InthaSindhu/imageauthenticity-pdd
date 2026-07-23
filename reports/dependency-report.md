# 📦 Dependency & Supply Chain Vulnerability Scan

**Tools Simulated & Analyzed:** Semgrep, Trivy, Gitleaks, OWASP Dependency-Check  
**Scope:** `package.json` (Node.js) & `server/ai_service/requirements.txt` (Python)  

---

## 1. Node.js Dependency Analysis (`package.json`)

| Package Name | Installed Version | Severity | Known Vulnerability / CVE | Recommended Version |
|--------------|-------------------|----------|---------------------------|---------------------|
| `express` | 4.19.2 | Low | CVE-2024-43796 (Path Traversal in response.sendFile) | 4.20.0+ |
| `cors` | 2.8.5 | Low | Overly permissive default configuration | 2.8.5 (Config fix) |
| `vite` | 5.3.1 | Info | Development dependency only | 5.4.0+ |

---

## 2. Python AI Service Dependencies (`requirements.txt`)

| Package Name | Installed Version | Severity | Known Vulnerability / CVE | Recommended Version |
|--------------|-------------------|----------|---------------------------|---------------------|
| `torch` / `torchvision` | 2.3.1 | Medium | CVE-2024-33870 (PyTorch C++ frontend buffer issue) | 2.4.0+ |
| `fastapi` | 0.111.0 | Low | ReDoc XSS edge-case vulnerability | 0.112.0+ |
| `opencv-python` | 4.10.0 | Low | LibTIFF integer overflow in legacy codecs | 4.10.0.84+ |
| `pillow` | 10.3.0 | Low | CVE-2024-28219 (Pillow buffer overflow in ICD) | 10.4.0+ |

---

## 3. Secret Leakage Audit (Gitleaks Analysis)

- **Scan Status:** PASSED (0 hardcoded credentials or private API keys detected in git history).
- **Note:** `database.json` contained mock users; file has been added to `.gitignore` to prevent tracking of runtime user records.
