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

// 1. Detect base Python executable
function getBasePythonCommand() {
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

const basePythonCmd = getBasePythonCommand();
console.log(`🐍 Detected base Python command: ${basePythonCmd}`);

// 2. Ensure Python Dependencies (supports Debian/Ubuntu PEP 668 externally-managed environments)
function ensureDependencies() {
  console.log('🔍 Checking Python dependencies (fastapi, uvicorn, etc.)...');
  
  // First check if base python already has packages
  try {
    execSync(`${basePythonCmd} -c "import fastapi, uvicorn, pydantic, sqlalchemy, asyncpg"`, {
      stdio: 'ignore',
    });
    console.log('✅ Python dependencies already satisfied in base environment.');
    return basePythonCmd;
  } catch (err) {
    console.log('📦 Missing Python dependencies. Installing from backend/requirements.txt...');
  }

  const reqPath = path.join(BACKEND_DIR, 'requirements.txt');

  // Strategy A: Try pip install with --break-system-packages (recommended by PEP 668 in containers/VMs)
  try {
    console.log('⚡ Trying: pip install --break-system-packages...');
    execSync(`${basePythonCmd} -m pip install --break-system-packages --no-cache-dir -r "${reqPath}"`, {
      stdio: 'inherit',
    });
    console.log('✅ Python dependencies installed successfully via --break-system-packages.');
    return basePythonCmd;
  } catch (breakErr) {
    console.warn('⚠️ pip install --break-system-packages failed or unsupported, creating .venv...');
  }

  // Strategy B: Create an isolated virtual environment (.venv)
  const venvDir = path.join(ROOT_DIR, '.venv');
  const venvPython = process.platform === 'win32'
    ? path.join(venvDir, 'Scripts', 'python.exe')
    : path.join(venvDir, 'bin', 'python');
  const venvPip = process.platform === 'win32'
    ? path.join(venvDir, 'Scripts', 'pip.exe')
    : path.join(venvDir, 'bin', 'pip');

  if (!fs.existsSync(venvPython)) {
    console.log(`🌱 Creating virtual environment at ${venvDir}...`);
    execSync(`${basePythonCmd} -m venv "${venvDir}"`, { stdio: 'inherit' });
  }

  console.log(`📦 Installing dependencies into .venv...`);
  execSync(`"${venvPip}" install --no-cache-dir -r "${reqPath}"`, {
    stdio: 'inherit',
  });
  console.log('✅ Python dependencies installed successfully in .venv.');
  return venvPython;
}

let activePythonCmd = basePythonCmd;
try {
  activePythonCmd = ensureDependencies();
} catch (depErr) {
  console.error('⚠️ Critical warning during dependency preparation:', depErr.message);
}

// 3. Launch FastAPI Backend
console.log(`⚙️  [1/2] Launching FastAPI backend using: ${activePythonCmd} on 0.0.0.0:8000...`);

const userLocalBin = path.join(process.env.HOME || '/opt/render', '.local', 'bin');
process.env.PATH = `${userLocalBin}:${process.env.PATH || ''}`;

const backendEnv = {
  ...process.env,
  PATH: `${userLocalBin}:${process.env.PATH || ''}`,
  PYTHONPATH: `${BACKEND_DIR}:${process.env.PYTHONPATH || ''}`,
  PYTHONUNBUFFERED: '1',
};

// Use stdio: 'inherit' so Python outputs any errors directly to Render console
const fastapiProcess = spawn(
  activePythonCmd,
  ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000'],
  {
    cwd: BACKEND_DIR,
    env: backendEnv,
    stdio: 'inherit',
  }
);

let fastapiExited = false;
fastapiProcess.on('exit', (code, signal) => {
  fastapiExited = true;
  console.error(`❌ [FastAPI] Process exited with code ${code} (signal: ${signal})`);
});

// 4. Health-check FastAPI until responsive (up to 40 attempts = 20 seconds)
function waitForFastAPI(maxAttempts = 40, intervalMs = 500) {
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
          console.warn('⚠️ [FastAPI] Health check timed out, continuing to launch frontend...');
          return resolve();
        }
        setTimeout(check, intervalMs);
      }
    };

    check();
  });
}

// 5. Launch Next.js Frontend
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
