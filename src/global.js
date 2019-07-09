#! /usr/bin/env node

// Purpose: Especially as a developer, package, library, and cache files will occasionally take up large amounts of disk space, slowing down searching and backups. Can be run from any location. Runs intensely for several minutes.
// Returns an immediately-invoked function, so that all you have to do to run the script is just require when you want it to run.

const chalk = require('chalk');
const child = require('child_process');
const inquirer = require('inquirer');
// eslint-disable-next-line
const packageJson = require(`${process.cwd()}/package.json`);

module.exports = command;

/**
 * @function
 * @description - The core command for global scripts in the dev-cli.
 */
async function command () {
  const {choice} = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Execute global command:',
      choices: [
        {value: 'clean', name: 'Remove *all* node- and bower-related files in the ~/sandbox directory--has been known to take 5+ minutes'},
        {value: 'update', name: 'brew update, brew upgrade, brew cleanup (probably just better to have a bash alias for this)'},
        {value: 'default', name: 'A useful default option'}
      ]
    }
  ]);
  switch (choice) {
    case 'clean':
      cleanUp();
      break;

    case 'update':
      console.log(chalk.yellow('...updating'));
      break;

    default:
      break;
  }

  // continueExecution();
}

/**
 * @function
 * @description - Help tidy up unnecessary files, generally used in preparation for performing a backup.
 */
async function cleanUp () {
  let timeStart = process.hrtime();

  let initialRemainingDiskSpace = await checkDiskSpace();

  await cleanupDirectories();

  let resultingRemainingDiskSpace = await checkDiskSpace();

  // Ensure the same units are used before making savings calculation
  if (initialRemainingDiskSpace.slice(-2) === resultingRemainingDiskSpace.slice(-2)) {
    let units = initialRemainingDiskSpace.slice(-2).replace('Gi', 'GB');
    let timerEnd = process.hrtime(timeStart);
    console.log(chalk.green(`${parseInt(initialRemainingDiskSpace) - parseInt(resultingRemainingDiskSpace)}${units} of disk space freed in ${timerEnd[0]}.${Math.floor(timerEnd[1] / 1000000).toString().padStart(3, '0')} seconds`));
  } else {
    console.log(chalk.green(`Initial available disk space: ${initialRemainingDiskSpace}\nResulting available disk space: ${resultingRemainingDiskSpace}`));
  }
}

/**
 * @function
 * @description - Check the currently-available space on the / mount drive.
 * @returns {undefined}
 */
async function checkDiskSpace () {
  // ORIGINAL: bash`$(df -ht | tr -s ' ' $'\t' | grep disk1 | cut -f4)` Use tr to convert multiple consecutive spaces to a tab (the default delimiter of cut), then grep for disk1 (mac default) and return the available disk space (4th field--name, size, used, available).
  // let cmd = child.spawn('df', ['-ht', '/']);
  let result, processOutput;
  let cmd = child.spawnSync('df', ['-ht', '/']);
  processOutput = cmd.stdout.toString();

  // cmd.stdout.on('data', data => {
  //   processOutput = data;
  // });

  // return cmd.stdout.on('close', async status => {
  //   processOutput = processOutput.toString(); // Process <Buffer> into result string
  if (processOutput.length) {
    processOutput = processOutput.substring(processOutput.indexOf('\n'));
    // Split result string on multiple consecutive spaces, and grab the fourth result for available space
    result = processOutput.split('  ')[3];

    return result;
  }
  // });
}

/**
 * @function
 * @description - Recursively remove extra fluff files from the entire system.
 * @returns {undefined}
 */
async function cleanupDirectories () {
  console.log(chalk.white('...rm node_modules'));

  let cmd = child.execSync('find ~/sandbox -name "node_modules" -not -path "*/\.*" -not -path "*/dev-cli/*" -prune -type d -exec rm -rdf "{}" +');

  // Remove node_modules first (but not dev-cli's), to keep from getting false positives from size-limit's test files when searching for bower_components directories.

  console.log(chalk.white('...rm bower_components'));

  cmd = child.execSync('find ~/sandbox -name "bower_components" -not -path "*/\.*" -prune -type d -exec rm -rdf "{}" +');

  console.log(chalk.white('...npm cache clean'));

  cmd = child.execSync('npm cache clean --force');

  console.log(chalk.white('...bower cache clean'));

  cmd = child.execSync('bower cache clean');

  console.log(chalk.white('...brew cleanup'));

  cmd = child.execSync('brew cleanup');
}

/**
 * @function
 * @description - Return 0 exit status for success.
 */
function continueExecution () {
  process.exit(0);
}
