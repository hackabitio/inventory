const Koa = require('koa')
const parser = require("koa-bodyparser")
const cors = require("@koa/cors")
const Router = require("koa-router")
const generateQr = require('./qrcode')
const addProduct = require('./add-stock').addProduct
const addStock = require('./add-stock').addStock

const router = new Router()
const App = new Koa()
const port = 8000

router.post("/qr", generateQr)
router.post("/add-product", addProduct)
router.post("/add-stock", addStock)

App.use(parser())
  .use(cors())
  .use(router.routes())
  .listen(port, () => {
    console.log(`Server listening http://127.0.0.1:${port}/`)
  })
