#! /bin/bash
set -o errexit
set -o pipefail

# Bash Script: pre_commit_commands.sh
# Purpose: Run standards and silently fix errors before commmitting code.
# Usage: Add this script as part of a pre-commit hook: `node_modules/fs-common-build-scripts/bin/pre_commit_commands.sh`

# Thesis defense:
# Scenario: We do not want unstaged changes to be added to the commit when we silently fix standards infractions, so we need to stash our unstaged changes prior to running standards. Problem being, if we have no unstaged changes, the git command fails. We could work around this, but it was simpler to just always create a temporary file to stash.
# NOTE: `\` is used to continue commands listed on separate lines.

# Steps:
# 1. Create a temporary file
# 2. Stash unstaged changes
# 3. Delete any untracked files the stash left behind (due to files being deleted)
# 4. Run standards checks with autofix enabled
# Regardless of standards results:
# 5. Add any standards autofixes
# 6. Pop our temporary stash
# (6.) If the apply of the stash causes conflicts (when autofix makes complex changes), we will leave the stuff in a bad state, so instead, abort:
#    a) Alert why we failed
#    b) Remove the temporary file
#    c) Remove the changes from running standards
#    d) Restore original changes
#    e) Remove the temporary file again (it came back when we restored the original changes)
#    f) Exit with 1 status
# 7. Remove the temporary file
# (7.) If standards checks failed, exit with 1 status

touch .gitcommithooktempfile && \
git stash --keep-index --include-untracked --quiet && \
git clean -d -f -q && ( \
  ( \
    semistandard --verbose '**/*.html' '**/*.js' --fix | snazzy && \
    stylelint '**/*.html' '**/*.css' --fix --verbose \
  ) || \
  ( \

    git add . && \
    ( git stash apply --quiet || \
      ( \
        echo 'ERROR: Standards failed: there were conflicts between your staged code and the auto-fixed code. Please run `npm run standard-fix` separately before committing again.' && \
        rm .gitcommithooktempfile && \
        git reset --hard --quiet && \
        git stash pop --quiet && \
        rm .gitcommithooktempfile && \
        exit 1 \
      ) \
    ) && \
    git stash drop && \
    rm .gitcommithooktempfile && \
    exit 1 \
  ) \
) && \
git add . && \
( git stash apply --quiet || \
  ( \
    echo 'ERROR: there were conflicts between your staged code and the auto-fixed code. Please run `npm run standard-fix` separately before committing again.' && \
    rm .gitcommithooktempfile && \
    git reset --hard --quiet && \
    git stash pop --quiet && \
    rm .gitcommithooktempfile && \
    exit 1 \
  ) \
) && \
git stash drop && \
rm .gitcommithooktempfile
