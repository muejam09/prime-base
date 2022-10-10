import * as dgram from "node:dgram";
import {AddressInfo} from "net";
import {Logger} from "../util/logging";
import {QuantumXData} from "../types/QuantumXData";
import {BehaviorSubject, bufferTime, distinctUntilChanged, filter, map, tap} from "rxjs";
import {UiData} from "../types/UiData";


export class UdpQuantumX {
    private _data: UiData | undefined;
    private counterSubject: BehaviorSubject<number>;
    private rpm: number = -1;

    constructor() {
        const PORT = 12001;
        const server = dgram.createSocket("udp4");
        this.counterSubject = new BehaviorSubject<number>(-1);

        // rpm calculation via rxjs
        const timeToMeasureRpm = 1; // in seconds
        this.counterSubject.pipe(
            // tap(value => console.log('got new value')),
            filter(value => value % 2 === 0),// only every even count, because sensor emits twice per magnet (falling and rising edge)
            distinctUntilChanged(),
            // tap(value => console.log('after distinct with value: ' + value)),
            bufferTime(timeToMeasureRpm * 1000), // wait for x seconds
            map(cnts => {
                // console.log('cnts registered in '+ timeToMeasureRpm + 's:' + cnts.length);
                return cnts.length / timeToMeasureRpm * 60/4; // devide by 4 for 4 magnets
            }),
            // tap(value => console.log(value))
        ).subscribe(value => this.rpm = value);


        server.on("listening", () => {
            const address: AddressInfo = server.address() as AddressInfo;
            Logger.log("UDP Server listening on " + address.address + ":" + address.port + " for QuantumX Packages!");
        });

        server.on("message", (message: Buffer) => {
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
                // this.hexMsgToQuantumXData(message);
                this._data = this.hexMsgToUiXData(message);
            } catch (e) {
                Logger.log(e, "ERROR");
            }
        });

        server.bind(PORT);
    }

    public hexMsgToUiXData(msg: Buffer): UiData {
        if (false) // TODO add check for channels size to support scrapetec quantumx
        {
            const data: any = {
                id: msg.toString('utf8', 0, 2),
                numberofChannel: msg.readInt16LE(2),// kanalanzahl
                pkgCnt: msg.readInt32LE(5),
                time: msg.readDoubleLE(8),
                channel1: msg.readDoubleLE(16),
                channel2: msg.readDoubleLE(24),
                ush: msg.readDoubleLE(48),
                usv: msg.readDoubleLE(56),
                rpmSignal: msg.readDoubleLE(72)
            }
            return data;
        } else {
            const data: QuantumXData = {
                id: msg.toString('utf8', 0, 2),
                numberofChannel: msg.readInt16LE(2), // kanalanzahl
                pkgCnt: msg.readUInt16LE(5),
                time: msg.readDoubleLE(8),
                channel1: msg.readDoubleLE(16),
                channel2: msg.readDoubleLE(24),
                force: msg.readDoubleLE(32),
                laser: msg.readDoubleLE(40),
                ush: msg.readDoubleLE(48),
                usv: msg.readDoubleLE(56),
                periodDet: msg.readDoubleLE(64),
                rpmSignal: msg.readDoubleLE(72),
                cnt: msg.readDoubleLE(80),
                cnt2: msg.readDoubleLE(88),
                cnt3: msg.readDoubleLE(96)
            }
            // rpm calculation via rxjs
            this.counterSubject.next(data.cnt3);
            // conversion to data for ui
            return this.quantumXDataToUiData(data);
        }
    }

    public quantumXDataToUiData(data: QuantumXData): any {
        return {
            ush: data.ush,
            usv: data.usv,
            rpm: this.rpm,
        };
    }

    get data(): UiData | undefined {
        return this._data;
    }
}
