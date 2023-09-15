
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

    abstract format(message: MessageT, meta: MetadataT): FormatT;
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
        this.loggers = loggers;
        this.name = options.name;
        this.log = this.log.bind(this);
        this.addHandler = this.addHandler.bind(this);

        for (let logger of loggers) {
            logger.handlers = [];
        }
    }

    abstract log(message: MessageT, level: Level): void;

    addHandler(handler: Handler<MessageT, FormatT, MetadataT>) {
        this.handlers.push(handler);

        for (let logger of this.loggers) {
            logger.addHandler(handler);
        }
    }

    removeHandler(handler: Handler<MessageT, FormatT, MetadataT>) {
        let handlers = [];
        for (let _handler of this.handlers) {
            if (_handler != handler) {
                handlers.push(_handler);
            }
        }
        this.handlers = handlers;

        if (this.loggers) {
            for (let logger of this.loggers) {
                logger.removeHandler(handler);
            }
        }
    }
}

export abstract class LevelHandler<MessageT, FormatT, MetadataT> extends Handler<MessageT, FormatT, MetadataT> {
    public level: number = Level.BASE;

    setLevel(level: Level) {
        this.level = level;
    }
}