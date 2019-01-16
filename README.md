# Dev CLI

[![Maintainability](https://api.codeclimate.com/v1/badges/84afc823b7f3426f7614/maintainability)](https://codeclimate.com/github/skye2k2/dev-cli/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/84afc823b7f3426f7614/test_coverage)](https://codeclimate.com/github/skye2k2/dev-cli/test_coverage) [![Build Status](https://travis-ci.com/skye2k2/dev-cli.svg?branch=master)](https://travis-ci.com/skye2k2/dev-cli)

## Intro

This is the Dev CLI--an npm-based set of scripts to make development easier, made accessible though a global command-line-interface.

<details>
<summary>Extended description</summary>

As an engineer responsible for the maintenance of > 50 disparate repositories, I need to be able to manage things quickly. Some tasks are easily repetitive, but time-consuming. Other tasks require multi-stage commands or various levels of data aggregation. This CLI is meant to ease that strain by automating the various bits and pieces.

</details>

<details>
<summary>**Install**</summary>

### Install with npm
Installing globally will give you access to the `dev` command in your terminal.
```bash
npm i -g skye2k2/dev-cli
```
### Install with Yarn (if desired)
If you haven't already installed `yarn`, do so as instructed here:

https://yarnpkg.com/en/docs/install

Then run:

```bash
yarn global add https://github.com/skye2k2/dev-cli.git
```

</details>

## dev-cli commands:

---

> _work-in-progress_

---

### repos

A repository management script that performs a number of different functions.

#### Common flags:

`-topic={TOPIC_NAME}`: The GitHub topic to search by to locate remote repositories to run against. If omitted, will run against the target directory and repositories found there.

`-depth=1`: When running against locally-installed repositories, how many directories deep to search for GitHub repositories to run against.

`-list`: Overrides all flags below, just printing out the target list of repositories.

#### _Flags specific to running against remote repositories:_

`-`:


#### _Flags specific to running against local repositories:_

`-c='command(s) to run'`: Run the specified command(s).
`-u`: Update (e.g. `git pull`).

<details>
<summary>Package dependency details</summary>

 - boxen, got, inquirer, netrc, ora, semver-diff are required by checkIfOutdated, which determines if the installed version

</details>

## TODOs:

 - Actually add some useful scripts
