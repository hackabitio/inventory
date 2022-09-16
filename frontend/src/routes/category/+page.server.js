import { addCategory, deleteCategory, getCategories, updateCategory } from '$lib/data'

export const load = async () => {
  const categories = await getCategories()
  return categories
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  const submittedData = {}
  for (let field of form) {
    const [key, value] = field
    submittedData[key] = value
  }
  await addCategory(submittedData)
}


export const DELETE = async ({ request }) => {
  const form = await request.formData()
  const id = form.get('id')
  await deleteCategory(id)
}

export const PATCH = async ({ request, locals }) => {
  const form = await request.formData();
  const category = {
    id: form.get('newId'),
    name: form.get('newName')
  }
  await updateCategory(category)
};