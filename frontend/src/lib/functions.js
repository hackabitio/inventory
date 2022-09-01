export const formatDate = t => {
  if (t) {
    let d = new Date(t)
    return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`
  } else {
    return ' '
  }
}