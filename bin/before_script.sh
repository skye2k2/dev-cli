#! /bin/bash
set -o errexit
set -o pipefail

# Bash Script: before_script.sh
# Purpose: The script that gets run in before_script in travis.yml to set up the global environment

curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build
