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
DOCKER_REPOSITORY="projects/${PROJECT_NAME}/locations/${REGION}/repositories/${ARTIFACT_REGISTRY_REPO}" # Correct repository format
IMAGE_PATH="${DOCKER_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG}" # Full image path

# Ensure the isolate directory exists
if [ ! -d "./isolate" ]; then
  echo "Error: isolate directory not found. Ensure yarn isolate is run successfully."
  exit 1
fi

# Change to the isolate directory
cd ./isolate

# Deploy parseBook Cloud Function (Container)
echo "Deploying parseBook Cloud Function (Container)"

gcloud functions deploy parseBook \
  --runtime=nodejs22 \
  --gen2 \
  --docker-repository="${DOCKER_REPOSITORY}" \
  --region="${REGION}" \
  --trigger-http \
  --timeout=600s \
  --memory=1Gi  \
  --allow-unauthenticated

echo "Cloud Function successfully deployed. Exiting..."
exit 0

