"""
Baseline & Load Testing Suite — Image Authenticity Verification App
====================================================================
Simulates N concurrent virtual users (VUs) for T duration seconds.
Uses TCP Keep-Alive connection pooling via requests.Session().
Modes:
  - api : Tests Express API Gateway (Auth, Profile, History) for maximum RPS & low latency
  - full: Stress-tests full end-to-end AI forensic image analysis (PyTorch EfficientNet CPU)
"""

import sys
import os
import time
import json
import base64
import argparse
import statistics
import concurrent.futures
import requests

# Reconfigure encoding for Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass


def generate_test_image_b64() -> str:
    """Generate a minimal valid 100x100 RGB JPEG image in Base64 for upload load testing."""
    from PIL import Image
    import io
    import numpy as np

    arr = np.random.randint(50, 200, (100, 100, 3), dtype=np.uint8)
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode('utf-8')


class LoadTester:
    def __init__(self, num_vusers: int = 100, duration_sec: int = 60, target_url: str = "http://localhost:5000", mode: str = "api", pacing_sec: float = 0.2):
        self.num_vusers = num_vusers
        self.duration_sec = duration_sec
        self.target_url = target_url.rstrip("/")
        self.mode = mode
        self.pacing_sec = pacing_sec
        self.sample_image_b64 = generate_test_image_b64()
        self.latencies = []
        self.success_count = 0
        self.failure_count = 0
        self.status_codes = {}
        self.stop_time = 0

    def worker_loop(self, worker_id: int):
        results = []
        token = "mock-jwt-token-for-user_1"
        session = requests.Session()

        if self.mode == "api":
            endpoints = [
                ("/api/auth/me", "GET", None, {"Authorization": f"Bearer {token}"}),
                ("/api/auth/login", "POST", {"email": "john.doe@example.com", "password": "password123"}, {}),
                ("/api/history", "GET", None, {"Authorization": f"Bearer {token}"}),
            ]
        else:
            endpoints = [
                ("/api/verify", "POST", {
                    "image": self.sample_image_b64,
                    "fileName": f"test_load_{worker_id}.jpg",
                    "metadata": {"source": "load_test"}
                }, {"Authorization": f"Bearer {token}"}),
            ]

        idx = 0
        while time.time() < self.stop_time:
            ep, method, body, hdrs = endpoints[idx % len(endpoints)]
            url = f"{self.target_url}{ep}"
            start_t = time.perf_counter()
            try:
                if method == "GET":
                    resp = session.get(url, headers=hdrs, timeout=10)
                else:
                    resp = session.post(url, json=body, headers=hdrs, timeout=10)
                elapsed_ms = (time.perf_counter() - start_t) * 1000.0
                status = resp.status_code
            except requests.exceptions.Timeout:
                elapsed_ms = (time.perf_counter() - start_t) * 1000.0
                status = 504
            except requests.exceptions.RequestException:
                elapsed_ms = (time.perf_counter() - start_t) * 1000.0
                status = 503
            except Exception:
                elapsed_ms = (time.perf_counter() - start_t) * 1000.0
                status = 500

            results.append((status, elapsed_ms))
            idx += 1
            if self.pacing_sec > 0:
                time.sleep(self.pacing_sec)

        session.close()
        return results

    def run(self):
        print("=" * 70)
        print(f"  BASELINE & LOAD TEST ENGINE ({self.mode.upper()} MODE) — {self.num_vusers} VIRTUAL USERS ({self.duration_sec}s)")
        print(f"  Target: {self.target_url} | Pacing: {self.pacing_sec}s")
        print("=" * 70)

        self.stop_time = time.time() + self.duration_sec
        start_test_time = time.perf_counter()

        all_results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.num_vusers) as executor:
            futures = [executor.submit(self.worker_loop, i) for i in range(self.num_vusers)]
            for future in concurrent.futures.as_completed(futures):
                try:
                    all_results.extend(future.result())
                except Exception as e:
                    print(f"[Worker Exception] {e}")

        total_test_duration = time.perf_counter() - start_test_time

        # Process statistics
        for status, lat in all_results:
            self.latencies.append(lat)
            self.status_codes[status] = self.status_codes.get(status, 0) + 1
            if 200 <= status < 400:
                self.success_count += 1
            else:
                self.failure_count += 1

        total_requests = len(self.latencies)
        rps = round(total_requests / total_test_duration, 2) if total_test_duration > 0 else 0

        sorted_lat = sorted(self.latencies) if self.latencies else [0]
        avg_lat = round(statistics.mean(sorted_lat), 2) if sorted_lat else 0
        min_lat = round(min(sorted_lat), 2) if sorted_lat else 0
        max_lat = round(max(sorted_lat), 2) if sorted_lat else 0

        p50 = round(statistics.median(sorted_lat), 2)
        p90 = round(sorted_lat[int(len(sorted_lat) * 0.90)], 2) if len(sorted_lat) >= 10 else p50
        p95 = round(sorted_lat[int(len(sorted_lat) * 0.95)], 2) if len(sorted_lat) >= 20 else p90
        p99 = round(sorted_lat[int(len(sorted_lat) * 0.99)], 2) if len(sorted_lat) >= 100 else p95

        error_rate = round((self.failure_count / total_requests * 100.0), 2) if total_requests > 0 else 0

        summary = {
            "mode": self.mode,
            "num_vusers": self.num_vusers,
            "duration_sec": round(total_test_duration, 2),
            "total_requests": total_requests,
            "success_count": self.success_count,
            "failure_count": self.failure_count,
            "error_rate_pct": error_rate,
            "rps": rps,
            "min_ms": min_lat,
            "max_ms": max_lat,
            "avg_ms": avg_lat,
            "p50_ms": p50,
            "p90_ms": p90,
            "p95_ms": p95,
            "p99_ms": p99,
            "status_codes": self.status_codes
        }

        self._print_results(summary)
        return summary

    def _print_results(self, s: dict):
        print("\n" + "═" * 70)
        print(f"       LOAD TEST RESULTS SUMMARY [{s['mode'].upper()} MODE]         ")
        print("═" * 70)
        print(f" Virtual Users (VUs)   : {s['num_vusers']}")
        print(f" Test Duration        : {s['duration_sec']} seconds")
        print(f" Total Requests       : {s['total_requests']}")
        print(f" Successful Requests : {s['success_count']} ({100 - s['error_rate_pct']}%)")
        print(f" Failed Requests     : {s['failure_count']} ({s['error_rate_pct']}%)")
        print(f" Requests Per Second  : {s['rps']} req/sec")
        print("─" * 70)
        print(" RESPONSE TIME LATENCY (ms)")
        print(f"   Fastest (Min)      : {s['min_ms']} ms")
        print(f"   Average (Mean)     : {s['avg_ms']} ms")
        print(f"   Slowest (Max)      : {s['max_ms']} ms")
        print(f"   Median (P50)       : {s['p50_ms']} ms")
        print(f"   90th Percentile    : {s['p90_ms']} ms")
        print(f"   95th Percentile    : {s['p95_ms']} ms")
        print(f"   99th Percentile    : {s['p99_ms']} ms")
        print("─" * 70)
        print(" HTTP STATUS CODE DISTRIBUTION")
        for code, cnt in s['status_codes'].items():
            print(f"   HTTP {code}          : {cnt} requests")
        print("═" * 70 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Baseline/Load Test on Image Authenticity API")
    parser.add_argument("--vusers", type=int, default=100, help="Number of concurrent virtual users")
    parser.add_argument("--duration", type=int, default=60, help="Duration of test in seconds")
    parser.add_argument("--url", type=str, default="http://localhost:5000", help="Target API Base URL")
    parser.add_argument("--mode", type=str, default="api", choices=["api", "full"], help="Test mode: 'api' for API Gateway or 'full' for AI pipeline")
    parser.add_argument("--pacing", type=float, default=0.2, help="Pacing sleep between requests per VU in seconds")
    args = parser.parse_args()

    tester = LoadTester(num_vusers=args.vusers, duration_sec=args.duration, target_url=args.url, mode=args.mode, pacing_sec=args.pacing)
    results = tester.run()

    output_path = os.path.join(os.path.dirname(__file__), f"load_test_report_{args.mode}.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"Saved JSON report to: {output_path}")
