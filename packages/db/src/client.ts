import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

let doc: DynamoDBDocumentClient | null = null

export function getTableName(): string {
  const table = process.env.DDB_TABLE
  if (!table) throw new Error('DDB_TABLE is required')
  return table
}

export function getDoc(): DynamoDBDocumentClient {
  if (!doc) {
    const region = process.env.AWS_REGION ?? 'ap-south-1'
    const endpoint = process.env.DDB_ENDPOINT || undefined
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const client = new DynamoDBClient({
      region,
      ...(endpoint ? { endpoint } : {}),
      // Admin/user keys in .env (skip EC2 instance role). Local DynamoDB also uses these.
      ...(accessKeyId && secretAccessKey
        ? { credentials: { accessKeyId, secretAccessKey } }
        : endpoint
          ? {
              credentials: {
                accessKeyId: accessKeyId ?? 'local',
                secretAccessKey: secretAccessKey ?? 'local',
              },
            }
          : {}),
    })
    doc = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    })
  }
  return doc
}

export function resetDocClient(): void {
  doc = null
}
