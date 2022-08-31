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
  db.data = db.data || { categories: [], products: [], additions: [], deductions: [] }
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

export const addCategory = async (ctx) => {
  let category = ctx.request.body.category
  console.log(category)
  category.id = uuidv4()
  await db.read()
  db.data = db.data || { categories: [] }
  const { categories } = db.data
  let existingCategories = categories.find(c => c.name === category.name)
  if (existingCategories) {
    ctx.body = 'Category already exists'
    ctx.status = 200
  } else {
    categories.push(category)
    await db.write()
    ctx.body = {
      msg: 'Category added',
      ids: category.id
    }
    ctx.status = 200
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
        qty: parseInt(product.qty),
        orderPrice: product.orderPrice
      }
      db.data = db.data || { additions: [] }
      const { additions } = db.data
      additions.push(newStock)

      let oldQty = parseInt(theProduct.qty)
      let newQty = oldQty + parseInt(product.qty)
      theProduct.qty = parseInt(newQty)
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

export const deleteAddition = async (ctx) => {
  let id = ctx.query.id
  if (!id) {
    ctx.body = 'The ID is required'
    ctx.status = 200
  }
  // Get the product from available stock database stockDb
  await db.read()

  let theAddition = db.data.additions.filter(addition => addition.id === id)
  db.data.additions = db.data.additions.filter(addition => addition.id !== id)
  if (theAddition.length) {
    let theProduct = db.data.products.filter(product => theAddition[0].sku === product.sku)
    if (theProduct) {
      theProduct = Array.isArray(theProduct) ? theProduct[0] : theProduct
      theProduct.additions = theProduct.additions.filter(addition => addition !== id)
    }
    await db.write()

    ctx.body = {
      msg: 'Products updated!',
      id: id
    }
    ctx.status = 201
  } else {
    ctx.body = 'Nothing found'
    ctx.status = 201
  }

}

export const deleteDeduction = async (ctx) => {
  let id = ctx.query.id
  if (!id) {
    ctx.body = 'The ID is required'
    ctx.status = 200
  }
  // Get the product from available stock database stockDb
  await db.read()

  let theDeduction = db.data.deductions.filter(deduction => deduction.id === id)
  db.data.deductions = db.data.deductions.filter(deduction => deduction.id !== id)
  if (theDeduction.length) {
    let theProduct = db.data.products.filter(product => theDeduction[0].sku === product.sku)
    if (theProduct) {
      theProduct = Array.isArray(theProduct) ? theProduct[0] : theProduct
      theProduct.deductions = theProduct.deductions.filter(deduction => deduction !== id)
    }
    await db.write()

    ctx.body = {
      msg: 'Products updated!',
      id: id
    }
    ctx.status = 201
  } else {
    ctx.body = 'Nothing found'
    ctx.status = 201
  }

}


export const deductStock = async (ctx) => {
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
      const releasing = {
        id,
        time: new Date(),
        sku: theProduct.sku,
        name: theProduct.name,
        qty: parseInt(product.qty),
        sellPrice: parseInt(product.sellPrice),
      }

      let oldQty = parseInt(theProduct.qty)
      if (oldQty >= product.qty) {
        let newQty = oldQty - parseInt(product.qty)
        theProduct.qty = parseInt(newQty)
        theProduct.deductions.push(id)

        db.data = db.data || { deductions: [] }
        const { deductions } = db.data
        deductions.push(releasing)
        await db.write()

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
    } else {
      ctx.body = 'Product not found'
      ctx.status = 201
    }
  }
}

export const getAdditions = async (ctx) => {
  await db.read()
  db.data = db.data || { additions: [] }
  const { additions } = db.data

  if (additions) {
    ctx.body = additions
    ctx.status = 200
  } else {
    ctx.body = {
      msg: 'Sorry, no product found',
    }
    ctx.status = 200
  }
}

export const getDeductions = async (ctx) => {
  await db.read()
  db.data = db.data || { deductions: [] }
  const { deductions } = db.data

  if (deductions) {
    ctx.body = deductions
    ctx.status = 200
  } else {
    ctx.body = {
      msg: 'Sorry, no product found',
    }
    ctx.status = 200
  }
}

export const getProducts = async (ctx) => {
  let withDetails = ctx.query.details
  await db.read()
  db.data = db.data || { products: [] }
  const { products } = db.data

  if (products) {
    if (withDetails) {
      products.forEach(product => {
        if(product.additions.length) {
          const { additions } = db.data
          product.additions = additions.filter(addition => product.additions.includes(addition.id))
        }
        if(product.deductions.length) {
          const { deductions } = db.data
          product.deductions = deductions.filter(deduction => product.deductions.includes(deduction.id))
        }
      })
    }
    ctx.body = products
    ctx.status = 200
  } else {
    ctx.body = {
      msg: 'Sorry, no product found',
    }
    ctx.status = 200
  }

}

export const getProduct = async (ctx) => {
  let sku = ctx.query.sku
  let withDetails = ctx.query.details
  if (typeof sku === 'undefined') {
    ctx.body = 'product SKU is required'
    ctx.status = 201
  } else {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    // Get the product from available stock database stockDb
    await db.read()
    db.data = db.data || { products: [] }
    const { products } = db.data
    let product = products.find((p) => p.sku === sku)

    if (product) {
      if (Array.isArray(product)) {
        product = product[0]
      }
      if (withDetails) {
        if(product.additions.length) {
          const { additions } = db.data
          product.additions = additions.filter(addition => product.additions.includes(addition.id))
        }
        if(product.deductions.length) {
          const { deductions } = db.data
          product.deductions = deductions.filter(deduction => product.deductions.includes(deduction.id))
        }
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

export const getCategories = async (ctx) => {
  await db.read()
  db.data = db.data || { categories: [] }
  const { categories } = db.data

  if (categories) {
    ctx.body = categories
    ctx.status = 200
  } else {
    ctx.body = {
      msg: 'Sorry, no category found',
    }
    ctx.status = 200
  }

}