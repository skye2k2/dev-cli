#! /usr/bin/env node

/**
  Node script: debt_audit.js
  Purpose: To check a codebase for latent technical debt by grepping for well-known strings
  Usage: Add this script to your script section in .travis.yml where you generally have your test script.
**/

// TODO: Fix linting exclusions once script is finished
const fs = require('fs'); // eslint-disable-line no-unused-vars
const http = require('http'); // eslint-disable-line no-unused-vars
const { exec } = require('child_process');
const results = {};

// BEGIN HARDCODED LOCAL TESTING DATA
process.env.TRAVIS_EVENT_TYPE = 'cron'; // Make sure this is disabled before committing
process.env.TRAVIS_PULL_REQUEST = 'false'; // Make sure this is disabled before committing
// END HARDCODED LOCAL TESTING DATA

if (process.env.TRAVIS_EVENT_TYPE === 'cron' && process.env.TRAVIS_PULL_REQUEST === 'false') {
} else {
  console.log('Skipping debt audit');
}

function uncoverDebt () {
  console.log('Running debt audit');

  // ONCE SUPPORTED: Reset PR and commit-related variables so that the notification message is not confusing: https://github.com/travis-ci/travis-ci/issues/7486
  // Either condense down to a one-line status report for successes, or append a list of infractions

  // Note: `|| true` is tacked on so that if the grep command doesn't find anything we don't throw an error.

  // TODO: FIGURE OUT THE RIGHT WAY TO EXCLUDE DOTFILES FROM SEARCH
  let resultForToDos = runCommand('grep -iIRoc --exclude=.*  --exclude-dir=node_modules --exclude-dir=bower_components TODO ./ || true', 'TODO'); // eslint-disable-line no-unused-vars

  let resultForHacks = runCommand('grep -iIRoc --exclude=.*  --exclude-dir=node_modules --exclude-dir=bower_components HACK ./ || true', 'HACK'); // eslint-disable-line no-unused-vars
}

// Run commands, and interpret non-zero-length string results as success
function runCommand (command, commandDesignation) {
  return new Promise((resolve, reject) => {
    exec(`${command}`, (error, stdout, stderr) => {
      if (error instanceof Error || stderr) {
        console.error('ERROR: ', error, stderr);
      }

      if (stdout && stdout !== '') {
        console.log(commandDesignation, stdout);
        results[commandDesignation] = true;
      }
      resolve();
    });
  });
}

module.exports = {
  uncoverDebt: uncoverDebt
};
