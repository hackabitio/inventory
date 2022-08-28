let jsoning = require("jsoning")
const generateQr = require('./qrcode')
const uuid = require('uuid')

let stockDb = new jsoning("./db/stock.json")
let addingDb = new jsoning("./db/adding.json")

const addProduct = (ctx) => {
  let product = ctx.request.body.product
  product.id = uuid.v4()
  let sku = product.sku
  if (sku) {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    generateQr(sku)
  } else {
    sku = product.name.toLowerCase().replace(/\s/g, '-')
  }
  stockDb.push(sku, product)

  ctx.body = {
    msg: 'Products added',
    ids: product.id
  }
  ctx.status = 201
}

const addStock = (ctx) => {
  let product = ctx.request.body.product
  let id = uuid.v4()
  let sku = product.sku
  if (typeof sku === 'undefined') {
    ctx.body = 'product SKU is required'
    ctx.status = 201
  } else {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    // Get the product from available stock database stockDb
    let theProduct = stockDb.get(sku)
    if (theProduct) {
      if (Array.isArray(theProduct)) {
        theProduct = theProduct[0]
      }
      addingDb.push(id, {
        id,
        time: new Date(),
        sku: theProduct.sku,
        qty: product.qty
      })
      let oldQty = theProduct.qty
      let newQty = oldQty + product.qty
      theProduct.qty = newQty
      stockDb.set(sku, theProduct)

      ctx.body = {
        msg: 'Products updated!',
        newQty,
        id: theProduct.id
      }
      ctx.status = 201
    }

  }
}

module.exports = { addProduct, addStock }