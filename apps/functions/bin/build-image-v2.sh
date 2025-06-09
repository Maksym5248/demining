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
IMAGE_NAME="parsebook-container"
IMAGE_TAG="local-$(date +%Y%m%d%H%M%S)"
IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_NAME}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"

# Ensure the isolate directory exists
if [ ! -d "./isolate" ]; then
  echo "Error: isolate directory not found. Ensure yarn isolate is run successfully."
  exit 1
fi

# Copy Dockerfile into the isolate directory
cp ./Dockerfile ./isolate/

# Change to the isolate directory
cd ./isolate

# Build and push Docker image
echo "Building and pushing container image for parseBook to: ${IMAGE_PATH}"

# Use a custom logs bucket to avoid streaming issues
gcloud builds submit . --tag "${IMAGE_PATH}"

echo "Artifact successfully deployed. Exiting..."
exit 0

  
# TODO:
#  - avoid publish image every push just do it when Dockerfile changes
#  - remove artifacts what are not using anymore
#  - autoremove old artifacts

