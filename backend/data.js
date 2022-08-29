import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import {generateQr}  from "./qrcode.js"

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'database.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()


export const addProduct = async (ctx) => {
  let product = ctx.request.body.product
  product.id = uuidv4()
  let sku = product.sku
  if (sku) {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    generateQr(sku)
  } else {
    sku = product.name.toLowerCase().replace(/\s/g, '-')
  }
  db.data ||= { products: [] }
  const { products } = db.data
  products.push(product)
  await db.write()

  ctx.body = {
    msg: 'Products added',
    ids: product.id
  }
  ctx.status = 201
}
