/**
 * Minimal test runner - no external dependencies.
 * Provides describe(), it(), expect(), and run() to execute tests in the browser.
 */

const suites = [];
let currentSuite = null;

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toBeCloseTo(expected, precision = 2) {
      const factor = Math.pow(10, precision);
      const a = Math.round(actual * factor) / factor;
      const b = Math.round(expected * factor) / factor;
      if (a !== b) {
        throw new Error(`Expected ${actual} to be close to ${expected} (precision ${precision})`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null but got ${actual}`);
      }
    },
    toBeNaN() {
      if (!Number.isNaN(actual)) {
        throw new Error(`Expected NaN but got ${actual}`);
      }
    },
    toBeGreaterThanOrEqual(n) {
      if (actual < n) {
        throw new Error(`Expected ${actual} to be >= ${n}`);
      }
    },
    toBeLessThanOrEqual(n) {
      if (actual > n) {
        throw new Error(`Expected ${actual} to be <= ${n}`);
      }
    },
    toHaveProperty(prop) {
      if (!Object.prototype.hasOwnProperty.call(actual, prop)) {
        throw new Error(`Expected object to have property "${prop}"`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
  };
}

function describe(name, fn) {
  const suite = { name, tests: [] };
  suites.push(suite);
  const prev = currentSuite;
  currentSuite = suite;
  try {
    fn();
  } finally {
    currentSuite = prev;
  }
}

function it(name, fn) {
  if (!currentSuite) {
    throw new Error('it() must be called inside describe()');
  }
  currentSuite.tests.push({ name, fn });
}

function run() {
  const results = { passed: 0, failed: 0, errors: [] };
  for (const suite of suites) {
    for (const test of suite.tests) {
      try {
        test.fn();
        results.passed++;
      } catch (err) {
        results.failed++;
        results.errors.push({
          suite: suite.name,
          test: test.name,
          message: err.message,
        });
      }
    }
  }
  return results;
}

function runAndRender(containerId) {
  const results = run();
  const el = document.getElementById(containerId);
  if (!el) return results;

  const total = results.passed + results.failed;
  const status = results.failed === 0 ? 'All tests passed' : `${results.failed} test(s) failed`;
  const color = results.failed === 0 ? '#2e7d32' : '#c62828';

  let html = `
    <h2 style="color: ${color}; margin: 0 0 0.5rem 0;">${status}</h2>
    <p style="margin: 0 0 1rem 0;">${results.passed} passed, ${results.failed} failed, ${total} total</p>
  `;

  if (results.errors.length > 0) {
    html += '<ul style="margin: 0; padding-left: 1.5rem; color: #c62828;">';
    for (const e of results.errors) {
      html += `<li><strong>${e.suite} › ${e.test}</strong>: ${e.message}</li>`;
    }
    html += '</ul>';
  }

  el.innerHTML = html;
  return results;
}

export { describe, it, expect, run, runAndRender };
