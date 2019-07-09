const _ = require('lodash');
const got = require('got');
const ora = require('ora');
const chalk = require('chalk');
const boxen = require('boxen');
const inquirer = require('inquirer');
const authToken = _.get(require('netrc')()['github.com'], 'login');
const semverDiff = require('semver-diff');
const childProcess = require('child_process');
const packageJson = require(`${__dirname}/package.json`);
const {dim, reset, green} = chalk;

const boxenOpts = {
  padding: 1,
  margin: 1,
  align: 'center',
  borderColor: 'yellow',
  borderStyle: 'round'
};

module.exports = runTheProgram => {
  if (!authToken) {
    console.log(`It appears that you don't have a github entry in a ~/.netrc file. Skipping dependency update checks.`);
    return runTheProgram();
  }

  const packagesToCheck = findGithubPackagesFromDependencies();
  const localPackageJsonData = getLocalModuleVersions(packagesToCheck);
  // we add this afterward getting the local data because dev-cli isnt in node_modules, but we still want to check if it needs to be updated
  packagesToCheck['dev-cli'] = 'github:skye2k2/dev-cli';

  Promise.all(makeAllGithubChecks(packagesToCheck, localPackageJsonData))
    .then(updateMessages => {
      let dependencyUpdateMessages = _.compact(_.map(updateMessages, updateInfo => updateInfo.message));
      dependencyUpdateMessages = _.join(dependencyUpdateMessages, '\n');
      let pinnedMessages = _.compact(_.map(updateMessages, updateInfo => updateInfo.pinnedMessage));
      pinnedMessages = _.join(pinnedMessages, '\n');

      if (pinnedMessages) {
        pinnedMessages = `The dev-cli tool has a dependency that needs updating.\n${pinnedMessages}`;
        console.log(boxen(pinnedMessages, boxenOpts));
      }

      if (dependencyUpdateMessages) {
        const npmInstallArgs = ['install', '-g', 'skye2k2/dev-cli'];
        const npmInstallString = npmInstallArgs.join(' ');

        let updateMessage = `Updates available:\n${dependencyUpdateMessages}
        This script can now update and restart itself for you now!`;

        inquirer.prompt([makePromptOptions(updateMessage)]).then(response => {
          if (response.answer === 'update') {
            const npmInstall = childProcess.spawn('npm', npmInstallArgs);
            const spinner = ora({
              text: '   Globally installing dev-cli to get its updates\n\n',
              spinner: makeMarquee('FamilySearch Rocks!!!', 20, 10)
            }).start();

            npmInstall.stdout.on('data', data => {
              console.log(`'npm ${npmInstallString}' stdout: ${data}`);
            });

            npmInstall.stderr.on('data', data => {
              console.log(`'npm ${npmInstallString}' stderr: ${data}`);
            });

            npmInstall.on('close', code => {
              if (code !== 0) {
                spinner.fail(`There was a failure with npm ${npmInstallString}.`);
                console.log('Exiting the script.');
                process.exit();
              } else {
                spinner.succeed(`Successful npm ${npmInstallString}. Restarting the script now.`);
                console.log('Restarting the script now.');
                childProcess.spawn(process.argv.shift(), process.argv, {
                  cwd: process.env.PWD,
                  detached: true,
                  stdio: 'inherit'
                });
              }
            });
          } else {
            console.log('Don\'t forget--you may be missing out!');
            runTheProgram();
          }
        });
      } else {
        try {
          runTheProgram();
        } catch (err) {
          console.log('Issue running your frontier script: ', err);
        }
      }
    })
    .catch(() => {
      console.log('Error attempting to check for dependency updates, continuing with frontier script.');
      runTheProgram();
    });
};

function findGithubPackagesFromDependencies () {
  return _.reduce(
    packageJson.dependencies,
    (obj, value, key) => {
      if (/github:fs-(webdev|eng)/.test(value)) {
        obj[key] = value;
      }
      return obj;
    },
    {}
  );
}

function getLocalModuleVersions (packagesToCheck) {
  return _.concat(
    _.map(_.keys(packagesToCheck), packageKey => {
      try {
        return require(`${__dirname}/node_modules/${packageKey}/package.json`);
      } catch (e) {
        console.log(`Error trying to read ${packageKey}'s package.json. Skipping it for update checking.`);
        // using a super high semver to make later semverdiff checks pass without warning
        return {name: packageKey, version: '999.999.999'};
      }
    }),
    // this will also put the dev-cli package as one to check against github
    [{name: packageJson.name, version: packageJson.version}]
  );
}

function makePromptOptions (message) {
  return {
    type: 'list',
    name: 'answer',
    message: boxen(message, boxenOpts),
    choices: [
      {
        value: 'update',
        name: '\uD83D\uDE00  - AUTOMATICALLY update dev-cli and restart this script!'
      },
      {
        value: 'continue',
        name: '\uD83D\uDE22  - Continue using this potentially out of date script, and not get any awesome updates.'
      }
    ]
  };
}

function makeAllGithubChecks (packagesToCheck, localPackageJsonData) {
  return _.map(packagesToCheck, url => {
    const [, packageToCheck, pinnedVersion] = /github:([^#]+)(#.+)?$/.exec(url);
    const rawDataUrl = `https://raw.githubusercontent.com/${packageToCheck}/master/package.json`;
    return got(rawDataUrl, {headers: {Authorization: `token ${authToken}`, Accept: 'application/vnd.github.v3+json'}})
      .then(response => JSON.parse(response.body))
      .then(githubData => {
        const localData = _.find(localPackageJsonData, {name: githubData.name});
        const semverDifference = semverDiff(localData.version, githubData.version);
        if (semverDifference) {
          if (pinnedVersion) {
            let pinnedMessage = `${localData.name} is pinned to ${dim(pinnedVersion)}, `;
            pinnedMessage += `but an update to ${green(githubData.version)} is available.`;
            pinnedMessage += '\nPlease let the frontier-core team know to bump the version.';
            return {pinnedMessage};
          }
          return {message: `${localData.name} ${dim(localData.version)} ${reset('→')} ${green(githubData.version)}`};
        }
        return {message: ''};
      })
      .catch(() => {
        console.log(
          `Error trying to read ${packageToCheck}'s package.json on github. Skipping it for update checking.`
        );
        return Promise.resolve({message: ''});
      });
  });
}

function makeMarquee (str, interval, pauseFrames) {
  const frames = new Array(pauseFrames || 5);
  frames.fill(str);
  for (let i = 0; i <= str.length; i++) {
    frames.unshift(' '.repeat(i) + str.substring(0, str.length - i));
    frames.push(str.substring(i) + ' '.repeat(i));
  }
  return {
    interval,
    frames
  };
}
