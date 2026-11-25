import { PutCommand, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'node:crypto'
import { getDoc, getTableName } from '../client.js'
import { keys } from '../keys.js'
import type { UserRecord } from '../types.js'

export async function createUser(input: {
  fullName: string
  email?: string | null
  phoneE164?: string | null
  passwordHash: string
}): Promise<UserRecord> {
  const id = randomUUID()
  const now = new Date().toISOString()
  const email = input.email?.toLowerCase() ?? null
  const phoneE164 = input.phoneE164 ?? null
  const user: UserRecord = {
    pk: keys.userPk(id),
    sk: keys.userProfileSk(),
    entityType: 'user',
    id,
    fullName: input.fullName,
    email,
    phoneE164,
    passwordHash: input.passwordHash,
    locale: 'en',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }

  const doc = getDoc()
  const table = getTableName()
  try {
    if (email) {
      const existing = await doc.send(
        new GetCommand({
          TableName: table,
          Key: { pk: keys.emailLookupPk(email), sk: keys.lookupSk() },
        }),
      )
      if (existing.Item) throw new Error('CONFLICT')
    }
    if (phoneE164) {
      const existing = await doc.send(
        new GetCommand({
          TableName: table,
          Key: { pk: keys.phoneLookupPk(phoneE164), sk: keys.lookupSk() },
        }),
      )
      if (existing.Item) throw new Error('CONFLICT')
    }

    await doc.send(
      new PutCommand({
        TableName: table,
        Item: user,
        ConditionExpression: 'attribute_not_exists(pk)',
      }),
    )
    if (email) {
      await doc.send(
        new PutCommand({
          TableName: table,
          Item: {
            pk: keys.emailLookupPk(email),
            sk: keys.lookupSk(),
            entityType: 'lookup',
            userId: id,
          },
          ConditionExpression: 'attribute_not_exists(pk)',
        }),
      )
    }
    if (phoneE164) {
      await doc.send(
        new PutCommand({
          TableName: table,
          Item: {
            pk: keys.phoneLookupPk(phoneE164),
            sk: keys.lookupSk(),
            entityType: 'lookup',
            userId: id,
          },
          ConditionExpression: 'attribute_not_exists(pk)',
        }),
      )
    }
  } catch (error) {
    const name = error instanceof Error ? error.name : ''
    const message = error instanceof Error ? error.message : ''
    if (
      name === 'ConditionalCheckFailedException' ||
      message === 'CONFLICT'
    ) {
      throw new Error('CONFLICT')
    }
    throw error
  }
  return user
}

export async function findUserByIdentifier(identifier: string): Promise<UserRecord | null> {
  const trimmed = identifier.trim()
  const lookupPk = trimmed.includes('@')
    ? keys.emailLookupPk(trimmed)
    : keys.phoneLookupPk(trimmed)
  const lookup = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: lookupPk, sk: keys.lookupSk() },
    }),
  )
  const userId = (lookup.Item as { userId?: string } | undefined)?.userId
  if (!userId) return null
  return getUserById(userId)
}

export async function getUserById(userId: string): Promise<UserRecord | null> {
  const result = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.userPk(userId), sk: keys.userProfileSk() },
    }),
  )
  return (result.Item as UserRecord | undefined) ?? null
}

export async function putLoginEvent(input: {
  userId?: string | null
  identifier: string
  success: boolean
  reason?: string
  ip?: string
  userAgent?: string
}): Promise<void> {
  const id = randomUUID()
  const pk = input.userId ? keys.userPk(input.userId) : `LOGINLOG#${id}`
  await getDoc().send(
    new PutCommand({
      TableName: getTableName(),
      Item: {
        pk,
        sk: keys.loginEventSk(id),
        entityType: 'login_event',
        id,
        userId: input.userId ?? null,
        identifier: input.identifier,
        success: input.success,
        reason: input.reason ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        createdAt: new Date().toISOString(),
      },
    }),
  )
}

export async function pingDynamo(): Promise<boolean> {
  try {
    await getDoc().send(
      new QueryCommand({
        TableName: getTableName(),
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: { ':pk': 'HEALTH#ping' },
        Limit: 1,
      }),
    )
    return true
  } catch {
    // Table missing still means we reached DynamoDB in many local setups; treat Get as stronger.
    try {
      await getDoc().send(
        new GetCommand({
          TableName: getTableName(),
          Key: { pk: 'HEALTH#ping', sk: 'PING' },
        }),
      )
      return true
    } catch {
      return false
    }
  }
}

export async function touchUser(userId: string): Promise<void> {
  await getDoc().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: keys.userPk(userId), sk: keys.userProfileSk() },
      UpdateExpression: 'SET updatedAt = :u',
      ExpressionAttributeValues: { ':u': new Date().toISOString() },
    }),
  )
}
