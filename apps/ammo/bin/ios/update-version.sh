#!/usr/bin/env bash

version=$(node -p -e "require('../package.json')['version']" | tr -d '\n')
buildNumber=$(node -p -e "require('../package.json')['build-number']" | tr -d '\n')

/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $version" "$INFOPLIST_FILE"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $buildNumber" "$INFOPLIST_FILE"

