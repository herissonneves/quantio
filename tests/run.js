/**
 * Loads all test files and runs the test suite.
 * Results are rendered into #test-results.
 */

import { runAndRender } from "./test-runner.js";

// Import test files so they register their suites
import "./calculator.test.js";
import "./converter.test.js";

// Run tests and render results
runAndRender("test-results");
