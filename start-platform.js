#!/usr/bin/env node
/**
 * Unified Process Orchestrator for Render
 * Runs both FastAPI backend (port 8000) and Next.js frontend (port $PORT / 10000)
 * Works in both Docker container and native Render Node environments.
 */

const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = __dirname;
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const PORT = process.env.PORT || '10000';

console.log('====================================================');
console.log('🚀 Starting GyaanLab Unified Platform (FastAPI + Next.js)');
console.log(`📡 Render PORT: ${PORT}`);
console.log(`📁 Root: ${ROOT_DIR}`);
console.log('====================================================');

// 1. Detect Python executable
function getPythonCommand() {
  const candidates = ['python3', 'python'];
  for (const cmd of candidates) {
    try {
      execSync(`${cmd} --version`, { stdio: 'ignore' });
      return cmd;
    } catch (e) {
      // continue
    }
  }
  return 'python3';
}

const pythonCmd = getPythonCommand();
console.log(`🐍 Using Python command: ${pythonCmd}`);

// 2. Launch FastAPI Backend
console.log('⚙️  [1/2] Launching FastAPI backend on 0.0.0.0:8000...');

const backendEnv = {
  ...process.env,
  PYTHONPATH: `${BACKEND_DIR}:${process.env.PYTHONPATH || ''}`,
  PYTHONUNBUFFERED: '1',
};

const fastapiProcess = spawn(
  pythonCmd,
  ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000'],
  {
    cwd: BACKEND_DIR,
    env: backendEnv,
    stdio: ['inherit', 'pipe', 'pipe'],
  }
);

fastapiProcess.stdout.on('data', (data) => {
  process.stdout.write(`[FastAPI] ${data}`);
});

fastapiProcess.stderr.on('data', (data) => {
  process.stderr.write(`[FastAPI] ${data}`);
});

let fastapiExited = false;
fastapiProcess.on('exit', (code, signal) => {
  fastapiExited = true;
  console.error(`❌ [FastAPI] Exited with code ${code} (signal: ${signal})`);
});

// 3. Health-check FastAPI until responsive (up to 30 seconds)
function waitForFastAPI(maxAttempts = 60, intervalMs = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      attempts++;
      if (fastapiExited) {
        return reject(new Error('FastAPI process exited before becoming healthy'));
      }

      const req = http.get('http://127.0.0.1:8000/health', (res) => {
        if (res.statusCode === 200) {
          console.log('✅ [FastAPI] Health check passed! Responding on port 8000.');
          return resolve();
        }
        retry();
      });

      req.on('error', () => {
        retry();
      });

      req.setTimeout(400, () => {
        req.destroy();
        retry();
      });

      function retry() {
        if (attempts >= maxAttempts) {
          console.warn('⚠️ [FastAPI] Timeout waiting for /health. Continuing to launch frontend anyway...');
          return resolve();
        }
        setTimeout(check, intervalMs);
      }
    };

    check();
  });
}

// 4. Launch Next.js Frontend
async function startFrontend() {
  await waitForFastAPI();

  console.log(`🌐 [2/2] Launching Next.js frontend on 0.0.0.0:${PORT}...`);

  const frontendEnv = {
    ...process.env,
    PORT: PORT,
    HOSTNAME: '0.0.0.0',
    NODE_ENV: 'production',
  };

  let nextProcess;

  // Check possible locations for standalone server.js or next start
  const standaloneLocations = [
    path.join(FRONTEND_DIR, 'server.js'),
    path.join(FRONTEND_DIR, '.next', 'standalone', 'server.js'),
    path.join(ROOT_DIR, 'server.js'),
  ];

  const foundStandalone = standaloneLocations.find((loc) => fs.existsSync(loc));

  if (foundStandalone) {
    console.log(`📦 Using Next.js standalone server: ${foundStandalone}`);
    nextProcess = spawn(process.execPath, [foundStandalone], {
      cwd: path.dirname(foundStandalone),
      env: frontendEnv,
      stdio: 'inherit',
    });
  } else {
    console.log('📦 Starting Next.js via npm start...');
    nextProcess = spawn(
      process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['--prefix', 'frontend', 'run', 'start', '--', '-p', PORT, '-H', '0.0.0.0'],
      {
        cwd: ROOT_DIR,
        env: frontendEnv,
        stdio: 'inherit',
      }
    );
  }

  nextProcess.on('exit', (code, signal) => {
    console.log(`Next.js process exited with code ${code}`);
    cleanup();
    process.exit(code || 0);
  });
}

function cleanup() {
  if (fastapiProcess && !fastapiExited) {
    console.log('Shutting down FastAPI backend...');
    fastapiProcess.kill('SIGTERM');
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

startFrontend().catch((err) => {
  console.error('Fatal initialization error:', err);
  cleanup();
  process.exit(1);
});
