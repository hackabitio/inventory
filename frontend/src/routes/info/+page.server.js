import {error} from "@sveltejs/kit"
import { api } from './api'

export const load = async () => {
  const response = await api('GET', 'products?details=true')
  const categories = await api('GET', 'categories')

  if (response.status === 404 && categories.status === 404) {
    return {
      stock: [],
      categories: []
    }
  }

  if (response.status === 200 && categories.status === 200) {
    return {
      products: await response.json(),
      categories: await categories.json()
    }
  }

  throw error(response.status)
}