import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { generateQr }  from '$lib/qrcode'

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'database.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()

export const createDb = async () => {
  await db.read()
  db.data = db.data || { categories: [], products: [], additions: [], deductions: [] }
  await db.write()
  return 'Database created'
}

export const getProducts = async (withDetails = false) => {
  await db.read()
  if (db.data === null) {
    await createDb()
  }
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
    return products
  } else {
    return []
  }
}


export const addProduct = async (product) => {
  await db.read()
  db.data = db.data || { products: [] }
  const { products } = db.data
  let updateIt = (product.productId && product.editOrNew)
  product.id = updateIt ? product.productId : crypto.randomUUID()

  delete product.productId
  delete product.editOrNew

  if (updateIt) {
    let existingProduct = products.find((p) => p.id === product.id)
    existingProduct.details = product.details
    existingProduct.category = product.category
    existingProduct.name = product.name
    existingProduct.sku = product.sku.toLowerCase()
    existingProduct.qty = parseInt(product.qty)
    existingProduct.orderPrice = parseFloat(product.orderPrice)
    existingProduct.id = product.id
    await db.write()

    return product.id
  } else {
    product.additions = []
    product.deductions = []
    let sku = product.sku
    if (sku) {
      sku = sku.toLowerCase().replace(/\s/g, '-')
      generateQr(sku)
    } else {
      sku = product.name.toLowerCase().replace(/\s/g, '-')
    }

    let existingProduct = products.find((p) => p.sku === sku)
    if (existingProduct) {
      return existingProduct.id
    } else {
      product.qty = parseInt(product.qty)
      product.orderPrice = (parseInt(product.orderPrice) / product.qty).toFixed(4)
      product.sku = product.sku.toLowerCase()
      products.push(product)
      await db.write()

      return product.id
    }
  }
  return null
}

export const getCategories = async () => {
  await db.read()
  db.data = db.data || { categories: [] }
  const { categories } = db.data

  if (categories) {
    const { products } = db.data
    categories.forEach(category => {
      category.products = products ? products.filter(product => product.category && product.category === category.id).length : 0
    })
    return categories
  } else {
    return []
  }

}