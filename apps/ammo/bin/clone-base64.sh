if [ ! -d ./config ]; then
    mkdir ./config
fi

if [ ! -d ./config/clone ]; then
    mkdir ./config/clone
fi

cat ./config/ammo.keystore | base64 > ./config/clone/ammo.keystore.base64
cat ./config/google-services.json | base64 > ./config/clone/google-services.json.base64
cat ./config/GoogleService-Info.plist > ./config/clone/GoogleService-Info.plist
cat ./config/gradle.sign.properties | base64 > ./config/clone/gradle.sign.properties.keystore.base64
cat ./config/sentry.properties | base64 > ./config/clone/sentry.properties.base64
cat .env | base64 > ./config/clone/.env.base64
