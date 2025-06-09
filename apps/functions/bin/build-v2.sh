#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
IMAGE_NAME="parsebook-container" # Name for your specific container image
IMAGE_TAG="local-$(date +%Y%m%d%H%M%S)" # Use timestamp as tag for uniqueness
ARTIFACT_REGISTRY_REPO="gcf-artifacts" # Replace with your Artifact Registry repository name
REGION="us-central1" # Replace with your desired region
PROJECT_ID="dsns-dev-85963" # Replace with your GCP project ID
IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"

# Set working directory to the location of the Dockerfile
cd ./apps/functions

# Build and push Docker image
echo "Building and pushing container image for parseBook to: ${IMAGE_PATH}"
gcloud builds submit . --tag "${IMAGE_PATH}"
