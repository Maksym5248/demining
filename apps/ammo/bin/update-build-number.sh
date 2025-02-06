#!/bin/bash

buildNumber=$(node -p -e "require('./package.json')['build-number']" | tr -d '\n')

nextBuildNumber=$(( $buildNumber+ 1 ))

prev="\"build-number\": $buildNumber"
next="\"build-number\": $nextBuildNumber"

sed -i '' "s/$prev/$next/g" package.json

git add ./package.json
git commit -m "build-number: $nextBuildNumber" --no-verify