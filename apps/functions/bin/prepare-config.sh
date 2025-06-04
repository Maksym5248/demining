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
PROJECT_NAME_VAR=""

while IFS='=' read -r key value; do
  # Skip comments and empty lines (POSIX compliant way)
  case "$key" in
    \#* | "") continue ;; # Skips if key starts with # or is empty
  esac

  # Remove possible export keyword
  key_no_export=${key#export }

  # Remove surrounding quotes from value (handles single and double)
  # Remove trailing quote
value_no_quotes=$(echo "$value" | sed "s/^'//;s/'$//;s/^\"//;s/\"$//")

  # Check for PROJECT_NAME
  if [ "$key_no_export" = "PROJECT_NAME" ]; then
    PROJECT_NAME_VAR="$value_no_quotes"
    continue # Skip adding PROJECT_NAME to CONFIG_ARGS_STR
  fi

  # Convert key to lowercase
  key_lower=$(echo "$key_no_export" | tr '[:upper:]' '[:lower:]')

  # Append to the string of arguments, quoting the value part
  # Ensure proper spacing if CONFIG_ARGS_STR is not empty
  if [ -z "$CONFIG_ARGS_STR" ]; then
    CONFIG_ARGS_STR="env.$key_lower=\\"$value_no_quotes\\""
  else
    CONFIG_ARGS_STR="$CONFIG_ARGS_STR env.$key_lower=\\"$value_no_quotes\\""
  fi
done < "$ENV_FILE"

if [ -z "$CONFIG_ARGS_STR" ]; then
  echo "No variables to set in Firebase config (excluding PROJECT_NAME)."
  # exit 1 # Decide if you want to exit if only PROJECT_NAME was found or no vars at all
fi

# Construct the command.
if [ -n "$PROJECT_NAME_VAR" ]; then
  CMD_STR="firebase --project $PROJECT_NAME_VAR functions:config:set $CONFIG_ARGS_STR"
else
  CMD_STR="firebase functions:config:set $CONFIG_ARGS_STR"
fi

echo "Running: $CMD_STR"
eval "$CMD_STR"
