import {error} from "@sveltejs/kit"
import { api } from './api'

export const load = async () => {
  const response = await api('GET', 'products?details=true')

  if (response.status === 404) {
    return {
      stock: []
    }
  }

  if (response.status === 200) {
    return await response.json()
  }

  throw error(response.status)
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  const submittedData = {};
  for (let field of form) {
    const [key, value] = field;
    submittedData[key] = value;
  }
  await api('POST', `add-product`, {
    product: submittedData
  })
}