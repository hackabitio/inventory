import {error} from "@sveltejs/kit"
export const prerender = true
import { api } from './api'

export const load = async ({ locals }) => {
  const response = await api()

  if (response.status === 404) {
    return {
      stock: []
    }
  }

  if (response.status === 200) {
    return {
      stock: await response.json()
    }
  }

  throw error(response.status)
}
