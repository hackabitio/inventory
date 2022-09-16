import { getDeductions, getProducts, deductStock, deleteDeduction } from '$lib/data'

export const load = async () => {
  return {
    deductions: await getDeductions(),
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
  await deductStock(submittedData)
}

export const DELETE = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  if (id) {
    await deleteDeduction(id)
  }
}