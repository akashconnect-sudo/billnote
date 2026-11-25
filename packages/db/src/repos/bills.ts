import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'node:crypto'
import { getDoc, getTableName } from '../client.js'
import { keys, assertBizPk } from '../keys.js'
import type { BillLineRecord, BillRecord } from '../types.js'
import { allocateDocNumber } from './businesses.js'

export async function createBill(
  businessId: string,
  input: {
    docType: 'tax_invoice' | 'bill_of_supply'
    partyName?: string | null
    lines: Array<{
      productId?: string | null
      name: string
      qty: number
      unitKey: string
      ratePaise: number
      lineTotalPaise: number
    }>
    paidPaise?: number
  },
): Promise<BillRecord> {
  const pk = keys.bizPk(businessId)
  assertBizPk(pk)
  const id = randomUUID()
  const now = new Date().toISOString()
  const { number } = await allocateDocNumber(businessId, input.docType)
  const totalPaise = input.lines.reduce((sum, line) => sum + line.lineTotalPaise, 0)
  const paidPaise = input.paidPaise ?? 0
  const bill: BillRecord = {
    pk,
    sk: keys.billSk(id),
    entityType: 'bill',
    id,
    businessId,
    docType: input.docType,
    number,
    status: 'confirmed',
    partyName: input.partyName ?? null,
    totalPaise,
    paidPaise,
    balancePaise: totalPaise - paidPaise,
    createdAt: now,
    updatedAt: now,
    gsi3pk: keys.gsi3EntityPk(businessId, 'BILL'),
    gsi3sk: now,
  }

  const lineItems = input.lines.map((line, index) => {
    const record: BillLineRecord = {
      pk,
      sk: keys.billLineSk(id, index + 1),
      entityType: 'bill_line',
      billId: id,
      businessId,
      lineNo: index + 1,
      productId: line.productId ?? null,
      name: line.name,
      qty: line.qty,
      unitKey: line.unitKey,
      ratePaise: line.ratePaise,
      lineTotalPaise: line.lineTotalPaise,
    }
    return record
  })

  const table = getTableName()
  await getDoc().send(new PutCommand({ TableName: table, Item: bill }))
  for (const item of lineItems) {
    await getDoc().send(new PutCommand({ TableName: table, Item: item }))
  }

  return bill
}

export async function getBill(
  businessId: string,
  billId: string,
): Promise<{ bill: BillRecord; lines: BillLineRecord[] } | null> {
  const billResult = await getDoc().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { pk: keys.bizPk(businessId), sk: keys.billSk(billId) },
    }),
  )
  const bill = billResult.Item as BillRecord | undefined
  if (!bill) return null
  const linesResult = await getDoc().send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': keys.bizPk(businessId),
        ':sk': `BILL#${billId}#LINE#`,
      },
    }),
  )
  const lines = ((linesResult.Items ?? []) as BillLineRecord[]).sort(
    (a, b) => a.lineNo - b.lineNo,
  )
  return { bill, lines }
}

export async function listRecentBills(businessId: string, limit = 10): Promise<BillRecord[]> {
  const result = await getDoc().send(
    new QueryCommand({
      TableName: getTableName(),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': keys.bizPk(businessId),
        ':sk': 'BILL#',
      },
    }),
  )
  return ((result.Items ?? []) as BillRecord[])
    .filter((item) => item.entityType === 'bill')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}

export async function dashboardStats(businessId: string) {
  const bills = await listRecentBills(businessId, 200)
  const today = new Date().toISOString().slice(0, 10)
  const todayBills = bills.filter((b) => b.createdAt.startsWith(today))
  const salesTotal = todayBills.reduce((s, b) => s + b.totalPaise, 0)
  const moneyIn = todayBills.reduce((s, b) => s + b.paidPaise, 0)
  const receivable = bills.reduce((s, b) => s + Math.max(0, b.balancePaise), 0)
  return {
    salesTotalPaise: String(salesTotal),
    salesCount: String(todayBills.length),
    moneyInPaise: String(moneyIn),
    receivablePaise: String(receivable),
    lowStockCount: '0',
    recent: bills.slice(0, 8).map((b) => ({
      id: b.id,
      number: b.number,
      totalPaise: String(b.totalPaise),
      status: b.status,
      createdAt: b.createdAt,
      partyName: b.partyName,
    })),
  }
}
