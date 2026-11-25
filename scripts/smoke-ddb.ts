import dynalite from 'dynalite'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { randomUUID } from 'node:crypto'

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  loadEnv({ path: path.join(root, '.env') })

  process.env.AWS_REGION ||= 'ap-south-1'
  process.env.DDB_TABLE ||= 'billnote'
  process.env.DDB_ENDPOINT = 'http://127.0.0.1:8000'
  process.env.AWS_ACCESS_KEY_ID ||= 'local'
  process.env.AWS_SECRET_ACCESS_KEY ||= 'local'

  const server = dynalite({ createTableMs: 0 })
  await new Promise<void>((resolve, reject) => {
    server.listen(8000, (err?: Error) => (err ? reject(err) : resolve()))
  })
  console.log('dynalite listening on :8000')

  await run(root, 'pnpm', ['--filter', '@billnote/db', 'ddb:ensure-table'])

  const { resetDocClient, users, businesses, sessions, products, bills } = await import(
    '../packages/db/src/index.ts'
  )
  resetDocClient()

  const email = `smoke_${Date.now()}@billnote.test`
  const user = await users.createUser({
    fullName: 'Smoke Tester',
    email,
    passwordHash: 'x',
  })
  const found = await users.findUserByIdentifier(email)
  if (!found || found.id !== user.id) throw new Error('user lookup failed')

  const { business } = await businesses.createBusinessWithOwner({
    userId: user.id,
    legalName: 'Smoke Shop Pvt Ltd',
    displayName: 'Smoke Shop',
    categoryKey: 'grocery',
  })
  if (business.status !== 'ready') throw new Error('business not ready')

  const product = await products.createProduct(business.id, {
    name: 'Test Atta 1kg',
    salePricePaise: 5500,
    unitKey: 'pcs',
    barcode: `890${Date.now().toString().slice(-10)}`,
  })

  const bill = await bills.createBill(business.id, {
    docType: 'tax_invoice',
    lines: [
      {
        productId: product.id,
        name: product.name,
        qty: 2,
        unitKey: product.unitKey,
        ratePaise: product.salePricePaise,
        lineTotalPaise: product.salePricePaise * 2,
      },
    ],
    paidPaise: product.salePricePaise * 2,
  })

  const session = await sessions.createSession({
    userId: user.id,
    refreshTokenHash: `hash_${Date.now()}`,
    familyId: randomUUID(),
    expiresAt: new Date(Date.now() + 86_400_000),
  })
  const again = await sessions.findSessionByRefreshHash(session.refreshTokenHash)
  if (!again) throw new Error('session lookup failed')

  console.log(
    JSON.stringify({
      ok: true,
      userId: user.id,
      businessId: business.id,
      productId: product.id,
      billId: bill.id,
      billNumber: bill.number,
    }),
  )

  server.close()
}

function run(cwd: string, cmd: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    )
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
