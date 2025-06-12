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


cp ./Dockerfile ./isolate/
cp ./project.toml ./isolate/
# Copy scripts from the main package.json into the scripts section of isolate/package.json
# Add the `start:v2` script directly to the `scripts` section of isolate/package.json
jq '.scripts += {"start:v2": "functions-framework --target=parseBook"}' ./isolate/package.json > ./isolate/package.json.tmp && mv ./isolate/package.json.tmp ./isolate/package.json
cd ./isolate

gcloud builds submit --tag "${IMAGE_PATH}"

gcloud run deploy parsebook \
  --image="${IMAGE_PATH}" \
  --region="${REGION}" \
  --allow-unauthenticated \
  --memory=1Gi \
  --max-instances=1

# gcloud functions describe parsebook --region=europe-central2 --gen2

