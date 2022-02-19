const {
  app: { port },
} = require("./config");
const path = require("path");
const koaValidator = require("koa-async-validator");
const Koa = require("koa");
const bodyParser = require("koa-body");
const cors = require("@koa/cors");
const koaStatic = require("koa-static");

const router = require("./router")();

const app = new Koa();
const staticDist = koaStatic(path.resolve(__dirname, "../public"), {
  maxage: 31536000000
});

app.use(cors());
app.use(staticDist);
app.use(
  bodyParser({
    multipart: false,
    urlencoded: true,
  })
);
app.use(koaValidator());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
