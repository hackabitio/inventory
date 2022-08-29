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

export const createDb = async (ctx) => {
  await db.read()
  db.data = db.data || { products: [], additions: [], deductions: [] }
  await db.write()
  ctx.body = 'Database created'
  ctx.status = 201
}

export const addProduct = async (ctx) => {
  let product = ctx.request.body.product
  product.id = uuidv4()
  product.additions = []
  product.deductions = []
  let sku = product.sku
  if (sku) {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    generateQr(sku)
  } else {
    sku = product.name.toLowerCase().replace(/\s/g, '-')
  }
  await db.read()
  db.data = db.data || { products: [] }
  const { products } = db.data
  let existingProduct = products.find((p) => p.sku === sku)
  if (existingProduct) {
    ctx.body = {
      msg: 'Product already exists',
      ids: existingProduct.id
    }
    ctx.status = 201
  } else {
    products.push(product)
    await db.write()

    ctx.body = {
      msg: 'Products added',
      ids: product.id
    }
    ctx.status = 201
  }

}

export const addStock = async (ctx) => {
  let product = ctx.request.body.product
  let id = uuidv4()
  let sku = product.sku
  if (typeof sku === 'undefined') {
    ctx.body = 'product SKU is required'
    ctx.status = 201
  } else {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    // Get the product from available stock database stockDb
    await db.read()
    db.data = db.data || { products: [] }
    const { products } = db.data
    let theProduct = products.find((p) => p.sku === sku)

    if (theProduct) {
      if (Array.isArray(theProduct)) {
        theProduct = theProduct[0]
      }
      const newStock = {
        id,
        time: new Date(),
        name: theProduct.name,
        sku: theProduct.sku,
        qty: product.qty,
        orderPrice: product.orderPrice
      }
      db.data = db.data || { additions: [] }
      const { additions } = db.data
      additions.push(newStock)

      let oldQty = theProduct.qty
      let newQty = oldQty + product.qty
      theProduct.qty = newQty
      theProduct.additions.push(id)
      await db.write()

      ctx.body = {
        msg: 'Products updated!',
        newQty,
        id: theProduct.id
      }
      ctx.status = 201
    }

  }
}