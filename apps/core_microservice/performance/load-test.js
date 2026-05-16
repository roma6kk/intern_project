import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YTJkNzIyZS1jNzI0LTRjMDItYjFlYy1lNDIxM2Y5NDEzOTEiLCJ1c2VybmFtZSI6IlVzZXJBIiwianRpIjoiOWRkMmZhMDItNzQyOC00NzYzLThkNWItMGM0YTY0NjBlYTNlIiwiaWF0IjoxNzcyNjE4NTE5LCJleHAiOjE3NzI2MTk0MTl9.cd3FXPURWSTbF6JlDsWCipi0xC-30YF6dSfbu7TXp_o' 
    },
  };

  const res = http.get(`${BASE_URL}/`, params);

  check(res, { 'status was 200': (r) => r.status == 200 });
  
  sleep(1);
}