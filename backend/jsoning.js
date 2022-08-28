let jsoning = require("jsoning");
let db = new jsoning("./db/db.json");

(async () => {
    // set some values with a key
    await db.set("birthday", "07-aug");
    await db.set("age", "13");

    // push stuff to an array for a particular key
    await db.push("transformers", "optimus prime");
    await db.push("transformers", "bumblebee");
    await db.push("transformers", "iron hide");

    // simply log what get is (i forgot what the transformers were)
    console.log(await db.get("transformers")); // [ 'optimus prime', 'bumblebee', 'iron hide' ]

    // just want to see what all is there
    console.log(await db.all()); // { object of the whole database contents }

    // does such a value exist
    console.log(await db.has("value2")); // false

    // my age keeps changing, so I'm deleting it
    console.log(await db.delete("age")); // true

    // i got 100$ for my birthday
    await db.set("money", 100);

    // and someone gave me 200 more dollars xD
    await db.math("money", "add", 200);

    // just wanna make sure how much money I got
    console.log(await db.get("money")); // 300

    // rip iron hide, he died
    await db.remove("transformers", "iron hide");

    // i'm getting bored, so i'm clearing the whole database
    // await db.clear();
})();