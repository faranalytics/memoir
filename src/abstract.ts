
export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export abstract class BaseFormatter<MessageT, FormatT, MetaT> {

    constructor() {
        this.format = this.format.bind(this);
    }
    
    abstract format(message: MessageT, meta: MetaT): FormatT;
}

export abstract class BaseHandler<MessageT, FormatT, MetaT> {

    protected abstract formatter?: BaseFormatter<MessageT, FormatT, MetaT>;

    constructor() {
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
    }

    public abstract handle(message: MessageT, meta: MetaT): Promise<void> | void;

    setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetaT>) {
        this.formatter = formatter;
    }
}

export interface BaseLoggerOptions {
    name: string;
}

export abstract class BaseLogger<MessageT, FormatT, MetaT> {

    public handlers: Array<BaseHandler<MessageT, FormatT, MetaT>> = [];
    protected loggers: Array<BaseLogger<MessageT, FormatT, MetaT>>;
    protected name: string;
    
    constructor(options: BaseLoggerOptions, ...loggers: Array<BaseLogger<MessageT, FormatT, MetaT>>) {
        this.loggers = loggers;
        this.name = options.name;
        this.log = this.log.bind(this);
        this.addHandler = this.addHandler.bind(this);

        for (let logger of loggers) {
            logger.handlers = [];
        }
    }

    abstract log(message: MessageT, meta: MetaT): void;

    addHandler(handler: BaseHandler<MessageT, FormatT, MetaT>) {
        this.handlers.push(handler);

        if (this.loggers) {
            for (let logger of this.loggers) {
                logger.addHandler(handler);
            }
        }
    }

    removeHandler(handler: BaseHandler<MessageT, FormatT, MetaT>) {
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

export abstract class LevelHandler<MessageT, FormatT, MetaT> extends BaseHandler<MessageT, FormatT, MetaT> {
    public level: number = Level.BASE;

    setLevel(level: Level) {
        this.level = level;
    }
}