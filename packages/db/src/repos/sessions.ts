import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'node:crypto'
import { getDoc, getTableName } from '../client.js'
import { keys } from '../keys.js'
import type { SessionRecord } from '../types.js'

export async function createSession(input: {
  id?: string
  userId: string
  refreshTokenHash: string
  familyId: string
  expiresAt: Date
  userAgent?: string
  ip?: string
  platform?: string
}): Promise<SessionRecord> {
  const id = input.id ?? randomUUID()
  const now = new Date().toISOString()
  const session: SessionRecord = {
    pk: keys.userPk(input.userId),
    sk: keys.sessionSk(id),
    entityType: 'session',
    id,
    userId: input.userId,
    refreshTokenHash: input.refreshTokenHash,
    familyId: input.familyId,
    replacedBySessionId: null,
    expiresAt: input.expiresAt.toISOString(),
    revokedAt: null,
    revokeReason: null,
    userAgent: input.userAgent ?? null,
    ip: input.ip ?? null,
    platform: input.platform ?? null,
    createdAt: now,
    lastUsedAt: now,
  }

  const table = getTableName()
  await getDoc().send(new PutCommand({ TableName: table, Item: session }))
  await getDoc().send(
    new PutCommand({
      TableName: table,
      Item: {
        pk: keys.refreshLookupPk(input.refreshTokenHash),
        sk: keys.refreshLookupSk(),
        entityType: 'refresh_lookup',
        userId: input.userId,
        sessionId: id,
      },
    }),
  )
  return session
}

export async function findSessionByRefreshHash(hash: string): Promise<SessionRecord | null> {
  const lookup = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.refreshLookupPk(hash), sk: keys.refreshLookupSk() },
    }),
  )
  const item = lookup.Item as { userId?: string; sessionId?: string } | undefined
  if (!item?.userId || !item.sessionId) return null
  const session = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.userPk(item.userId), sk: keys.sessionSk(item.sessionId) },
    }),
  )
  return (session.Item as SessionRecord | undefined) ?? null
}

export async function revokeSession(
  session: SessionRecord,
  reason: string,
  replacedBySessionId?: string,
): Promise<void> {
  await getDoc().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: session.pk, sk: session.sk },
      UpdateExpression:
        'SET revokedAt = :r, revokeReason = :reason, replacedBySessionId = :rep',
      ExpressionAttributeValues: {
        ':r': new Date().toISOString(),
        ':reason': reason,
        ':rep': replacedBySessionId ?? null,
      },
    }),
  )
}

export async function revokeFamily(userId: string, familyId: string, reason: string): Promise<void> {
  const result = await getDoc().send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': keys.userPk(userId),
        ':sk': 'SESSION#',
      },
    }),
  )
  const now = new Date().toISOString()
  for (const item of (result.Items ?? []) as SessionRecord[]) {
    if (item.familyId !== familyId || item.revokedAt) continue
    await getDoc().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: { pk: item.pk, sk: item.sk },
        UpdateExpression: 'SET revokedAt = :r, revokeReason = :reason',
        ExpressionAttributeValues: { ':r': now, ':reason': reason },
      }),
    )
  }
}

export async function revokeSessionById(userId: string, sessionId: string, reason: string): Promise<void> {
  await getDoc().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: keys.userPk(userId), sk: keys.sessionSk(sessionId) },
      UpdateExpression: 'SET revokedAt = :r, revokeReason = :reason',
      ConditionExpression: 'attribute_exists(pk) AND attribute_not_exists(revokedAt)',
      ExpressionAttributeValues: {
        ':r': new Date().toISOString(),
        ':reason': reason,
      },
    }),
  ).catch(() => undefined)
}
