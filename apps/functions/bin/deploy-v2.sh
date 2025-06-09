#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
IMAGE_NAME="parsebook-container" # Name for your specific container image
IMAGE_TAG="local-$(date +%Y%m%d%H%M%S)" # Use timestamp as tag for uniqueness
ARTIFACT_REGISTRY_REPO="gcf-artifacts" # Replace with your Artifact Registry repository name
IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"

# Deploy parseBook Cloud Function (Container)
echo "Deploying parseBook Cloud Function (Container)"
gcloud functions deploy parseBook \
  --gen2 \
  --runtime=container \
  --image="${IMAGE_PATH}" \
  --region="eur3" \
  --trigger-http \
  --timeout=600s \
  --memory=1Gi \
  --set-env-vars "KEY1=VALUE1,KEY2=VALUE2" # Add environment variables if needed

# Print success message
echo "Successfully deployed parseBook Cloud Function (Container)"
