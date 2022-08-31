import {error} from "@sveltejs/kit"
import { api } from './api'

export const load = async () => {
  const response = await api('GET', 'categories')

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
  const submittedData = {}
  for (let field of form) {
    const [key, value] = field
    submittedData[key] = value
  }
  await api('POST', `add-category`, {
    category: submittedData
  })
}


export const DELETE = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  if (id) {
    await api('DELETE', `delete-category?id=${id}`)
  }
}