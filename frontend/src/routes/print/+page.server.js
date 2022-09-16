import { getProducts, getCategories } from '$lib/data'

export const load = async () => {
  return {
    products: getProducts(true),
    categories: getCategories()
  }
}
