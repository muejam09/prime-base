import Koa from "koa";
import cors from "@koa/cors";
import serve from "koa-static";
import logger from "koa-logger";
import json from "koa-json";
import {router as resourceRouter} from "./routes/resources";

const app = new Koa();

const SPA_PATH = `${__dirname}\\public`
const PORT = 3000;
const options = {
    origin: "*", // TODO change me
};

// Middlewares
app.use(cors(options));
app.use(json()); // pretty json body in browser
app.use(logger()); // log requests in console

app.use(serve(SPA_PATH, {defer: true})) // serve static SPA
app.use(resourceRouter.routes());

const server = app.listen(PORT, () => {
    console.log("Koa started ");
});

export {server};
export {app};
