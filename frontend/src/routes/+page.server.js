import { createDb, getProducts, getCategories, addProduct, deleteProduct } from '$lib/data'

export const load = async () => {
  createDb()

  return {
    products: getProducts(true),
    categories: getCategories()
  }
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  const submittedData = {};
  for (let field of form) {
    const [key, value] = field;
    submittedData[key] = value;
  }
  await addProduct(submittedData)
}

export const DELETE = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  if (id) {
    await deleteProduct(id)
  }
}