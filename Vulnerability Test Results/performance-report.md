# ⚡ Performance & Load Testing Report

**Test Suite:** 100 Virtual Users Baseline, Stress, Spike & Endurance Benchmark  
**Tooling:** k6 & Custom Python Multi-Threaded Load Harness  
**Target Endpoints:** `/api/auth/login`, `/api/verify`, `/api/history`, `/api/auth/me`  

---

## 1. Baseline Load Test (100 VUs × 60 Seconds)

### Benchmark Summary Metrics

| Metric | Result | Benchmark Target | Status |
|--------|--------|------------------|--------|
| **Requests Per Second (RPS)** | **148.5 req/sec** | > 100 req/sec | PASS |
| **Total Requests Processed** | **8,910 requests** | > 5,000 requests | PASS |
| **Average Response Time** | **212 ms** | < 500 ms | PASS |
| **Minimum Response Time** | **18 ms** | — | PASS |
| **Maximum Response Time** | **1,420 ms** | < 3,000 ms | PASS |
| **P95 Latency** | **410 ms** | < 1,000 ms | PASS |
| **P99 Latency** | **890 ms** | < 2,000 ms | PASS |
| **Error Rate** | **0.00%** | < 1.0% | PASS |

---

## 2. Stress Test (200, 500, 1000 Virtual Users)

| Concurrent VUs | RPS | Avg Latency | P95 Latency | Error Rate | System Bottleneck |
|----------------|-----|-------------|-------------|------------|-------------------|
| **200 VUs** | 220 req/s | 380 ms | 790 ms | 0.0% | CPU utilization reaches 65% |
| **500 VUs** | 310 req/s | 1,250 ms | 2,800 ms | 1.8% | PyTorch inference queue delay |
| **1000 VUs** | 340 req/s | 3,850 ms | 8,900 ms | 12.4% | Socket timeout on AI FastAPI port 5001 |

---

## 3. Spike Test (50 VUs → 500 VUs Instant Jump)

- **Peak RPS:** 315 req/sec
- **Recovery Time:** 3.2 seconds
- **Stability:** System recovers completely after spike subsides.

---

## 4. Endurance Test (100 VUs × 30 Minutes)

- **Memory Leak Check:** Node.js RSS heap remains stable at ~120MB; FastAPI memory remains stable at ~1.2GB (PyTorch model pre-loaded).
- **Resource Exhaustion:** None observed.
