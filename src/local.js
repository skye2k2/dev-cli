#! /usr/bin/env node

// Returns an immediately-invoked function, so that all you have to do to run the script is just require when you want it to run.

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const child = require('child_process');
const process = require('process');
const inquirer = require('inquirer');
// eslint-disable-next-line
const packageJson = require(`${process.cwd()}/package.json`);

module.exports = command;

/**
 * @function
 * @description - The core command for local scripts in the dev-cli.
 */
async function command () {
  const {choice} = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Execute local command:',
      choices: [
        // TODO: ALLOW MULTIPLE SELECTION (CHECK REFERNECE-SRC): https://github.com/SBoudrias/Inquirer.js/#checkbox---type-checkbox
        {value: 'branches', name: 'branches - List out open branches by repository or author'},
        {value: 'command', name: 'command - Run the command(s) found in commands.sh'},
        {value: 'fame', name: 'fame - Calculate git-fame (depends on https://github.com/oleander/git-fame-rb)'},
        {value: 'init', name: 'init - HOWTO: Initial repository initialization'},
        {value: 'update', name: 'update - Update repositories'}
      ]
    }
  ]);

  // TODO: SELECT DEPTH--DEFAULT 2/3: https://github.com/SBoudrias/Inquirer.js/#input---type-number

  const directoryList = await findGitRepositoryDirectories(/* depth */);

  console.log(directoryList);

  switch (choice) {
    case 'branches':
      break;

    case 'command':
      child.execSync('./commands.sh');
      break;

    case 'fame':
      break;

    case 'init':
      console.log(chalk.yellow('\tvisit https://integration.familysearch.org/frontier/coverage/\n\tfilter by the appropriate team\n\tclick the "Generate Cloning Script" button\n\tcd into your desired destination\n\tcopy+paste the result into your terminal.'));
      break;

    case 'update':
      update();
      break;

    default:
      break;
  }

  continueExecution();
}

/**
 * @function
 * @description - Retrieve a list of all directories that contain a .git folder. Ignores .hidden_directories.
 * @param {number} depth - How many levels to descend, looking for matching directories.
 * @returns {Array} - List of all directories to run against.
 */
async function findGitRepositoryDirectories (depth) {
  const srcPath = process.cwd();

  // IF DEPTH && DEPTH > 1 && DEPTH < 4, CREATE A LOOP AND RUN AGAINST THE PREVIOUS RESULTS

  return fs.readdirSync(srcPath).filter((fileName) => {
    return !fileName.startsWith('.') &&
      fs.statSync(path.join(srcPath, fileName)).isDirectory() &&
      fs.existsSync(path.join(srcPath, fileName, '.git'));
  });
}

/**
 * @function
 * @description - Update a repository
 */
async function update () {
  console.log(chalk.yellow('...updating'));
  // if monorepo, run learna clean
  // rm node_modules
  // rm bower_components
  // run npm install
}

/**
 * @function
 * @description - Continue execution.
 */
function continueExecution () {
  console.log(chalk.green('...continuing'));
  process.exit(0);
}
