import dgram from "dgram";
import {Buffer} from "buffer";

const PORT = 12001;
const HOST = "127.0.0.1";
const timestep = 50;

// circle config
let ush: number = 58.37965019175549;
let usv: number = 60.377945725829846;
const radius: number = 1;
const angleStep: number = 10;
let cnt = 0;

sendLoop();

function sendLoop() {

    setInterval(myFunction, timestep);
    let angle: number = 0;


    function myFunction() {
        const client = dgram.createSocket("udp4");
        const header = '2330070035520A00';
        const timechannel = 'AAAADE73C92F2540'
        const dummychannel = '0000000080842EC1';
        const complete =
            header +
            timechannel + // timechannel
            dummychannel + // channel 2
            dummychannel + // channel 1
            dummychannel + // force
            dummychannel + // laser
            dummychannel + // ush
            dummychannel + // usv
            dummychannel + // periodeDet
            dummychannel + // rpmSignal
            dummychannel + // cnt1
            dummychannel + // cnt2
            dummychannel; // cnt3
        const message = new Buffer(complete, 'hex');
        // console.log(message.toString('utf8', 0, 2));
        // console.log(message.readInt16LE(2));
        // console.log(message.readUInt16LE(5));
        // console.log(message.readDoubleLE(8));
        message.writeDoubleLE(ush, 48);
        message.writeDoubleLE(usv, 56);
        message.writeDoubleLE(cnt, 96);
        // console.log(message.readDoubleLE(96));
        client.send(message, 0, message.length, PORT, HOST, (err) => {
            if (err) {
                throw err;
            }
            // console.log('UDP message sent to ' + HOST + ':' + PORT);
            // console.log(complete);
            client.close();
        });

        if (angle === 0 || angle === 90 || angle === 180 || angle === 270) {
            cnt++;// TODO add better rpm
        }
        if (angle >= 360) // restart every minute
        {
            angle = 0;
        } else {
            ush = 51.50 + (radius + Math.random()) * Math.sin(angle * (Math.PI / 180))
            usv = 62.21 + (radius + Math.random()) * Math.cos(angle * (Math.PI / 180))
            angle += angleStep;
        }
        cnt= 1200;
    }
}
