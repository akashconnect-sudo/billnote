import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../apps/web/public/icons')
mkdirSync(outDir, { recursive: true })

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i]
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1
    }
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type)
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function png(size, rgb) {
  const [r, g, b] = rgb
  const row = Buffer.alloc(1 + size * 3)
  const rows = []
  for (let y = 0; y < size; y += 1) {
    const line = Buffer.from(row)
    line[0] = 0
    for (let x = 0; x < size; x += 1) {
      const i = 1 + x * 3
      const edge = x < 8 || y < 8 || x >= size - 8 || y >= size - 8
      line[i] = edge ? 0x0b : r
      line[i + 1] = edge ? 0x6e : g
      line[i + 2] = edge ? 0x4f : b
    }
    rows.push(line)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const idat = deflateSync(Buffer.concat(rows))
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

writeFileSync(join(outDir, 'icon-192.png'), png(192, [0x0b, 0x6e, 0x4f]))
writeFileSync(join(outDir, 'icon-512.png'), png(512, [0x0b, 0x6e, 0x4f]))
console.log('Wrote BILLNOTE placeholder icons')
