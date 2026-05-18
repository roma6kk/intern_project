import http from 'k6/http';
import { check, sleep } from 'k6';

// --- настройки в скрипте ---
// Через nginx (как в браузере): https://localhost/api
// Напрямую в core, без nginx: http://127.0.0.1:3000
const BASE_URL = 'https://localhost/api';
const EMAIL = 'romaananyev8@gmail.com';
const PASSWORD = '12345678';
const FEED_LIMIT = 10;

const ALLOWED_VUS = [50, 100, 200, 500];
const targetVus = Number(__ENV.K6_TARGET_VUS || 50);

if (!ALLOWED_VUS.includes(targetVus)) {
  throw new Error(`K6_TARGET_VUS: ${ALLOWED_VUS.join(' | ')}`);
}

export const options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: '1m', target: targetVus },
    { duration: '3m', target: targetVus },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
  },
};

function login() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (res.status !== 200) {
    return null;
  }

  return res.json('accessToken');
}

let accessToken = null;

export default function () {
  if (!accessToken) {
    accessToken = login();
    if (!accessToken) {
      sleep(1);
      return;
    }
  }

  const res = http.get(`${BASE_URL}/posts/feed?limit=${FEED_LIMIT}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 401) {
    accessToken = null;
  }

  check(res, { 'feed 200': (r) => r.status === 200 });
  sleep(1);
}
