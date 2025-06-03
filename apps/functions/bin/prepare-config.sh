#!/bin/sh
# Usage: ./bin/prepare-config.sh
# Reads .env file and sets each variable in Firebase Functions config

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  echo ".env file not found!"
  exit 1
fi

# Initialize an empty string to hold the config arguments
CONFIG_ARGS_STR=""

while IFS='=' read -r key value; do
  # Skip comments and empty lines (POSIX compliant way)
  case "$key" in
    \#* | "") continue ;; # Skips if key starts with # or is empty
  esac

  # Remove possible export keyword
  key=${key#export }

  # Remove surrounding quotes from value (handles single and double)
  # Remove trailing quote
  value=$(echo "$value" | sed "s/^'//;s/'$//;s/^\\\"//;s/\\\"$//")

  # Convert key to lowercase
  key=$(echo "$key" | tr '[:upper:]' '[:lower:]')

  # Append to the string of arguments, quoting the value part
  # Ensure proper spacing if CONFIG_ARGS_STR is not empty
  if [ -z "$CONFIG_ARGS_STR" ]; then
    CONFIG_ARGS_STR="env.$key=\\"$value\\""
  else
    CONFIG_ARGS_STR="$CONFIG_ARGS_STR env.$key=\\"$value\\""
  fi
done < "$ENV_FILE"

if [ -z "$CONFIG_ARGS_STR" ]; then
  echo "No variables found in .env file or all were comments/empty."
  exit 1
fi

# Construct the command. Using eval is necessary here to correctly parse
# the arguments with quotes. Be cautious with eval if input is not trusted.
# Since we are constructing it from .env, it's generally acceptable.
CMD_STR="firebase functions:config:set $CONFIG_ARGS_STR"

echo "Running: $CMD_STR"
eval "$CMD_STR"
