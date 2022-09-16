import { getProducts, getCategories } from '$lib/data'

export const load = async () => {

  return {
    products: await getProducts(true),
    categories: await getCategories()
  }
}
