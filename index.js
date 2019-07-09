#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const checkIfOutdated = require('./checkIfOutdated');
const semverDiff = require('semver-diff');
const nodeVersion = process.versions.node;

checkIfOutdated(runTheProgram);

/**
 * @function
 * @description - The core runner of the dev-cli.
 * @returns {undefined}
 */
function runTheProgram () {
  checkRequiredVersions();
  // Available sub-commands:

  program
    .command('global')
    .usage('<global>')
    .description(
      'Run commands against your entire system'
    )
    .action(() => {
      require('./src/global.js')();
    });

  program
    .command('local')
    .usage('<local>')
    .description(
      'Run commands against local repositories, based on current working directory'
    )
    .action(() => {
      require('./src/local.js')();
    });

  program
    .command('remote')
    .usage('<remote>')
    .description(
      'Run commands against remote repositories'
    )
    .action(() => {
      require('./src/local.js')();
    });

  // program version definition needs to come after all command options
  program
    // Bring in version from package.json
    .version(require('./package.json').version)
    // Parse the arguments
    .parse(process.argv);

  program.outputHelp = function () {
    console.log(help());
  };

  if (!program.args.length) {
    program.outputHelp();
  }
}

/**
 * @function checkRequiredVersions
 * @description - Ensure that minimum required environment conditions are met.
 */
function checkRequiredVersions () {
  if (semverDiff(nodeVersion, '8.5.0')) {
    console.log(
      chalk.red(`You are running node version ${nodeVersion}. This script depends on node version 8+, and honestly, you should update, regardless.`)
    );
    process.exit(1);
  }
}

/**
 * @function help
 * @description - The command help text displayed when the --help flag is passed in.
 * @returns {undefined}
 */
function help () {
  return `
${program.commandHelp().replace('Commands:', chalk.bold.underline('Commands'))}`;
}
