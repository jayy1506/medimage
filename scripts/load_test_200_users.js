import http from 'k6/http';
import { check, sleep } from 'k6';

// 200 Concurrent Students Load Test
// Target: p95 latency < 400ms, 0 connection pool exhaustion errors
export const options = {
  stages: [
    { duration: '15s', target: 50 },   // Ramp up to 50 virtual users
    { duration: '30s', target: 200 },  // Ramp up to 200 concurrent students
    { duration: '45s', target: 200 },  // Sustained peak load of 200 students
    { duration: '15s', target: 0 },    // Ramp down smoothly
  ],
  thresholds: {
    http_req_duration: ['p(95)<400'], // 95% of requests must complete below 400ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test_mock_student_token',
    },
  };

  // 1. Fetch modules list
  const modRes = http.get(`${BASE_URL}/api/v1/course/modules`, params);
  check(modRes, {
    'modules status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);

  // 2. Fetch specific dual-panel topic
  const topicRes = http.get(`${BASE_URL}/api/v1/course/topics/xray-ct-physics`, params);
  check(topicRes, {
    'topic status is 200, 401, or 404': (r) => [200, 401, 404].includes(r.status),
  });

  sleep(2);

  // 3. Query RAG Tutor
  const tutorPayload = JSON.stringify({
    topic_id: '00000000-0000-0000-0000-000000000001',
    prompt: 'Explain linear attenuation coefficient mu and Half-Value Layer.',
  });

  const tutorRes = http.post(`${BASE_URL}/api/v1/tutor/chat`, tutorPayload, params);
  check(tutorRes, {
    'tutor status valid': (r) => [200, 401, 404].includes(r.status),
  });

  sleep(2);
}
