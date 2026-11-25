#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
TABLE="${DDB_TABLE:-billnote}"

aws dynamodb create-table \
  --region "$REGION" \
  --table-name "$TABLE" \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=sk,AttributeType=S \
    AttributeName=gsi2pk,AttributeType=S \
    AttributeName=gsi2sk,AttributeType=S \
    AttributeName=gsi3pk,AttributeType=S \
    AttributeName=gsi3sk,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=sk,KeyType=RANGE \
  --global-secondary-indexes \
    '[
      {
        "IndexName": "GSI2",
        "KeySchema": [
          {"AttributeName":"gsi2pk","KeyType":"HASH"},
          {"AttributeName":"gsi2sk","KeyType":"RANGE"}
        ],
        "Projection": {"ProjectionType":"ALL"}
      },
      {
        "IndexName": "GSI3",
        "KeySchema": [
          {"AttributeName":"gsi3pk","KeyType":"HASH"},
          {"AttributeName":"gsi3sk","KeyType":"RANGE"}
        ],
        "Projection": {"ProjectionType":"ALL"}
      }
    ]' \
  || true

aws dynamodb wait table-exists --region "$REGION" --table-name "$TABLE"
echo "Table $TABLE ready in $REGION"
