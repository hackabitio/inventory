import { getProducts, getCategories } from '$lib/data'
import PDFDocument from 'pdfkit'
import fs from 'fs'

export const load = async () => {
  return {
    products: getProducts(true),
    categories: getCategories()
  }
}

const toMM = s => {
  return parseInt(s / 0.3527)
}

export const POST = async ({ request }) => {
  const form = await request.formData()
  const paperWidth = form.get('labelWidth')
  const paperHeight = form.get('labelHeight')
  const qrWidth = parseInt(paperWidth / 2)

  const doc = new PDFDocument({
    size: [toMM(paperWidth), toMM(paperHeight)],
    margins : { // by default, all are 72
      top: 2,
      bottom:2,
      left: 2,
      right: 2
    }
  })
  doc.pipe(fs.createWriteStream('example.pdf'))
  doc.fontSize(8)
  const products = await getProducts(true)
  products.forEach(product => {
    if (fs.existsSync(`static/qr/${product.sku}.png`)) {
      doc
      .addPage()
      .image(`static/qr/${product.sku}.png`, toMM(parseInt((paperWidth - qrWidth) / 2)), toMM(2), {fit: [toMM(qrWidth), toMM(qrWidth)], align: 'center'})
      .moveDown()
      .text('', 0, toMM(parseInt(qrWidth + 2)))
      .font('Helvetica', 7)
      .text(product.sku, {
        align: 'center'
      })
      .font('Times-Roman', 8)
      .restore()
      .text(product.name, {
        align: 'center'
      })
    } else {
      doc
      .addPage()
      .text(product.name)
    }
  });
  doc.end();

  // await addStock(submittedData)
}