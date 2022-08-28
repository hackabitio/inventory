const Koa = require('koa')
const parser = require("koa-bodyparser")
const cors = require("@koa/cors")
const Router = require("koa-router")
const generateQr = require('./qrcode')
const addProduct = require('./stock').addProduct
const addStock = require('./stock').addStock
const releaseStock = require('./stock').releaseStock
const getProducts = require('./stock').getProducts
const getProduct = require('./stock').getProduct
const getAddStock = require('./stock').getAddStock

const router = new Router()
const App = new Koa()
const port = 8000

router.post("/qr", generateQr)
router.post("/add-product", addProduct)
router.post("/add-stock", addStock)
router.post("/release-stock", releaseStock)
router.get("/products", getProducts)
router.get("/product", getProduct)
router.get("/get-addings", getAddStock)

App.use(parser())
  .use(cors())
  .use(router.routes())
  .listen(port, () => {
    console.log(`Server listening http://127.0.0.1:${port}/`)
  })
