import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '60s',
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'john.doe@example.com',
    password: 'password123'
  }), { headers: { 'Content-Type': 'application/json' } });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'has token': (r) => JSON.parse(r.body).token !== undefined,
  });

  sleep(0.2);
}
