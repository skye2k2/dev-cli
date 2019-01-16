#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const checkIfOutdated = require('./checkIfOutdated');
const semverDiff = require('semver-diff');
const nodeVersion = process.versions.node;

checkIfOutdated(runTheProgram);

function runTheProgram () {
  // Available subcommands
  require('./src/lintAssetManifest')(program);

  program.outputHelp = function () {
    console.log(help());
    this.emit('--help');
  };

  program
    .command('blueprint')
    .usage('<command>')
    .description(
      'Make a version 1 of a blueprint.yml file. Can use a 0.3 blueprint to help in the conversion, but not necessary'
    )
    .action(() => {
      if (semverDiff(nodeVersion, '8.5.0')) {
        console.log(
          chalk.red(`You are running node version ${nodeVersion}. The blueprint conversion script requires you to run it with node 8.5.0 or higher.
        (Your app does not need node 8, just your computer for the few minutes you run this script)`)
        );
        process.exit(1);
      }
      // putting the require here after they specify the blueprint command allows our users to not have node 8 if they are only using the init or element command
      require('./src/blueprint.js')();
    });

  program
    // Bring in version from package.json
    .version(require('./package.json').version)
    // Parse the arguments
    .parse(process.argv);

  if (!program.args.length) program.outputHelp();
}

function help () {
  return `
${program.commandHelp().replace('Commands:', chalk.bold.underline('Commands'))}
  ${chalk.bold.underline('Options')}

${program.optionHelp().replace(/^/gm, '    ')}`;
}
