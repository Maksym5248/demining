import EventEmitter from 'events';

import { LogLevel, type ILogger, type ILog } from '~/types';

const eventEmitter = new EventEmitter();

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

export class Logger implements ILogger {
    logLevel: LogLevel;

    logs: ILog[];

    constructor(private isDebug: boolean = false) {
        this.logLevel = LogLevel.None;
        this.logs = [];
    }

    private _save(level: LogLevel, value: string) {
        const log = { level, value, createAt: new Date() };
        this.logs.push(log);
        eventEmitter.emit(EVENTS.ON_CHANGE, log);
    }

    getLogs() {
        return [...this.logs];
    }

    setLevel = (level: LogLevel) => {
        this.logLevel = level;
    };

    error = (message?: any, ...optionalParams: any[]) => {
        if (this.logLevel >= LogLevel.Error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.isDebug && console.log(message, ...optionalParams);
            this._save(LogLevel.Error, `${message} ${optionalParams?.join(',')}`);
        }
    };

    log = (message?: any, ...optionalParams: any[]) => {
        if (this.logLevel >= LogLevel.Info) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.isDebug && console.log(message, ...optionalParams);
            this._save(LogLevel.Info, `${message} ${optionalParams?.join(',')}`);
        }
    };

    debug = (message?: any, ...optionalParams: any[]) => {
        if (this.logLevel >= LogLevel.Debug) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.isDebug && console.log(message, ...optionalParams);
            this._save(LogLevel.Debug, `${message} ${optionalParams?.join(',')}`);
        }
    };

    onChange = (callBack: (value: ILog) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
