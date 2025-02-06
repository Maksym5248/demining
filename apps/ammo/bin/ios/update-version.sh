#!/usr/bin/env bash

set -e  # Stop the script on any error

# Ensure SRCROOT is set
if [ -z "$SRCROOT" ]; then
  echo "🚨 SRCROOT is not set. Exiting."
  exit 1
fi

# Define the absolute path to package.json (Adjust this based on monorepo structure)
PACKAGE_JSON="$SRCROOT/../package.json"

# Debug: Check if the file exists
if [ ! -f "$PACKAGE_JSON" ]; then
  echo "🚨 package.json not found at $PACKAGE_JSON"
  exit 1
fi

# Extract values from package.json
version=$(node -p -e "require('$PACKAGE_JSON').version" | tr -d '\n')
buildNumber=$(node -p -e "require('$PACKAGE_JSON')['build-number']" | tr -d '\n')

# Debugging output
echo "📂 Current directory: $(pwd)"
echo "📜 Using package.json: $PACKAGE_JSON"
echo "🛠️ Extracted version: '$version'"
echo "🔢 Extracted buildNumber: '$buildNumber'"

# Ensure version and buildNumber are not empty
if [ -z "$version" ] || [ -z "$buildNumber" ]; then
  echo "🚨 version or buildNumber is empty. Exiting."
  exit 1
fi

# Update Info.plist
echo "✅ Updating Info.plist: $INFOPLIST_FILE"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $version" "$INFOPLIST_FILE"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $buildNumber" "$INFOPLIST_FILE"
