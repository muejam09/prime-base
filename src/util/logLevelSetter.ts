import {Logger} from "./logging";

// sets LogLevel for online repo, should be in .gitignore
export function setAppropriateLogLevel() {
    Logger.setLogLevel("INFO");
}
