import Router from "koa-router";
import { Logger } from "../util/logging";
import {UdpQuantumX} from "../services/udpReceiver";

const receiver = new UdpQuantumX();
const router = new Router();
const BASE_URL = "/api/v1";

router.get(BASE_URL, async (ctx) => {
    ctx.body = "Webserver running! API waiting for Requests";
    ctx.status = 200;
});

router.get(BASE_URL + "/test", async (ctx) => {
    try {
        ctx.body = { data: receiver.data };
        if (ctx.body == null) {
            throw {
                code: 500,
                message: "Internal Server Error - Leica not Reachable",
            };
        }
    } catch (err: any) {
        Logger.log(err, "ERROR");
        if (err.code === 404) {
            ctx.status = err.code;
            ctx.body = {
                message: err.message || "That resource does not exist.",
                status: err.status || "error",
            };
        } else {
            ctx.status = 500;
            if (typeof err === "object") {
                ctx.body = Object.assign({status: "error"}, err);
            } else {
                ctx.body = {
                    message: err,
                    status: "error",
                };
            }
        }
    }
});

export { router };
