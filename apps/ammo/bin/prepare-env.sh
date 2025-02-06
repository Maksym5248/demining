if [ ! -d ./config ]; then
    mkdir ./config
fi

cat ./config/ammo.keystore > ./android/app/ammo.keystore
cat ./config/google-services.json > ./android/app/google-services.json
cat ./config/GoogleService-Info.plist > ./ios/GoogleService-Info.plist
cat ./config/gradle.sign.properties > ./android/app/gradle.sign.properties.keystore
cat ./config/sentry.properties > ./android/sentry.properties
cat ./config/sentry.properties > ./ios/sentry.properties
cat ./config/env  > .env
