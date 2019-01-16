#! /usr/bin/env node

/**
  Node script: pre_commit_checks.js
  Purpose #1: To check that a component's package.json versions match. Otherwise, the Frontier Github Automator will not create an automatic release. See: https://github.com/fs-webdev/github-automator#using-a-post-endpoint-for-more-fine-grained-control
  Purpose #2: To warn a developer that a component's package.json was not modified as part of their changes.
  Purpose #3: To warn a developer that tests were not modified as a part of their changes.
  Usage: Add this script as part of a pre-commit hook: `node node_modules/fs-common-build-scripts/bin/pre_commit_checks.js`
  TODO: utilize console coloring to improve visibility of warnings and errors.
**/
const fs = require('fs');
const { exec } = require('child_process');

let packageFile;
this.error = false;

try {
  packageFile = fs.readFileSync('package.json');
} catch (err) {
  console.error('ERROR: Missing package.json file (provides testing frameworks and standards tools).');
  // console.error(err.toString());
  this.error = true;
}

if (this.error) {
  process.exit(1);
}

let gitStatus = {
  packageVersionModified: false,
  testsModified: false
};

try {
  // Note: `|| true` is tacked on so that if the grep command doesn't find anything we don't throw an error.
  let packageStatus = runCommand('git diff --staged --minimal -- package.json | grep \'+  "version"\' || true', 'packageVersionModified');
  let testsStatus = runCommand('git status -s --ignore-submodules | grep "M *test/" || true', 'testsModified');
  Promise.all([packageStatus, testsStatus]).then((returnValues) => {
    if (!gitStatus.packageVersionModified) {
      console.warn('WARNING: package.json version not modified--are you sure you do not want a new release?');
    }

    if (!gitStatus.testsModified) {
      console.warn('WARNING: No modifications to tests detected--are you sure your changes do not need to be tested?');
    }
    process.exit(0);
  }, (error) => {
    console.error('ERROR: Something went dreadfully wrong:', error);
    process.exit(1);
  });
} catch (err) {
  console.error('ERROR: Could not parse package.json');
  // console.error(err.toString());
  process.exit(1);
}

// Run the git + grep commands, and interpret non-zero-length string results as success
function runCommand (command, status) {
  return new Promise((resolve, reject) => {
    exec(`${command}`, (error, stdout, stderr) => {
      if (error instanceof Error || stderr) {
        console.error('ERROR: ', error, stderr);
      }

      if (stdout && stdout !== '') {
        // console.log(status, stdout);
        gitStatus[status] = true;
      }
      resolve();
    });
  });
}
