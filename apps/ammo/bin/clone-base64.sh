cat ./android/app/ammo.keystore | base64 > ./clone/ammo.keystore.base64
cat ./android/app/google-services.json | base64 > ./clone/google-services.json.base64
cat ./android/app/gradle.sign.properties | base64 > ./clone/gradle.sign.properties.keystore.base64
cat .env | base64 > ./clone/.env.base64
