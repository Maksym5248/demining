#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  echo ".env file not found!"
  exit 1
fi

if firebase --ignore parseBook deploy --project "${PROJECT_NAME}" --region="${REGION}" --only functions; then
  echo "Cloud Function successfully deployed. Exiting..."
  exit 0
else
  echo "Error: Cloud Function deployment failed. Exiting..."
  exit 1
fi
