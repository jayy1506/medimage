#!/usr/bin/env node
/**
 * GyaanLab Unified Dev Runner
 * Runs both FastAPI backend (port 8000) and Next.js frontend (port 3000) concurrently.
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const ROOT_DIR = __dirname;
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');

console.log('====================================================');
console.log('🚀 Starting GyaanLab Unified Development Environment');
console.log('📡 Backend:  http://127.0.0.1:8000 (FastAPI)');
console.log('💻 Frontend: http://localhost:3000 (Next.js 14)');
console.log('====================================================\n');

let backendProcess = null;
let frontendProcess = null;

function cleanup() {
  console.log('\n🛑 Shutting down GyaanLab servers...');
  if (backendProcess) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t']);
      } else {
        backendProcess.kill('SIGINT');
      }
    } catch (e) {}
  }
  if (frontendProcess) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', frontendProcess.pid, '/f', '/t']);
      } else {
        frontendProcess.kill('SIGINT');
      }
    } catch (e) {}
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// 1. Start Python FastAPI Backend
console.log('📦 Launching FastAPI backend on port 8000...');
const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
backendProcess = spawn(
  pythonCmd,
  ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000', '--reload'],
  {
    cwd: BACKEND_DIR,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  }
);

backendProcess.stdout.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`[BACKEND] ${line}`);
});

backendProcess.stderr.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.error(`[BACKEND] ${line}`);
});

backendProcess.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`⚠️ Backend exited with code ${code}`);
  }
});

// 2. Health check to wait for backend readiness
function waitForBackend(callback, attempts = 0) {
  if (attempts > 30) {
    console.log('⚠️ Backend took long to report healthy. Proceeding to launch frontend...');
    return callback();
  }

  const req = http.get('http://127.0.0.1:8000/health', (res) => {
    if (res.statusCode === 200) {
      console.log('✅ FastAPI backend is healthy and responding on port 8000!');
      callback();
    } else {
      setTimeout(() => waitForBackend(callback, attempts + 1), 300);
    }
  });

  req.on('error', () => {
    setTimeout(() => waitForBackend(callback, attempts + 1), 300);
  });
}

// 3. Start Next.js Frontend after backend is ready
waitForBackend(() => {
  console.log('\n⚡ Launching Next.js frontend on port 3000...\n');
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  frontendProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: FRONTEND_DIR,
    stdio: 'inherit',
    shell: true,
  });

  frontendProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`⚠️ Frontend exited with code ${code}`);
    }
    cleanup();
  });
});
