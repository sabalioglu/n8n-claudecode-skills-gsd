#!/usr/bin/env node
/**
 * update-status.js - Updates context/status.json with validation results
 *
 * Usage:
 *   node update-status.js build <status> <duration> <timestamp>
 *   node update-status.js lint <status> <duration> <timestamp> <tool> <errors> <warnings> <fixable>
 *   node update-status.js test <status> <duration> <timestamp> <total> <passed> <failed> <skipped>
 *
 * Part of the GSD (Get Shit Done) multi-agent workflow
 */

const fs = require('fs');
const path = require('path');

// Configuration
const STATUS_FILE = process.env.STATUS_FILE || './context/status.json';

/**
 * Load existing status.json or create default structure
 */
function loadStatus() {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const content = fs.readFileSync(STATUS_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`Warning: Could not load ${STATUS_FILE}, creating new one`);
  }

  // Return default structure
  return {
    _meta: {
      description: "Build, test, and lint status - Written by Validator scripts",
      lastUpdated: null,
      version: "1.0.0",
      agent: "validators"
    },
    build: { status: null, lastRun: null, duration: null, errors: [], warnings: [], artifacts: [] },
    tests: { status: null, lastRun: null, duration: null, framework: null, summary: { total: 0, passed: 0, failed: 0, skipped: 0 }, coverage: {}, failedTests: [] },
    lint: { status: null, lastRun: null, tool: null, summary: { errors: 0, warnings: 0, fixable: 0 }, issues: [] },
    typeCheck: { status: null, lastRun: null, errors: [] },
    security: { status: null, lastRun: null, vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 }, issues: [] },
    deployment: { environment: null, status: null, lastDeploy: null, version: null, url: null },
    overall: { health: null, blockers: [], recommendations: [] }
  };
}

/**
 * Save status.json
 */
function saveStatus(status) {
  // Ensure directory exists
  const dir = path.dirname(STATUS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Update metadata
  status._meta.lastUpdated = new Date().toISOString();

  // Calculate overall health
  status.overall.health = calculateOverallHealth(status);

  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
  console.log(`Status updated: ${STATUS_FILE}`);
}

/**
 * Calculate overall health based on all checks
 */
function calculateOverallHealth(status) {
  const checks = [
    status.build?.status,
    status.lint?.status,
    status.tests?.status,
    status.typeCheck?.status
  ].filter(Boolean);

  if (checks.length === 0) return 'unknown';
  if (checks.every(s => s === 'success')) return 'healthy';
  if (checks.some(s => s === 'failed')) return 'failing';
  if (checks.some(s => s === 'warning')) return 'degraded';
  return 'unknown';
}

/**
 * Update build status
 */
function updateBuild(args) {
  const [status, duration, timestamp] = args;
  const statusData = loadStatus();

  statusData.build = {
    ...statusData.build,
    status: status || 'unknown',
    lastRun: timestamp || new Date().toISOString(),
    duration: duration ? parseInt(duration, 10) : null,
    errors: [],
    warnings: []
  };

  saveStatus(statusData);
}

/**
 * Update lint status
 */
function updateLint(args) {
  const [status, duration, timestamp, tool, errors, warnings, fixable] = args;
  const statusData = loadStatus();

  statusData.lint = {
    ...statusData.lint,
    status: status || 'unknown',
    lastRun: timestamp || new Date().toISOString(),
    duration: duration ? parseInt(duration, 10) : null,
    tool: tool || 'unknown',
    summary: {
      errors: errors ? parseInt(errors, 10) : 0,
      warnings: warnings ? parseInt(warnings, 10) : 0,
      fixable: fixable ? parseInt(fixable, 10) : 0
    },
    issues: []
  };

  saveStatus(statusData);
}

/**
 * Update test status
 */
function updateTest(args) {
  const [status, duration, timestamp, total, passed, failed, skipped] = args;
  const statusData = loadStatus();

  statusData.tests = {
    ...statusData.tests,
    status: status || 'unknown',
    lastRun: timestamp || new Date().toISOString(),
    duration: duration ? parseInt(duration, 10) : null,
    summary: {
      total: total ? parseInt(total, 10) : 0,
      passed: passed ? parseInt(passed, 10) : 0,
      failed: failed ? parseInt(failed, 10) : 0,
      skipped: skipped ? parseInt(skipped, 10) : 0
    },
    failedTests: []
  };

  saveStatus(statusData);
}

/**
 * Update type check status
 */
function updateTypeCheck(args) {
  const [status, duration, timestamp, errorCount] = args;
  const statusData = loadStatus();

  statusData.typeCheck = {
    status: status || 'unknown',
    lastRun: timestamp || new Date().toISOString(),
    duration: duration ? parseInt(duration, 10) : null,
    errorCount: errorCount ? parseInt(errorCount, 10) : 0,
    errors: []
  };

  saveStatus(statusData);
}

/**
 * Show current status
 */
function showStatus() {
  const status = loadStatus();
  console.log('\n=== Current Status ===');
  console.log(`Overall Health: ${status.overall.health || 'unknown'}`);
  console.log(`Last Updated: ${status._meta.lastUpdated || 'never'}`);
  console.log('\nChecks:');
  console.log(`  Build: ${status.build?.status || 'not run'}`);
  console.log(`  Lint: ${status.lint?.status || 'not run'}`);
  console.log(`  Tests: ${status.tests?.status || 'not run'}`);
  console.log(`  TypeCheck: ${status.typeCheck?.status || 'not run'}`);
}

// Main
const [,, command, ...args] = process.argv;

switch (command) {
  case 'build':
    updateBuild(args);
    break;
  case 'lint':
    updateLint(args);
    break;
  case 'test':
    updateTest(args);
    break;
  case 'typecheck':
    updateTypeCheck(args);
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log('Usage: update-status.js <command> [args]');
    console.log('');
    console.log('Commands:');
    console.log('  build <status> <duration> <timestamp>');
    console.log('  lint <status> <duration> <timestamp> <tool> <errors> <warnings> <fixable>');
    console.log('  test <status> <duration> <timestamp> <total> <passed> <failed> <skipped>');
    console.log('  typecheck <status> <duration> <timestamp> <errorCount>');
    console.log('  status');
    process.exit(1);
}
