import { api } from './api'
import { getAdditions, getProducts, addStock, deleteAddition } from '$lib/data'

export const load = async () => {
  return {
    additions: await getAdditions(),
    products: await getProducts()
  }
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  const submittedData = {};
  for (let field of form) {
    const [key, value] = field;
    submittedData[key] = value;
  }
  await addStock(submittedData)
}

export const DELETE = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  if (id) {
    await deleteAddition(id)
  }
}