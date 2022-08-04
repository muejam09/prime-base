/* tslint:disable:no-console */
export const LOGLEVELS = ["SILENT", "ERROR", "INFO", "DEBUG", "TEST", "DBERROR", "DB", "DEBUG2"];

export enum LOGGINGBEHAVIOURS {
    LOGNOW = 1, LOGONERROR = 2, LOGNEVER = 3,
}

export class Logger {
    public static hasBeenLogged(message: string): number {
        const listoftrues = Logger.logs.filter((m) => m === message);
        return listoftrues.length;
    }

    public static clearBacklog() {
        Logger.logs = [];
    }

    public static setLogLevel(newLevel: string) {
        Logger.currentLogLevel = LOGLEVELS.indexOf(newLevel);
    }

    public static log(message: any, messageLevel: string = "INFO") {
        if (LOGLEVELS.indexOf(messageLevel) === -1) {
            console.log("WARN: Did not recognize LogLevel \"" + messageLevel + "\" setting it to ERROR");
            messageLevel = "ERROR";
        }
        if (Logger.currentLogLevel >= LOGLEVELS.indexOf(messageLevel)) {
            Logger.logs.push(message);
            if (Logger.logs.length > 25) {
                Logger.logs.shift();
            }
            console.log(message);
        }
    }

    private static defaultLogLevel = LOGLEVELS.indexOf("INFO");
    private static currentLogLevel = Logger.defaultLogLevel;

    private static logs: string[] = [];
}
