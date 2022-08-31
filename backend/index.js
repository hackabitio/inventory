import Koa from  'koa'
import parser from  "koa-bodyparser"
import cors from  "@koa/cors"
import Router from  "koa-router"
import serve from 'koa-static'
import koaSend from 'koa-send'
import path from 'path'
import {fileURLToPath} from 'url'
import { generateQr } from './qrcode.js'
import { createDb, addProduct, addStock, deductStock, getAdditions, getProducts, getProduct, getDeductions, deleteAddition, deleteDeduction, addCategory, getCategories, deleteCategory, updateCategory } from "./data.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const staticDirPath = path.join(__dirname, 'images');

const router = new Router()
const App = new Koa()
const port = 8000

router.post("/qr", generateQr)
router.post("/create-database", createDb)
router.post("/add-product", addProduct)
router.post("/add-category", addCategory)
router.post("/add-stock", addStock)
router.delete("/delete-addition", deleteAddition)
router.delete("/delete-deduction", deleteDeduction)
router.delete("/delete-category", deleteCategory)
router.patch("/update-category", updateCategory)
router.post("/release-stock", deductStock)
router.get("/all-additions", getAdditions)
router.get("/all-deductions", getDeductions)
router.get("/products", getProducts)
router.get("/product", getProduct)
router.get("/categories", getCategories)
router.get('/images/:image', async ctx => {
  const { image } = ctx.params
  await koaSend(ctx, `images/${image}`);
})

App.use(parser())
  .use(serve(staticDirPath))
  .use(cors())
  .use(router.routes())
  .listen(port, () => {
    console.log(`Server listening http://127.0.0.1:${port}/`)
  })
