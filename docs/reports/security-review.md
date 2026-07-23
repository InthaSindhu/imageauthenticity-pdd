# 🛡️ Application Security Audit & SAST/DAST Vulnerability Report

**Target:** Image Authenticity Verification API (Node.js Express + FastAPI AI Engine)  
**Standard:** OWASP Top 10 (2021) & CWE Top 25 Most Dangerous Software Weaknesses  

---

## Vulnerability Summary Table

| Finding ID | Severity | Vulnerability Name | OWASP Category | CWE | File Path / Endpoint |
|------------|----------|--------------------|----------------|-----|----------------------|
| **SEC-001** | **Critical** | Hardcoded JWT Secret / Weak Mock Token Verification | A07:2021-Identification & Auth Failures | CWE-287 / CWE-330 | `server/server.cjs` (`/api/*`) |
| **SEC-002** | **High** | Broken Authentication & Password Storage in Plaintext | A02:2021-Cryptographic Failures | CWE-256 / CWE-312 | `server/database.json` |
| **SEC-003** | **High** | Permissive Cross-Origin Resource Sharing (CORS `*`) | A05:2021-Security Misconfiguration | CWE-942 | `server/server.cjs` & `server/ai_service/main.py` |
| **SEC-004** | **High** | Denial of Service via Large Base64 Payloads (50MB Limit) | A05:2021-Security Misconfiguration | CWE-400 / CWE-770 | `server/server.cjs` (`express.json`) |
| **SEC-005** | **Medium** | Lack of Rate Limiting on Authentication Endpoints | A04:2021-Insecure Design | CWE-307 | `POST /api/auth/login` |
| **SEC-006** | **Medium** | Absence of Security Headers (Helmet, CSP, HSTS) | A05:2021-Security Misconfiguration | CWE-693 | Express App Initialization |
| **SEC-007** | **Medium** | Path Traversal / Arbitrary File Extension Upload Risk | A01:2021-Broken Access Control | CWE-22 / CWE-434 | `POST /api/verify` |
| **SEC-008** | **Low** | Verbose Error Stack Traces in FastAPI 500 Responses | A05:2021-Security Misconfiguration | CWE-209 | `server/ai_service/main.py` |

---

## Detailed Vulnerability Findings

### Finding SEC-001 [CRITICAL]
- **Title:** Mock JWT Token Authentication Bypass
- **CWE Mapping:** [CWE-287: Improper Authentication](https://cwe.mitre.org/data/definitions/287.html) | OWASP A07:2021
- **File:** `server/server.cjs` (Lines 64, 100)
- **Description:** The system generates deterministic pseudo-tokens formatted as `mock-jwt-token-for-<userId>`. The server does not sign or cryptographically verify tokens using HMAC/RSA algorithms.
- **Evidence:**
```javascript
const token = `mock-jwt-token-for-${user.id}`;
res.json({ token, user: userWithoutPassword });
```
- **Exploitation Scenario:** An attacker can forge an authorization header `Authorization: Bearer mock-jwt-token-for-user_admin` without knowing the password, completely hijacking administrative accounts.
- **Impact:** Total authentication bypass and privilege escalation across all user accounts.
- **Remediation:** Implement standard JSON Web Tokens using `jsonwebtoken` library signed with an environment secret (`jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })`).

---

### Finding SEC-002 [HIGH]
- **Title:** Plaintext Password Storage in JSON Database
- **CWE Mapping:** [CWE-256: Unprotected Storage of Credentials](https://cwe.mitre.org/data/definitions/256.html) | OWASP A02:2021
- **File:** `server/database.json` & `server/server.cjs` (Lines 58, 88)
- **Description:** User passwords are stored in raw plaintext inside `database.json` without hashing or salting.
- **Evidence:**
```javascript
const newUser = {
  id: `user_${Date.now()}`,
  name, email, password // Stored in plain text!
};
```
- **Exploitation Scenario:** Any local file read vulnerability, backup leak, or repository misconfiguration instantly compromises all user credentials.
- **Remediation:** Hash passwords using `bcrypt` (or `argon2id`) with a cost factor >= 12 prior to storing.

---

### Finding SEC-003 [HIGH]
- **Title:** Overly Permissive CORS Policy (`Access-Control-Allow-Origin: *`)
- **CWE Mapping:** [CWE-942: Permissive Cross-Domain Policy](https://cwe.mitre.org/data/definitions/942.html) | OWASP A05:2021
- **File:** `server/server.cjs` (Line 11) & `server/ai_service/main.py` (Line 67)
- **Description:** Both Express and FastAPI microservices allow requests from any origin (`*`) with credentials enabled.
- **Remediation:** Restrict allowed origins to specific trusted domain lists via environment variables.

---

### Finding SEC-004 [HIGH]
- **Title:** Unrestricted Request Body Memory Limits (50MB Base64 Payload DoS)
- **CWE Mapping:** [CWE-400: Uncontrolled Resource Consumption](https://cwe.mitre.org/data/definitions/400.html) | OWASP A05:2021
- **File:** `server/server.cjs` (Line 12)
- **Description:** `express.json({ limit: '50mb' })` allows client requests up to 50MB. Multiple concurrent 50MB requests consume excessive RAM and cause V8 garbage collection freezes.
- **Remediation:** Stream file uploads directly using multipart forms (`multer`) rather than holding raw 50MB Base64 strings in memory.
