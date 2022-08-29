import {error} from "@sveltejs/kit"
import { api } from './api'

export const load = async () => {
  const response = await api('GET', 'products')

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
