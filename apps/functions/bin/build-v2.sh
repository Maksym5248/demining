#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
IMAGE_NAME="parsebook-container" # Name for your specific container image
IMAGE_TAG="local-$(date +%Y%m%d%H%M%S)" # Use timestamp as tag for uniqueness
ARTIFACT_REGISTRY_REPO="gcf-artifacts" # Replace with your Artifact Registry repository name
REGION="europe-central2" # Replace with your desired region
PROJECT_ID="dsns-dev-85963" # Replace with your GCP project ID
IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"

# Ensure the Artifact Registry repository exists
if ! gcloud artifacts repositories describe "${ARTIFACT_REGISTRY_REPO}" --location="${REGION}" --project="${PROJECT_ID}" > /dev/null 2>&1; then
  echo "Artifact Registry repository '${ARTIFACT_REGISTRY_REPO}' does not exist. Creating it..."
  gcloud artifacts repositories create "${ARTIFACT_REGISTRY_REPO}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Repository for parseBook container images"
fi

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
gcloud builds submit . --tag "${IMAGE_PATH}"

# TODO:
#  - avoid publish image every push just do it when Dockerfile changes
#  - remove artifacts what are not using anymore
#  - autoremove old artifacts

