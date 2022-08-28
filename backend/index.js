const QRCode = require('qrcode-svg')
const sharp = require('sharp')

const Koa = require('koa');
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const Router = require("koa-router");
const router = new Router();

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

router.get("/test", (ctx) => (ctx.body = "Events List!"));
router.post("/qr", generateQr);

const App = new Koa();
const port = 8000;


App.use(parser())
  .use(cors())
  .use(router.routes())
  .listen(port, () => {
    console.log(`Server listening http://127.0.0.1:${port}/`);
  });
