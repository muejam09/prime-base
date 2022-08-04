import Koa from "koa";
import cors from "@koa/cors";

import logger from "koa-logger";
import json from "koa-json";

import { router as uiRouter } from "./routes/index";
import { router as resourceRouter } from "./routes/resources";
import { Logger } from "./util/logging";

const app = new Koa();
// const router = new Router();

// Middlewares
// app.use(json());
app.use(logger());

const options = {
    origin: "*", // TODO change me
};

app.use(cors(options));

app.use(resourceRouter.routes())
app.use(uiRouter.routes())

let server = app.listen(3000, () => {
    console.log("Koa started");
});

export async function waitforServer(callback: any) {
    server = await server;
    Logger.log("Server loaded", "INFO");
    callback();
}

export { server };
export { app };
