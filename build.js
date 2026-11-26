#!/usr/bin/env node
/**
 * Unified Build Orchestrator for Render
 * Installs frontend & backend dependencies, builds Next.js, and syncs standalone assets.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');

console.log('====================================================');
console.log('🚀 Running GyaanLab Unified Production Build');
console.log('====================================================');

// 1. Install frontend dependencies
console.log('📦 [1/4] Installing frontend dependencies...');
execSync('npm --prefix frontend install', { stdio: 'inherit' });

// 2. Setup Python environment and dependencies
console.log('🐍 [2/4] Setting up Python backend dependencies...');
const venvDir = path.join(ROOT_DIR, '.venv');
const isWin = process.platform === 'win32';
const venvPy = isWin ? path.join(venvDir, 'Scripts', 'python.exe') : path.join(venvDir, 'bin', 'python');
const venvPip = isWin ? path.join(venvDir, 'Scripts', 'pip.exe') : path.join(venvDir, 'bin', 'pip');

try {
  if (!fs.existsSync(venvPy)) {
    console.log('🌱 Creating virtual environment...');
    try {
      execSync('python3 -m venv .venv || python -m venv .venv', { stdio: 'inherit' });
    } catch (e) {
      console.warn('⚠️ Virtual environment creation skipped, falling back to global pip...');
    }
  }
  const pipCmd = fs.existsSync(venvPip) ? `"${venvPip}"` : 'pip3';
  const reqPath = path.join(BACKEND_DIR, 'requirements.txt');
  execSync(`${pipCmd} install --no-cache-dir -r "${reqPath}"`, { stdio: 'inherit' });
  console.log('✅ Python dependencies installed.');
} catch (err) {
  console.warn('⚠️ Notice during Python dependency setup:', err.message);
}

// 3. Build Next.js frontend
console.log('🏗️  [3/4] Building Next.js production frontend...');
execSync('npm --prefix frontend run build', { stdio: 'inherit' });

// 4. Sync standalone assets if standalone build was created
console.log('📋 [4/4] Verifying standalone static assets...');
const standaloneDir = path.join(FRONTEND_DIR, '.next', 'standalone');
if (fs.existsSync(standaloneDir)) {
  const targetPublic = path.join(standaloneDir, 'public');
  const targetStatic = path.join(standaloneDir, '.next', 'static');
  const srcPublic = path.join(FRONTEND_DIR, 'public');
  const srcStatic = path.join(FRONTEND_DIR, '.next', 'static');

  if (fs.existsSync(srcPublic) && !fs.existsSync(targetPublic)) {
    fs.cpSync(srcPublic, targetPublic, { recursive: true });
  }
  if (fs.existsSync(srcStatic) && !fs.existsSync(targetStatic)) {
    fs.mkdirSync(path.dirname(targetStatic), { recursive: true });
    fs.cpSync(srcStatic, targetStatic, { recursive: true });
  }
  console.log('✅ Standalone static & public assets synced.');
}

console.log('====================================================');
console.log('🎉 Production build completed successfully!');
console.log('====================================================');
