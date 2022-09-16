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
  let updateIt = (product.productId && product.editOrNew)
  product.id = updateIt ? product.productId : crypto.randomUUID()

  delete product.productId
  delete product.editOrNew

  if (updateIt) {
    let existingProduct = db.data.products.find((p) => p.id === product.id)
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
    } else {
      sku = product.name.toLowerCase().replace(/\s/g, '-')
    }
    generateQr(sku)
    let existingProduct = db.data.products.find((p) => p.sku === sku)
    if (existingProduct) {
      return existingProduct.id
    } else {
      product.qty = parseInt(product.qty)
      product.orderPrice = parseFloat(parseFloat(parseFloat(product.orderPrice) / product.qty).toFixed(4))
      product.sku = sku.toLowerCase()
      db.data.products.push(product)
      console.log(db.data.products)
      await db.write()

      return product.id
    }
  }
}

export const deleteProduct = async (id) => {
  if (!id) {
    return null
  }
  await db.read()

  let theProduct = db.data.products.find(product => product.id === id)
  if (theProduct) {
    db.data.products = db.data.products.filter(product => product.id !== id)
    db.data.additions = db.data.additions.filter(addition => !theProduct.additions.includes(addition.id))
    db.data.deductions = db.data.deductions.filter(deduction => !theProduct.deductions.includes(deduction.id))
    await db.write()

    return id
  } else {
    return null
  }
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

export const addCategory = async (category) => {
  category.id = crypto.randomUUID()
  await db.read()

  db.data = db.data || { categories: [] }
  const { categories } = db.data
  let existingCategories = categories && categories.find(c => c.name === category.name)
  if (existingCategories) {
    return null
  } else {
    categories.push(category)
    await db.write()
    return category.id
  }
}

export const deleteCategory = async (id) => {
  await db.read()

  let theCategory = db.data.categories.filter(category => category.id === id)
  db.data.categories = db.data.categories.filter(category => category.id !== id)
  if (theCategory.length) {
    await db.write()

    return id
  } else {
    return null
  }
}

export const updateCategory = async (category) => {
  await db.read()
  db.data = db.data || { categories: [] }
  const { categories } = db.data
  let findCategory = categories.find(c => c.id === category.id)
  if (!findCategory) {
    return null
  } else {
    findCategory.name = category.name
    await db.write()
    return category.id
  }
}

export const getAdditions = async () => {
  await db.read()
  db.data = db.data || { additions: [] }
  const { additions } = db.data

  if (additions) {
    return additions
  } else {
    return null
  }
}


export const addStock = async (product) => {
  let id = crypto.randomUUID()
  let sku = product.sku
  if (typeof sku === 'undefined') {
    return null
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
      let quantity = parseInt(product.qty)
      let unitPrice = parseInt(product.orderPrice) / quantity
      const newStock = {
        id,
        time: new Date(),
        name: theProduct.name,
        sku: theProduct.sku,
        qty: quantity,
        orderPrice: unitPrice
      }
      db.data = db.data || { additions: [] }
      const { additions } = db.data
      additions.push(newStock)

      let oldQty = parseInt(theProduct.qty)
      let newQty = oldQty + parseInt(product.qty)
      theProduct.qty = parseInt(newQty)
      theProduct.additions.push(id)
      await db.write()

      return theProduct.id
    }

  }
}

export const deleteAddition = async (id) => {
  if (!id) {
    return null
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

    return id
  } else {
    return null
  }

}