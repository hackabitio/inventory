# Simple inventory management
This is a simple inventory management system.

## Backend
* koajs as backend
* [qrcode-svg](https://github.com/papnkukn/qrcode-svg) for generating qr code from SKU
* [sharpjs](https://github.com/lovell/sharp) to convert qr codes from svg to png
* [lowdb](https://github.com/typicode/lowdb) as a simple and lightweight database

### Developing

```shell
cd backend
npm install
npm run dev 
```

This will run the app and watches for file changes using nodemon.

### Run in production 
```shell
cd backend
npm start
```

## Frontend
For frontend, I've used [sveltekit](https://kit.svelte.dev/).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

**Important note:** This project doesn't use any kind of authentication. I'm planning to use it on my localhost, so not worries about security.