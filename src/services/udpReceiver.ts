import * as dgram from "node:dgram";
import {AddressInfo} from "net";
import {Logger} from "../util/logging";
import * as buffer from "buffer";
import {QuantumXData} from "../types/QuantumXData";

export class UdpQuantumX {
    private _data: QuantumXData | undefined;

    constructor() {
        const PORT = 12001;
        const server = dgram.createSocket("udp4");


        server.on("listening", () => {
            const address: AddressInfo = server.address() as AddressInfo;
            Logger.log("UDP Server listening on " + address.address + ":" + address.port + " for QuantumX Packages!");
        });

        server.on("message", (message: Buffer, remote: any) => {
            // Logger.log("udp message received");
            try {
                // Logger.log(message.toString('hex'));
                // Logger.log(message.toString('utf8', 0, 2))// identifier
                // Logger.log(message.readInt16LE(2));// kanalanzahl
                // Logger.log(message.readInt32LE(5)); // paketanzahl
                // Logger.log(message.readDoubleLE(8)) // kanal Zeit
                // Logger.log(message.readDoubleLE(16)) // kanal2
                // Logger.log(message.readDoubleLE(24)) // kanal3
                // Logger.log(message.readDoubleLE(32)) // kanal Laser
                // Logger.log(message.readDoubleLE(40)) // kanal US 1
                // Logger.log(message.readDoubleLE(48)) // kanal US 2
                this.hexMsgToQuantumXData(message);
                this._data = this.hexMsgToQuantumXData(message);
            } catch (e) {
                Logger.log(e, "ERROR");
            }
        });

        server.bind(PORT);
    }

    public hexMsgToQuantumXData(msg: Buffer): QuantumXData {
        const data: QuantumXData = {
            id: msg.toString('utf8', 0, 2),
            numberofChannel: msg.readInt16LE(2),// kanalanzahl
            pkgCnt: msg.readInt32LE(5),
            time: msg.readDoubleLE(8),
            channel1: msg.readDoubleLE(16),
            channel2: msg.readDoubleLE(24),
            laser: msg.readDoubleLE(32),
            us1:msg.readDoubleLE(40),
            us2:msg.readDoubleLE(48),
        };
        return data;
    }

    get data(): QuantumXData | undefined {
        return this._data;
    }
}
