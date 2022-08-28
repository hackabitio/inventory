let jsoning = require("jsoning")
const generateQr = require('./qrcode')
const uuid = require('uuid')

let db = new jsoning("./db/stock.json")

module.exports = (ctx) => {
  let product = ctx.request.body.product
  product.id = uuid.v4()
  let sku = product.sku
  if (sku) {
    sku = sku.toLowerCase().replace(/\s/g, '-')
    generateQr(sku)
  } else {
    sku = product.name.toLowerCase().replace(/\s/g, '-')
  }

  console.log('SKU: ', sku)
  db.push(sku, product)

  console.log('Product to be added: ', product)

    ctx.body = {
      msg: 'Products added',
      ids: product.id
    }
    ctx.status = 201
}


// (async () => {
//   // set some values with a key
//   await db.set("birthday", "07-aug");
//   await db.set("age", "13");
//
//   // push stuff to an array for a particular key
//   await db.push("transformers", "optimus prime");
//   await db.push("transformers", "bumblebee");
//   await db.push("transformers", "iron hide");
//
//   // simply log what get is (i forgot what the transformers were)
//   console.log(await db.get("transformers")); // [ 'optimus prime', 'bumblebee', 'iron hide' ]
//
//   // just want to see what all is there
//   console.log(await db.all()); // { object of the whole database contents }
//
//   // does such a value exist
//   console.log(await db.has("value2")); // false
//
//   // my age keeps changing, so I'm deleting it
//   console.log(await db.delete("age")); // true
//
//   // i got 100$ for my birthday
//   await db.set("money", 100);
//
//   // and someone gave me 200 more dollars xD
//   await db.math("money", "add", 200);
//
//   // just wanna make sure how much money I got
//   console.log(await db.get("money")); // 300
//
//   // rip iron hide, he died
//   await db.remove("transformers", "iron hide");
//
//   // i'm getting bored, so i'm clearing the whole database
//   // await db.clear();
// })();