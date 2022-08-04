import FileSystem from "fs";
import Router from "koa-router";
import path from "path"

// const path = require("path");
const router = new Router();


router.get("/", async (ctx, next) => {
    ctx.body = { msg: "Hello world!" };

});

// router.get("/", async (ctx) => {
//     // TODO add angular SPA to dist folder
//     ctx.body = FileSystem.readFileSync(path.join(".", "public", "index.html"), {encoding: "utf8"});
// });

export { router };
