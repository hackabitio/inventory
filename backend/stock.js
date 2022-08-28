let jsoning = require("jsoning")
const generateQr = require('./qrcode')
const uuid = require('uuid')

let stockDb = new jsoning("./db/stock.json")
let addingDb = new jsoning("./db/adding.json")
let releasingDb = new jsoning("./db/releasing.json")

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
  stockDb.set(sku, product)

  ctx.body = {
    msg: 'Products added',
    ids: product.id
  }
  ctx.status = 201
}

const stock = (ctx) => {
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
      addingDb.set(id, {
        id,
        time: new Date(),
        name: theProduct.name,
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

const releaseStock = (ctx) => {
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
      releasingDb.push(id, {
        id,
        time: new Date(),
        sku: theProduct.sku,
        qty: product.qty
      })
      let oldQty = theProduct.qty
      if (oldQty >= product.qty) {
        let newQty = oldQty - product.qty
        theProduct.qty = newQty
        stockDb.set(sku, theProduct)

        ctx.body = {
          msg: 'Products updated!',
          newQty,
          id: theProduct.id
        }
        ctx.status = 201
      } else {
        ctx.body = {
          msg: 'You don\'t have sufficient quantity to deduct from.',
          available: oldQty,
          id: theProduct.id
        }
        ctx.status = 201
      }
    }
  }
}

const getAddStock = (ctx) => {
  let products = addingDb.all()
  if (products) {
    ctx.body = products
    ctx.status = 200
  } else {
    ctx.body = {
      msg: 'Sorry, no product found',
    }
    ctx.status = 200
  }

}

const getProducts = (ctx) => {
  let products = stockDb.all()
  if (products) {
    ctx.body = products
    ctx.status = 200
  } else {
    ctx.body = {
      msg: 'Sorry, no product found',
    }
    ctx.status = 200
  }

}

const getProduct = (ctx) => {
  let sku = ctx.query.sku
  if (typeof sku === 'undefined') {
    ctx.body = 'product SKU is required'
    ctx.status = 201
  } else {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    // Get the product from available stock database stockDb
    let product = stockDb.get(sku)
    if (product) {
      if (Array.isArray(product)) {
        product = product[0]
      }
      ctx.body = product
      ctx.status = 200
    } else {
      ctx.body = {
        msg: 'Sorry, no product found',
      }
      ctx.status = 200
    }
  }
}

module.exports = { addProduct, addStock: stock, releaseStock, getProducts, getProduct, getAddStock }