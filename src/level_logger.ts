import { Metadata } from './metadata.js';
import { MetadataLogger } from './metadata_logger.js';
import { Logger, LoggerOptions, Level } from "./abstract.js";

export interface LevelLoggerOptions {
    level?: Level;
}

export class LevelLogger<MessageT, FormatT> extends MetadataLogger<MessageT, FormatT> {

    public base?: (message: MessageT) => void;
    public debug?: (message: MessageT) => void;
    public info?: (message: MessageT) => void;
    public warn?: (message: MessageT) => void;
    public error?: (message: MessageT) => void;

    private level: Level;

    constructor({ name = '', level = Level.BASE }: LoggerOptions & LevelLoggerOptions,
        ...loggers: Array<Logger<MessageT, FormatT, Metadata>>
    ) {
        super({ name }, ...loggers);
        this.level = level;

        this.configure();
    }

    private configure() {

        delete this.base;
        delete this.debug;
        delete this.info;
        delete this.warn;
        delete this.error;

        if (this.level == Level.BASE) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.base = this.log.bind(this, Level.BASE);
        }

        if (this.level <= Level.DEBUG) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.debug = this.log.bind(this, Level.DEBUG);
        }

        if (this.level <= Level.INFO) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.info = this.log.bind(this, Level.INFO);
        }

        if (this.level <= Level.WARN) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.warn = this.log.bind(this, Level.WARN);
        }

        if (this.level <= Level.ERROR) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.error = this.log.bind(this, Level.ERROR);
        }
    }

    public setLevel(level: Level) {
        this.level = level;
        this.configure();
    }
}
