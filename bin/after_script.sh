#! /bin/bash
set -o errexit
set -o pipefail

# Bash Script: after_script.sh
# Purpose: The script that gets run in after_script in travis.yml to send coverage updates to Code Climate

./cc-test-reporter format-coverage --output reports/coverage/codeclimate.json -t lcov reports/coverage/lcov.info
./cc-test-reporter upload-coverage -i reports/coverage/codeclimate.json
