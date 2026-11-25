#!/usr/bin/env bash
set -euo pipefail

# Requires: aws CLI configured, DUCKDNS_TOKEN optional for DNS update.
REGION="${AWS_REGION:-ap-south-1}"
TABLE="${DDB_TABLE:-billnote}"
DOMAIN="${DUCKDNS_DOMAIN:-notebill}"
KEY_NAME="${AWS_KEY_NAME:-billnote-key}"
INSTANCE_TYPE="${AWS_INSTANCE_TYPE:-t3.small}"

echo "Ensuring DynamoDB table..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
bash "$SCRIPT_DIR/create-dynamodb-table.sh"

AMI=$(aws ec2 describe-images \
  --region "$REGION" \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*" "Name=state,Values=available" \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' \
  --output text)

echo "Launching EC2 $INSTANCE_TYPE with AMI $AMI..."
INSTANCE_ID=$(aws ec2 run-instances \
  --region "$REGION" \
  --image-id "$AMI" \
  --instance-type "$INSTANCE_TYPE" \
  --key-name "$KEY_NAME" \
  --iam-instance-profile Name="${AWS_INSTANCE_PROFILE:-billnote-ec2}" \
  --security-group-ids "${AWS_SG_ID:?set AWS_SG_ID with 22/80/443 open}" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=billnote}]" \
  --query 'Instances[0].InstanceId' \
  --output text)

aws ec2 wait instance-running --region "$REGION" --instance-ids "$INSTANCE_ID"
ALLOC=$(aws ec2 allocate-address --region "$REGION" --domain vpc --query 'AllocationId' --output text)
aws ec2 associate-address --region "$REGION" --instance-id "$INSTANCE_ID" --allocation-id "$ALLOC"
PUBLIC_IP=$(aws ec2 describe-addresses --region "$REGION" --allocation-ids "$ALLOC" --query 'Addresses[0].PublicIp' --output text)

if [[ -n "${DUCKDNS_TOKEN:-}" ]]; then
  curl -fsS "https://www.duckdns.org/update?domains=${DOMAIN}&token=${DUCKDNS_TOKEN}&ip=${PUBLIC_IP}"
  echo
fi

echo "INSTANCE_ID=$INSTANCE_ID"
echo "PUBLIC_IP=$PUBLIC_IP"
echo "DNS=${DOMAIN}.duckdns.org"
echo "Next: SSH, clone repo, run deploy/ec2-setup.sh, docker compose up"
