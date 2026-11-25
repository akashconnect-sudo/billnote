import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'node:crypto'
import { getDoc, getTableName } from '../client.js'
import { keys } from '../keys.js'
import type { BusinessRecord, MembershipRecord, ShopMetaRecord } from '../types.js'

export function createTenantDatabaseName(businessId: string): string {
  return `ddb_${businessId.replace(/-/g, '').slice(0, 24)}`
}

export async function createBusinessWithOwner(input: {
  userId: string
  legalName: string
  displayName: string
  categoryKey: string
}): Promise<{ business: BusinessRecord; membership: MembershipRecord }> {
  const id = randomUUID()
  const now = new Date().toISOString()
  const membershipId = randomUUID()
  const databaseName = createTenantDatabaseName(id)

  const business: BusinessRecord = {
    pk: keys.bizPk(id),
    sk: keys.bizProfileSk(),
    entityType: 'business',
    id,
    ownerUserId: input.userId,
    legalName: input.legalName,
    displayName: input.displayName,
    categoryKey: input.categoryKey,
    status: 'ready',
    databaseName,
    schemaVersion: 1,
    region: process.env.AWS_REGION ?? 'ap-south-1',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }

  const membership: MembershipRecord = {
    pk: keys.bizPk(id),
    sk: keys.memberSk(input.userId),
    entityType: 'membership',
    id: membershipId,
    userId: input.userId,
    businessId: id,
    status: 'active',
    permVersion: 1,
    isDefault: true,
    roleKey: 'owner',
    createdAt: now,
    updatedAt: now,
    gsi2pk: keys.gsi2UserPk(input.userId),
    gsi2sk: keys.gsi2MemberSk(id),
  }

  const shop = seedShopMeta(id, input.displayName, now)

  const table = getTableName()
  const doc = getDoc()
  await doc.send(new PutCommand({ TableName: table, Item: business }))
  await doc.send(new PutCommand({ TableName: table, Item: membership }))
  await doc.send(new PutCommand({ TableName: table, Item: shop }))
  await doc.send(
    new PutCommand({
      TableName: table,
      Item: {
        pk: keys.bizPk(id),
        sk: keys.subscriptionSk(),
        entityType: 'subscription',
        businessId: id,
        planId: 'free',
        status: 'trialing',
        trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        createdAt: now,
      },
    }),
  )

  // Clear other defaults for this user
  const existing = await listMembershipsForUser(input.userId)
  for (const m of existing) {
    if (m.businessId === id) continue
    if (!m.isDefault) continue
    await getDoc().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: { pk: m.pk, sk: m.sk },
        UpdateExpression: 'SET isDefault = :f, updatedAt = :u',
        ExpressionAttributeValues: { ':f': false, ':u': now },
      }),
    )
  }

  return { business, membership }
}

function seedShopMeta(businessId: string, displayName: string, now: string): ShopMetaRecord {
  const year = new Date().getUTCFullYear()
  const month = new Date().getUTCMonth() + 1
  const startYear = month >= 4 ? year : year - 1
  const yy = (n: number) => String(n).slice(-2)
  return {
    pk: keys.bizPk(businessId),
    sk: keys.shopMetaSk(),
    entityType: 'shop_meta',
    businessId,
    branchId: randomUUID(),
    branchName: 'Main',
    locationId: randomUUID(),
    counterId: randomUUID(),
    fyId: randomUUID(),
    fyLabel: `${yy(startYear)}${yy(startYear + 1)}`,
    nextInvoice: 1,
    nextBos: 1,
  }
}

export async function getBusiness(businessId: string): Promise<BusinessRecord | null> {
  const result = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.bizProfileSk() },
    }),
  )
  return (result.Item as BusinessRecord | undefined) ?? null
}

export async function getMembership(
  businessId: string,
  userId: string,
): Promise<MembershipRecord | null> {
  const result = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.memberSk(userId) },
    }),
  )
  return (result.Item as MembershipRecord | undefined) ?? null
}

export async function listMembershipsForUser(userId: string): Promise<MembershipRecord[]> {
  const result = await getDoc().send(
    new QueryCommand({
      TableName: getTableName(),
      IndexName: 'GSI2',
      KeyConditionExpression: 'gsi2pk = :pk',
      ExpressionAttributeValues: { ':pk': keys.gsi2UserPk(userId) },
    }),
  )
  return ((result.Items ?? []) as MembershipRecord[]).filter((m) => m.status === 'active')
}

export async function getDefaultMembership(userId: string): Promise<MembershipRecord | null> {
  const rows = await listMembershipsForUser(userId)
  return rows.find((m) => m.isDefault) ?? rows[0] ?? null
}

export async function setDefaultMembership(userId: string, businessId: string): Promise<void> {
  const rows = await listMembershipsForUser(userId)
  const now = new Date().toISOString()
  for (const m of rows) {
    const isDefault = m.businessId === businessId
    if (m.isDefault === isDefault) continue
    await getDoc().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: { pk: m.pk, sk: m.sk },
        UpdateExpression: 'SET isDefault = :d, updatedAt = :u',
        ExpressionAttributeValues: { ':d': isDefault, ':u': now },
      }),
    )
  }
}

export async function getShopMeta(businessId: string): Promise<ShopMetaRecord | null> {
  const result = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.shopMetaSk() },
    }),
  )
  return (result.Item as ShopMetaRecord | undefined) ?? null
}

export async function allocateDocNumber(
  businessId: string,
  docType: 'tax_invoice' | 'bill_of_supply',
): Promise<{ number: string; meta: ShopMetaRecord }> {
  const field = docType === 'tax_invoice' ? 'nextInvoice' : 'nextBos'
  const prefix = docType === 'tax_invoice' ? 'INV' : 'BOS'
  const result = await getDoc().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.shopMetaSk() },
      UpdateExpression: `SET ${field} = if_not_exists(${field}, :one) + :one`,
      ExpressionAttributeValues: { ':one': 1 },
      ReturnValues: 'ALL_NEW',
    }),
  )
  const meta = result.Attributes as ShopMetaRecord
  const n = docType === 'tax_invoice' ? meta.nextInvoice - 1 : meta.nextBos - 1
  return { number: `${prefix}-${meta.fyLabel}-${String(n).padStart(4, '0')}`, meta }
}

export async function putIdempotency(input: {
  key: string
  userId: string
  response: unknown
}): Promise<void> {
  await getDoc().send(
    new PutCommand({
      TableName: getTableName(),
      Item: {
        pk: keys.userPk(input.userId),
        sk: keys.idempotencySk(input.key),
        entityType: 'idempotency',
        key: input.key,
        userId: input.userId,
        response: input.response,
        createdAt: new Date().toISOString(),
      },
      ConditionExpression: 'attribute_not_exists(pk)',
    }),
  ).catch(() => undefined)
}

export async function getIdempotency(userId: string, key: string): Promise<unknown | null> {
  const result = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.userPk(userId), sk: keys.idempotencySk(key) },
    }),
  )
  return (result.Item as { response?: unknown } | undefined)?.response ?? null
}

export async function updateBusinessStatus(businessId: string, status: string): Promise<void> {
  await getDoc().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.bizProfileSk() },
      UpdateExpression: 'SET #s = :s, updatedAt = :u',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': status, ':u': new Date().toISOString() },
    }),
  )
}
