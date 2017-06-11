#!/bin/bash

# Get the last tag from GitHub
lastTag=$(git describe --tags $(git rev-list --tags --max-count=1))

# Print it to the console for verification
echo "Bumping version to new tag: ${lastTag}"

# Bump the version
npm --no-git-tag-version version $lastTag

# Copy files to dist
cpx package.json dist
cpx README.md dist

# Publish to NPM
npm publish

