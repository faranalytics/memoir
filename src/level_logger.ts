import { Meta } from './meta.js';
import {MetaLogger} from './meta_logger.js';
import { BaseLogger, BaseLoggerOptions, Level } from "./abstract.js";

export class LevelLogger<MessageT, FormatT> extends MetaLogger<MessageT, FormatT> {

    constructor(options: BaseLoggerOptions = { name: '' }, ...loggers: Array<BaseLogger<MessageT, FormatT, Meta>>) {
        super(options, ...loggers);
        this.base = this.base.bind(this);
        this.debug = this.debug.bind(this);
        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
    }

    base(message: MessageT) {
        this.log(message, new Meta(this.name, Level.BASE));
    }

    debug(message: MessageT) {
        this.log(message, new Meta(this.name, Level.DEBUG));
    }

    info(message: MessageT) {
        this.log(message, new Meta(this.name, Level.INFO));
    }

    warn(message: MessageT) {
        this.log(message, new Meta(this.name, Level.WARN));
    }

    error(message: MessageT) {
        this.log(message, new Meta(this.name, Level.ERROR));
    }
}
