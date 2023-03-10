export { BaseLogger, BaseHandler, BaseFormatter } from './base.js'
export { RotatingFileHandler } from './node.js';
import { BaseLogger, BaseHandler, BaseFormatter } from './base.js'

export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export interface IMeta {
    level: number;
    func?: string;
    url?: string;
    line?: string;
    col?: string;
}

export class Meta implements IMeta {
    level: number;
    error?: Error;
    func?: string;
    url?: string;
    line?: string;
    col?: string;

    constructor(level: Level) {
        this.level = level;
    }
}

export class Logger<MessageT, FormatT> extends BaseLogger<MessageT, FormatT, Meta> {

    static parseStackTrace(stack: string | undefined): { func?: string, url?: string, line?: string, col?: string } {

        let match = stack?.match(/^([^\n]+?\n){3}\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);

        let groups = match?.groups;

        if (groups) {
            return {
                func: groups['func'],
                url: groups['url'],
                line: groups['line'],
                col: groups['col']
            }
        }

        return {};
    }

    public level: number = Level.ERROR;
    
    protected handlers: Array<LevelHandler<MessageT, FormatT>> = [];

    constructor(parent?: BaseLogger<MessageT, FormatT, Meta>) {
        super(parent);
        this.log = this.log.bind(this);
        this.base = this.base.bind(this);
        this.debug = this.debug.bind(this);
        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
    }

    log(message: MessageT, meta: Meta): void {

        if (!meta.error) {
            let error = new Error();
            meta.error = error;
        }

        let parse = Logger.parseStackTrace(meta.error.stack);

        if (this.handlers.length) {

            meta = { ...meta, ...parse };

            for (let handler of this.handlers) {
                handler.handle(message, meta);
            }

            this.parent?.log(message, meta);
        }
    }

    base(message: MessageT) {
        this.log(message, new Meta(Level.BASE));
    }

    debug(message: MessageT) {
        this.log(message, new Meta(Level.DEBUG));
    }

    info(message: MessageT) {
        this.log(message, new Meta(Level.INFO));
    }

    warn(message: MessageT) {
        this.log(message, new Meta(Level.WARN));
    }

    error(message: MessageT) {
        this.log(message, new Meta(Level.ERROR));
    }

    addHandler(handler: LevelHandler<MessageT, FormatT>) {
        this.handlers.push(handler);
        if (handler.level < this.level) {
            this.level = handler.level;
        }
    }

    removeHandler(handler: LevelHandler<MessageT, FormatT>) {
        let handlers = [];
        this.level = Level.ERROR;
        for (let _handler of this.handlers) {
            if (_handler != handler){
                handlers.push(_handler);
                if (_handler.level < this.level) {
                    this.level = _handler.level;
                }
            }
        }
        this.handlers = handlers;
    }
}

export abstract class LevelHandler<MessageT, FormatT> extends BaseHandler<MessageT, FormatT, Meta> {
    public level: number = Level.BASE;
}

export class ConsoleHandler<MessageT, FormatT> extends LevelHandler<MessageT,FormatT> {

    protected formatter?: BaseFormatter<MessageT, FormatT, Meta>;

    constructor() {
        super();
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
        this.setLevel = this.setLevel.bind(this);
    }

    handle(message: MessageT, meta: Meta): void {

        if (meta.level && meta.level >= this.level) {

            if (this.formatter) {

                let formattedMessage = this.formatter.format(message, meta);

                if (meta.level == Level.ERROR) {
                    console.error(formattedMessage);
                }
                else {
                    console.log(formattedMessage);
                }
            }
        }
    }

    setFormatter(formatter: BaseFormatter<MessageT, FormatT, Meta>) {
        this.formatter = formatter;
    }

    setLevel(level: Level) {
        this.level = level;
    }
}

export class Formatter<MessageT, FormatT> extends BaseFormatter<MessageT, FormatT, Meta> {

    private formatter: (message: MessageT, meta: IMeta) => FormatT;

    constructor(formatter: (message: MessageT, meta: IMeta) => FormatT) {
        super();
        this.formatter = formatter;
    }

    format(message: MessageT, meta: IMeta): FormatT {
        return this.formatter(message, meta);
    }
}

export let logger = new Logger<string, string>();