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
  --gen2 \
  --runtime=container \
  --image="${IMAGE_PATH}" \
  --region="${REGION}" \
  --trigger-http \
  --timeout=600s \
  --memory=1Gi

# Print success message
echo "Successfully deployed parseBook Cloud Function (Container)"
