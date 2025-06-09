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

# Build and push Docker image
echo "Building and pushing container image for parseBook to: ${IMAGE_PATH}"
gcloud builds submit . --tag "${IMAGE_PATH}"  --no-source
