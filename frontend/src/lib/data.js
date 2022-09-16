import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import {fileURLToPath} from "url";

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
    await createDb(ctx)
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