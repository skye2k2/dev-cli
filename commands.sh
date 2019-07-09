#! /bin/bash
set -o errexit
set -o pipefail

# --------------------------------------------------------------------------------
# Script: commands.sh
# Author: Clif Bergmann (skye2k2)
# Date: 2019
# Purpose: To run custom commands that are not common enough to stick into the core dev-cli. Modify on your own as desired.
# --------------------------------------------------------------------------------

echo -e "\nENTERING CUSTOM BASH LAND...\n"

# FORCE-COMMIT AN ESLINT CONFIGURATION CHANGE
# git reset --hard origin/master
# cp -f ~/sandbox/canonical/.eslintrc.json $PWD/.eslintrc.json
# git add .
# git commit -m "ESLint: Update" --no-verify
# git push origin master --no-verify
