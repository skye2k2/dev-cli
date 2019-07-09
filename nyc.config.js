module.exports = {
  'all': true,
  'include': [
    '**/*.js'
  ],
  'exclude': [
    '**.*',
    '**/reports/**',
    '**/test/**'
  ],
  'check-coverage': true,
  // As of nyc#14.1.1, reporters only appear to be accepted via the command-line...see package.json, if you're still confused.
  'reporters': [
    'lcov',
    'text',
    'text-summary'
  ],
  'report-dir': 'reports/coverage/',
  'skip-empty': true,
  'skip-full': true,

  'statements': 1,
  'branches': 0,
  'functions': 0,
  'lines': 1
};
