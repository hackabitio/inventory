const QRCode = require('qrcode-svg')
const sharp = require('sharp')

const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

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

  qrcode.save(fileName + ".svg", function (error) {
    if (error) throw error;

    const svgQr = sharp(fileName + '.svg')
      .png()
      .toFile(fileName + ".png")
      .then(function (info) {
        console.log(info)
      })
      .catch(function (err) {
        console.log(err)
      })

    console.log("QR Code saved!");
  });

}

const generateQr = (ctx) => {
  let qrTxt = ctx.request.body.qrText

  if (typeof qrTxt == 'string') {
    createTheCode(qrTxt)
    ctx.body = "The code generated"
  } else if (Array.isArray(qrTxt)) {
    qrTxt.forEach(q => {
      createTheCode(q)
      ctx.body = "The codes generated"
    })
  } else {
    ctx.body = "Please provide a text to be converted to QR code."
  }
  ctx.status = 201
}
