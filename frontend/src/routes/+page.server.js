import {error} from "@sveltejs/kit"
import { api } from './api'

export const load = async ({ locals }) => {
  const response = await api()

  if (response.status === 404) {
    return {
      stock: []
    }
  }

  if (response.status === 200) {
    let stock = await response.json()
    if (locals) {
      locals.theStock = stock
    }
    return {
      stock
    }
  }

  throw error(response.status)
}
