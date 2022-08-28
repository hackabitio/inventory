import { api } from './api'

export const load = async ({ locals }) => {
  const additions = await api('GET', 'get-addings')
  const products = await api('GET', 'products')

  if (additions.status === 404 && products.status === 404) {
    return {
      stock: [],
      products: []
    }
  }

  if (additions.status === 200 && products.status === 200) {
    return {
      additions: await additions.json(),
      products: await products.json()
    }
  }

  throw error(additions.status)
}
