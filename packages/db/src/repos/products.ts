import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'node:crypto'
import { getDoc, getTableName } from '../client.js'
import { keys, assertBizPk } from '../keys.js'
import type { ProductRecord } from '../types.js'

const UNIT_NAMES: Record<string, string> = {
  pcs: 'Piece',
  kg: 'Kilogram',
  g: 'Gram',
  l: 'Litre',
  ml: 'Millilitre',
  box: 'Box',
  pkt: 'Packet',
  dz: 'Dozen',
}

export async function listProducts(businessId: string, q?: string): Promise<ProductRecord[]> {
  const pk = keys.bizPk(businessId)
  assertBizPk(pk)
  const result = await getDoc().send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: { ':pk': pk, ':sk': 'ITEM#' },
    }),
  )
  let items = ((result.Items ?? []) as ProductRecord[]).filter((p) => !p.deletedAt && p.active)
  if (q?.trim()) {
    const needle = q.trim().toLowerCase()
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        (p.sku ?? '').toLowerCase().includes(needle) ||
        (p.barcode ?? '').toLowerCase().includes(needle),
    )
  }
  return items.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 200)
}

export async function getProduct(businessId: string, productId: string): Promise<ProductRecord | null> {
  const result = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.itemSk(productId) },
    }),
  )
  const item = result.Item as ProductRecord | undefined
  if (!item || item.deletedAt) return null
  return item
}

export async function createProduct(
  businessId: string,
  input: {
    name: string
    kind?: string
    salePricePaise: number
    mrpPaise?: number | null
    purchasePricePaise?: number
    sku?: string | null
    hsnSac?: string | null
    barcode?: string | null
    unitKey?: string
    trackStock?: boolean
  },
): Promise<ProductRecord> {
  const id = randomUUID()
  const now = new Date().toISOString()
  const unitKey = input.unitKey ?? 'pcs'
  const barcode = input.barcode?.trim() || null
  if (barcode) {
    const clash = await findByBarcode(businessId, barcode)
    if (clash) throw new Error('BARCODE_CONFLICT')
  }

  const product: ProductRecord = {
    pk: keys.bizPk(businessId),
    sk: keys.itemSk(id),
    entityType: 'product',
    id,
    businessId,
    kind: input.kind ?? 'product',
    name: input.name.trim(),
    sku: input.sku?.trim() || null,
    hsnSac: input.hsnSac?.trim() || null,
    salePricePaise: input.salePricePaise,
    mrpPaise: input.mrpPaise ?? null,
    purchasePricePaise: input.purchasePricePaise ?? 0,
    trackStock: input.trackStock ?? true,
    active: true,
    unitKey,
    unitName: UNIT_NAMES[unitKey] ?? unitKey,
    barcode,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    gsi3pk: keys.gsi3EntityPk(businessId, 'ITEM'),
    gsi3sk: now,
  }

  const table = getTableName()
  await getDoc().send(new PutCommand({ TableName: table, Item: product }))
  if (barcode) {
    await getDoc().send(
      new PutCommand({
        TableName: table,
        Item: {
          pk: keys.bizPk(businessId),
          sk: keys.barcodeSk(barcode),
          entityType: 'barcode',
          productId: id,
          barcode,
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      }),
    )
  }
  return product
}

export async function updateProduct(
  businessId: string,
  productId: string,
  input: Partial<{
    name: string
    salePricePaise: number
    mrpPaise: number | null
    purchasePricePaise: number
    sku: string | null
    hsnSac: string | null
    barcode: string | null
    active: boolean
    trackStock: boolean
  }>,
): Promise<ProductRecord | null> {
  const existing = await getProduct(businessId, productId)
  if (!existing) return null

  if (input.barcode !== undefined) {
    const next = input.barcode?.trim() || null
    if (existing.barcode && existing.barcode !== next) {
      await getDoc().send(
        new DeleteCommand({
          TableName: getTableName(),
          Key: { pk: keys.bizPk(businessId), sk: keys.barcodeSk(existing.barcode) },
        }),
      ).catch(() => undefined)
    }
    if (next && next !== existing.barcode) {
      const clash = await findByBarcode(businessId, next)
      if (clash && clash.id !== productId) throw new Error('BARCODE_CONFLICT')
      await getDoc().send(
        new PutCommand({
          TableName: getTableName(),
          Item: {
            pk: keys.bizPk(businessId),
            sk: keys.barcodeSk(next),
            entityType: 'barcode',
            productId,
            barcode: next,
          },
        }),
      )
    }
  }

  const updated: ProductRecord = {
    ...existing,
    name: input.name?.trim() ?? existing.name,
    salePricePaise: input.salePricePaise ?? existing.salePricePaise,
    mrpPaise: input.mrpPaise !== undefined ? input.mrpPaise : existing.mrpPaise,
    purchasePricePaise: input.purchasePricePaise ?? existing.purchasePricePaise,
    sku: input.sku !== undefined ? input.sku?.trim() || null : existing.sku,
    hsnSac: input.hsnSac !== undefined ? input.hsnSac?.trim() || null : existing.hsnSac,
    barcode: input.barcode !== undefined ? input.barcode?.trim() || null : existing.barcode,
    active: input.active ?? existing.active,
    trackStock: input.trackStock ?? existing.trackStock,
    updatedAt: new Date().toISOString(),
  }

  await getDoc().send(new PutCommand({ TableName: getTableName(), Item: updated }))
  return updated
}

export async function softDeleteProduct(businessId: string, productId: string): Promise<boolean> {
  const existing = await getProduct(businessId, productId)
  if (!existing) return false
  if (existing.barcode) {
    await getDoc().send(
      new DeleteCommand({
        TableName: getTableName(),
        Key: { pk: keys.bizPk(businessId), sk: keys.barcodeSk(existing.barcode) },
      }),
    ).catch(() => undefined)
  }
  await getDoc().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.itemSk(productId) },
      UpdateExpression: 'SET deletedAt = :d, active = :f, updatedAt = :u',
      ExpressionAttributeValues: {
        ':d': new Date().toISOString(),
        ':f': false,
        ':u': new Date().toISOString(),
      },
    }),
  )
  return true
}

export async function findByBarcode(
  businessId: string,
  barcode: string,
): Promise<ProductRecord | null> {
  const lookup = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.barcodeSk(barcode) },
    }),
  )
  const productId = (lookup.Item as { productId?: string } | undefined)?.productId
  if (!productId) return null
  return getProduct(businessId, productId)
}

export async function getBarcodeCache(barcode: string) {
  const result = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.barcodeCachePk(barcode), sk: keys.barcodeCacheSk() },
    }),
  )
  return result.Item as
    | { payload: Record<string, unknown>; expiresAt: string; source: string }
    | undefined
}

export async function putBarcodeCache(
  barcode: string,
  payload: Record<string, unknown>,
  source: string,
  expiresAt: Date,
): Promise<void> {
  await getDoc().send(
    new PutCommand({
      TableName: getTableName(),
      Item: {
        pk: keys.barcodeCachePk(barcode),
        sk: keys.barcodeCacheSk(),
        entityType: 'barcode_cache',
        barcode,
        payload,
        source,
        fetchedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    }),
  )
}

export function unitExists(unitKey: string): boolean {
  return Boolean(UNIT_NAMES[unitKey])
}
