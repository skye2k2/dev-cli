#! /usr/bin/env node

/**
  Node script: create_release.js
  Purpose: To manually request a new release from the Frontier Github Automator
  only after unit tests have passed in Travis CI for commits to master.
  After creating a new release, the Frontier Github Automator will also update the Frontier Catalog.
  See: https://github.com/fs-webdev/github-automator#using-a-post-endpoint-for-more-fine-grained-control
  Usage: Add this script to after_success section in .travis.yml and set branches: only: master.
**/
const fs = require('fs');
const http = require('http');

// BEGIN HARDCODED LOCAL TESTING DATA
// process.env.TRAVIS_BRANCH = 'master';
// process.env.TRAVIS_PULL_REQUEST = 'false';
// process.env.TRAVIS_COMMIT = '6b4cce2a8aa0505330ba73ed2b6f07ac726d8a41';
// process.env.TRAVIS_REPO_SLUG = 'fs-webdev/fs-tree-couple';
// process.env.TRAVIS_COMMIT_MESSAGE = `Test multiline commit messages

// ...because those kind of need to work.
// `;
// END HARDCODED LOCAL TESTING DATA

if (process.env.TRAVIS_BRANCH === 'master' && process.env.TRAVIS_PULL_REQUEST === 'false') {
  const repoDetailArray = process.env.TRAVIS_REPO_SLUG.split('/');
  const repoOwner = repoDetailArray[0];
  const repoName = repoDetailArray[1];

  let releaseVersion;
  let versionFileName = 'bower.json';
  let jsonFile = fs.readFileSync(versionFileName);
  let jsonObject = JSON.parse(jsonFile.toString());

  if (!jsonObject.version) {
    console.error('ERROR: Component version not found in ' + versionFileName + '.');
    process.exit(1);
  } else {
    releaseVersion = jsonObject.version;
  }

  let postData = {
    owner: repoOwner,
    repoName: repoName,
    version: releaseVersion,
    skipEditedCheck: true, // Feature requested: https://github.com/fs-webdev/github-automator/issues/28
    commit: process.env.TRAVIS_COMMIT
    // description: process.env.TRAVIS_COMMIT_MESSAGE // Disabled, to make use of the enhancement (https://github.com/fs-webdev/github-automator/pull/38) that adds the message of each intervening commit between releases to the requested release.
  };

  postData = JSON.stringify(postData);

  const options = {
    hostname: 'fs-github-automator.herokuapp.com',
    path: '/release',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log(`Release ${releaseVersion} requested for ${process.env.TRAVIS_REPO_SLUG} at ${process.env.TRAVIS_COMMIT}`);

  const req = http.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.headers.warning) {
      console.error(`WARNING: ${res.headers.warning}`);
    }
    res.on('end', () => {
    });
  });

  req.on('error', e => {
    console.error(`ERROR: bad http request: ${e.message}`);
  });

  req.setTimeout(5000, function () {
    console.error('ERROR: Connection timeout');
    process.exit(1);
  });

  req.write(postData);
  req.end();
} else {
  console.log('Not running build for master--skipping release creation');
}
