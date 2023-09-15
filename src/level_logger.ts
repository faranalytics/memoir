import { Metadata } from './meta.js';
import { MetadataLogger } from './meta_logger.js';
import { BaseLogger, BaseLoggerOptions, Level } from "./abstract.js";

export interface LevelLoggerOptions {
    level: Level;
}

export class LevelLogger<MessageT, FormatT> extends MetadataLogger<MessageT, FormatT> {

    public base?: (message: MessageT) => void;
    public debug?: (message: MessageT) => void;
    public info?: (message: MessageT) => void;
    public warn?: (message: MessageT) => void;
    public error?: (message: MessageT) => void;

    private level: Level;

    constructor({ 
        name = '', 
        level = Level.DEBUG
    }: BaseLoggerOptions & LevelLoggerOptions, 
    ...loggers: Array<BaseLogger<MessageT, FormatT, Metadata>>
    ) {
        super({ name }, ...loggers);
        this.level = level;

        this.init();
    }

    private init() {

        delete this.base;
        delete this.debug;
        delete this.info;
        delete this.warn;
        delete this.error;

        if (this.level == Level.BASE) {
            this.base = (message: MessageT) => {
                this.log(message, Level.BASE);
            }
        }

        if (this.level <= Level.DEBUG) {
            this.debug = (message: MessageT) => {
                this.log(message, Level.DEBUG);
            }
        }

        if (this.level <= Level.INFO) {
            this.info = (message: MessageT) => {
                this.log(message, Level.INFO);
            }
        }

        if (this.level <= Level.WARN) {
            this.warn = (message: MessageT) => {
                this.log(message, Level.WARN);
            }
        }

        if (this.level <= Level.ERROR) {
            this.error = (message: MessageT) => {
                this.log(message, Level.ERROR);
            }
        }
    }

    public setLevel(level: Level) {
        this.level = level;
        this.init();
    }
}
