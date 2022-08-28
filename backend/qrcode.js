const QRCode = require('qrcode-svg')
const sharp = require('sharp')
const exportLocation = './images/'

const createTheCode = txt => {
  txt = txt.toLowerCase()
  const fileName = txt.replace(/\s/g, '-')

  const qrcode = new QRCode({
    content: txt,
    padding: 4,
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

module.exports = (qrTxt) => {
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