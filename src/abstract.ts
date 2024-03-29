
export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export abstract class Formatter<MessageT, FormatT, MetadataT> {

    constructor() {
        this.format = this.format.bind(this);
    }

    public abstract format(message: MessageT, meta: MetadataT): FormatT;
}

export abstract class Handler<MessageT, FormatT, MetadataT> {

    protected abstract formatter?: Formatter<MessageT, FormatT, MetadataT>;

    constructor() {
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
    }

    public abstract handle(message: MessageT, meta: MetadataT): Promise<void> | void;

    public setFormatter(formatter: Formatter<MessageT, FormatT, MetadataT>) {
        this.formatter = formatter;
    }
}

export interface LoggerOptions {
    name: string;
}

export abstract class Logger<MessageT, FormatT, MetadataT> {

    public handlers: Array<Handler<MessageT, FormatT, MetadataT>> = [];
    protected loggers: Array<Logger<MessageT, FormatT, MetadataT>>;
    protected name: string;

    constructor(options: LoggerOptions, ...loggers: Array<Logger<MessageT, FormatT, MetadataT>>) {
        this.log = this.log.bind(this);
        this.addHandler = this.addHandler.bind(this);

        this.loggers = loggers;
        this.name = options.name;

        for (const logger of loggers) {
            logger.handlers = [];
        }
    }

    public abstract log(level: Level, message: MessageT): void;

    public addHandler(handler: Handler<MessageT, FormatT, MetadataT>): void {
        this.handlers.push(handler);

        for (const logger of this.loggers) {
            logger.addHandler(handler);
        }
    }

    public removeHandler(handler: Handler<MessageT, FormatT, MetadataT>): void {
        const handlers = [];
        for (const _handler of this.handlers) {
            if (_handler != handler) {
                handlers.push(_handler);
            }
        }
        this.handlers = handlers;

        if (this.loggers) {
            for (const logger of this.loggers) {
                logger.removeHandler(handler);
            }
        }
    }
}
