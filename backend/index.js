import Koa from  'koa'
import parser from  "koa-bodyparser"
import cors from  "@koa/cors"
import Router from  "koa-router"
import { generateQr } from './qrcode.js'
import { createDb, addProduct, addStock, deductStock, getAdditions } from "./data.js"

const router = new Router()
const App = new Koa()
const port = 8000

router.post("/qr", generateQr)
router.post("/create-database", createDb)
router.post("/add-product", addProduct)
router.post("/add-stock", addStock)
router.post("/release-stock", deductStock)
router.get("/all-additions", getAdditions)

// router.get("/products", getProducts)
// router.get("/product", getProduct)

App.use(parser())
  .use(cors())
  .use(router.routes())
  .listen(port, () => {
    console.log(`Server listening http://127.0.0.1:${port}/`)
  })
