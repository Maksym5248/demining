#!/bin/zsh
# Usage: ./bin/prepare-config.sh
# Reads .env file and sets each variable in Firebase Functions config

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  echo ".env file not found!"
  exit 1
fi

CONFIG_ARGS=()
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
  # Remove possible export keyword
  key=${key#export }
  # Remove quotes from value
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"
  # Convert key to lowercase and replace _ with . for Firebase config
  key=$(echo "$key" | tr '[:upper:]' '[:lower:]')
  CONFIG_ARGS+=("env.$key=\"$value\"")
done < "$ENV_FILE"

if [ ${#CONFIG_ARGS[@]} -eq 0 ]; then
  echo "No variables found in .env file."
  exit 1
fi

CMD=(firebase functions:config:set)
for arg in "${CONFIG_ARGS[@]}"; do
  CMD+=("$arg")
done

echo "Running: ${CMD[@]}"
"${CMD[@]}"
