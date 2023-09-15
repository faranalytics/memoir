
export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export abstract class BaseFormatter<MessageT, FormatT, MetadataT> {

    constructor() {
        this.format = this.format.bind(this);
    }

    abstract format(message: MessageT, meta: MetadataT): FormatT;
}

export abstract class BaseHandler<MessageT, FormatT, MetadataT> {

    protected abstract formatter?: BaseFormatter<MessageT, FormatT, MetadataT>;

    constructor() {
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
    }

    public abstract handle(message: MessageT, meta: MetadataT): Promise<void> | void;

    setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetadataT>) {
        this.formatter = formatter;
    }
}

export interface BaseLoggerOptions {
    name: string;
}

export abstract class BaseLogger<MessageT, FormatT, MetadataT> {

    public handlers: Array<BaseHandler<MessageT, FormatT, MetadataT>> = [];
    protected loggers: Array<BaseLogger<MessageT, FormatT, MetadataT>>;
    protected name: string;

    constructor(options: BaseLoggerOptions, ...loggers: Array<BaseLogger<MessageT, FormatT, MetadataT>>) {
        this.loggers = loggers;
        this.name = options.name;
        this.log = this.log.bind(this);
        this.addHandler = this.addHandler.bind(this);

        for (let logger of loggers) {
            logger.handlers = [];
        }
    }

    abstract log(message: MessageT, level: Level): void;

    addHandler(handler: BaseHandler<MessageT, FormatT, MetadataT>) {
        this.handlers.push(handler);

        for (let logger of this.loggers) {
            logger.addHandler(handler);
        }
    }

    removeHandler(handler: BaseHandler<MessageT, FormatT, MetadataT>) {
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

export abstract class LevelHandler<MessageT, FormatT, MetadataT> extends BaseHandler<MessageT, FormatT, MetadataT> {
    public level: number = Level.BASE;

    setLevel(level: Level) {
        this.level = level;
    }
}