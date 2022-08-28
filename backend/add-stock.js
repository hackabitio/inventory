let jsoning = require("jsoning")
const generateQr = require('./qrcode')
const uuid = require('uuid')

let db = new jsoning("./db/stock.json")

module.exports = (ctx) => {
  let product = ctx.request.body.product
  product.id = uuid.v4()
  let sku = product.sku
  if (sku) {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    generateQr(sku)
  } else {
    sku = product.name.toLowerCase().replace(/\s/g, '-')
  }

  db.push(sku, product)

  ctx.body = {
    msg: 'Products added',
    ids: product.id
  }
  ctx.status = 201
}
