import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceInUseException,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb'

const tableName = process.env.DDB_TABLE ?? 'billnote'
const region = process.env.AWS_REGION ?? 'ap-south-1'
const endpoint = process.env.DDB_ENDPOINT || undefined

const client = new DynamoDBClient({
  region,
  ...(endpoint
    ? {
        endpoint,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'local',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'local',
        },
      }
    : {}),
})

async function main() {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }))
    console.log(`Table ${tableName} already exists`)
    return
  } catch {
    // create
  }

  try {
    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'pk', AttributeType: 'S' },
          { AttributeName: 'sk', AttributeType: 'S' },
          { AttributeName: 'gsi2pk', AttributeType: 'S' },
          { AttributeName: 'gsi2sk', AttributeType: 'S' },
          { AttributeName: 'gsi3pk', AttributeType: 'S' },
          { AttributeName: 'gsi3sk', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'sk', KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'GSI2',
            KeySchema: [
              { AttributeName: 'gsi2pk', KeyType: 'HASH' },
              { AttributeName: 'gsi2sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
          {
            IndexName: 'GSI3',
            KeySchema: [
              { AttributeName: 'gsi3pk', KeyType: 'HASH' },
              { AttributeName: 'gsi3sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      }),
    )
  } catch (error) {
    if (!(error instanceof ResourceInUseException)) throw error
  }

  await waitUntilTableExists({ client, maxWaitTime: 120 }, { TableName: tableName })
  console.log(`Table ${tableName} ready`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
