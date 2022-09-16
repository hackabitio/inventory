import QRCode from 'qrcode-svg'
import sharp from 'sharp'
const exportLocation = './qr/'

const createTheCode = txt => {
  txt = txt.toLowerCase()
  const fileName = txt.replace(/\s/g, '-')

  const qrcode = new QRCode({
    content: txt,
    padding: 1,
    width: 256,
    height: 256,
    color: "#000000",
    background: "#ffffff",
    ecl: "M"
  })

  qrcode.save(exportLocation + fileName + ".svg", function (error) {
    if (error) throw error

    sharp(exportLocation + fileName + '.svg')
      .png()
      .toFile(exportLocation + fileName + ".png")
      .then(function (info) {
        console.log(info)
      })
      .catch(function (err) {
        console.log(err)
      })

    console.log("QR Code saved!")
  })
}

export const generateQr = (qrTxt) => {
  if (typeof qrTxt == 'string') {
    createTheCode(qrTxt)
    return "The code generated"
  } else if (Array.isArray(qrTxt)) {
    qrTxt.forEach(q => {
      createTheCode(q)
    })
  } else {
    return "Please provide a text to be converted to QR code."
  }
}