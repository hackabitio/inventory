# Simple inventory management
This is a simple inventory management system.

The backend uses:
* koajs as backend
* svelte kit as frontend
* [qrcode-svg](https://github.com/papnkukn/qrcode-svg) for generating qr code from SKU
* [sharpjs](https://github.com/lovell/sharp) to convert qr codes from svg to png
* [lowdb](https://github.com/typicode/lowdb) as a simple and lightweight database

Frontend made of sveltejs app

To run the app, open two terminal windows, one for each backend and frontend and run `npm start` in both.