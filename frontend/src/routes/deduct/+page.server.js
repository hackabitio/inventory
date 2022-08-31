import { error } from '@sveltejs/kit';
import { api } from './api'

export const load = async () => {
  const deductions = await api('GET', 'all-deductions')
  const products = await api('GET', 'products')
  if (deductions.status === 404 && products.status === 404) {
    return {
      stock: [],
      products: []
    }
  }
  if (deductions.status === 200 && products.status === 200) {
    const returnVal = {
      deductions: await deductions.json(),
      products: await products.json()
    }
    return returnVal
  }

  throw error(deductions.status)
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  const submittedData = {};
  for (let field of form) {
    const [key, value] = field;
    submittedData[key] = value;
  }
  await api('POST', `release-stock`, {
    product: submittedData
  })
}

export const DELETE = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  if (id) {
    await api('DELETE', `delete-deduction?id=${id}`)
  }
}