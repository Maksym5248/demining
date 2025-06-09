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

# Deploy all functions
firebase deploy --project "${PROJECT_NAME}" --region "${REGION}" --only functions:onMemberUpdate,functions:onUserAccessUpdate,functions:onUserCreate,functions:translateOnWrite,functions:onUserDelete,functions:onCommentReplyWrite

echo "Cloud Function successfully deployed. Exiting..."
exit 0
