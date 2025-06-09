#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  echo ".env file not found!"
  exit 1
fi

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# Variables
IMAGE_NAME="parsebook-container" # Name for your specific container image
IMAGE_TAG="local-$(date +%Y%m%d%H%M%S)" # Use timestamp as tag for uniqueness
IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_NAME}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"

# Ensure the isolate directory exists
if [ ! -d "./isolate" ]; then
  echo "Error: isolate directory not found. Ensure yarn isolate is run successfully."
  exit 1
fi

# Change to the isolate directory
cd ./isolate

# Deploy parseBook Cloud Function (Container)
echo "Deploying parseBook Cloud Function (Container)"

if gcloud functions deploy parseBook \
  --gen2 \
  --runtime=container \
  --image="${IMAGE_PATH}" \
  --region="${REGION}" \
  --trigger-http \
  --timeout=600s \
  --memory=1Gi; then
  echo "Cloud Function successfully deployed. Exiting..."
  exit 0
else
  echo "Error: Cloud Function deployment failed. Exiting..."
  exit 1
fi
