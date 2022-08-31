import { error } from '@sveltejs/kit';
import { api } from './api'

export const load = async () => {
  const additions = await api('GET', 'all-additions')
  const products = await api('GET', 'products')
  if (additions.status === 404 && products.status === 404) {
    return {
      stock: [],
      products: []
    }
  }
  if (additions.status === 200 && products.status === 200) {
    const returnVal = {
      additions: await additions.json(),
      products: await products.json()
    }
    // console.log(returnVal)
    return returnVal
  }

  throw error(additions.status)
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  const submittedData = {};
  for (let field of form) {
    const [key, value] = field;
    submittedData[key] = value;
  }
  await api('POST', `add-stock`, {
    product: submittedData
  })
}

export const DELETE = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  if (id) {
    // await api('DELETE', `delete-addition?id=${id}`);
  }
};