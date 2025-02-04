#!/usr/bin/env bash
if [ -z "$APPCENTER_ANDROID_VARIANT" ]
then
    PLATFORM="ios"
else
    PLATFORM="android"
fi

echo "Current platform is $PLATFORM"

if [ -z "$ENV_FILE" ]
then
    echo "You need to define the ENV_FILE variable in App Center"
    exit 1
fi

echo "$ENV_FILE" | tr " " "\n" > .env

source bin/code-push-generate-private-key.sh
source bin/code-push-publish.sh

