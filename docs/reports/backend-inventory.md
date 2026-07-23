# 🏗️ Backend Technology & Architecture Inventory

**Project Name:** Image Authenticity Verification App  
**Assessment Date:** 2026-07-23  
**Auditor Role:** Senior Application Security Engineer & DevSecOps Specialist  

---

## 1. Technology Stack Discovery

| Service Component | Language | Framework | Runtime | Package Manager | Status |
|-------------------|----------|-----------|---------|-----------------|--------|
| **API Gateway & Core Backend** | JavaScript / Node.js | Express.js v4.19 | Node.js v20.x | npm / pnpm | Active (Port 5000) |
| **AI Microservice Engine** | Python 3.11 | FastAPI v0.111 | CPython / PyTorch 2.3 | pip | Active (Port 5001) |
| **Mobile Client** | Kotlin / Compose | Jetpack Compose | Android SDK 34 | Gradle | Active |
| **Web Frontend** | TypeScript | React v18 + Vite | Node.js v20.x | npm | Active (Port 5173) |

---

## 2. System Architecture

The application adopts a **Decoupled Microservice Architecture** with synchronous HTTP/REST inter-service communication:

```
[ Android Client / React Web UI ]
               │
               ▼
[ Node.js / Express API Gateway ] (Port 5000)
    │  ├─ Auth & User Management (database.json)
    │  ├─ History & Notifications
    │  └─ CORS Middleware & File Buffer Handling
               │ (HTTP POST /analyze)
               ▼
[ FastAPI AI Forensic Service ] (Port 5001)
    ├─ EfficientNet-B3 (PyTorch Deep Learning Core)
    ├─ ELA (Error Level Analysis) Engine
    ├─ Copy-Move Forgery Detection (ORB Feature Matching)
    ├─ Edge & Lighting Inconsistency Profiler
    └─ EXIF Metadata & Noise Pattern Inspector
```

---

## 3. API Structure & Endpoint Types

- **Protocol:** HTTP/1.1 RESTful JSON API
- **Payload Limits:** Express configured with `50MB` JSON body limit for Base64 image transfer.
- **Authentication:** Custom Bearer Token mechanism (`mock-jwt-token-for-<userId>`).
- **Authorization:** Basic User-level isolation based on `userId` matching in JSON datastore.

---

## 4. Datastore & ORM / Data Layer

- **Database:** Local JSON File-based Datastore (`server/database.json`).
- **Persistence Mechanism:** Custom synchronous file read/write helper (`readDB()` / `writeDB()`) with 5-second in-memory caching.
- **ORM/ODM:** None (Direct JSON object manipulation).

---

## 5. Security & Middleware Inventory

1. **CORS:** Enabled (`cors()` allowing all origins `*`).
2. **Body Parser:** Extended JSON parser (`limit: '50mb'`).
3. **Concurrency Control:** `asyncio.Semaphore(8)` in FastAPI AI Service to prevent CPU thread thrashing during heavy PyTorch model inference.
4. **Encoding Safety:** UTF-8 stdout/stderr re-configuration for Windows console compatibility.
