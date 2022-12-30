export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export interface IMeta {
    level?: string;
    func?: string;
    url?: string;
    line?: string;
    col?: string;
}

export class Meta implements IMeta {
    error?: Error;
    Level?: Level;
    level?: string;
    func?: string;
    url?: string;
    line?: string;
    col?: string;

    constructor(level: Level) {
        this.Level = level;
        this.level = Level[level];
    }
}

export abstract class BaseFormatter<MessageT, FormatT, MetaT> {
    abstract format(message: MessageT, meta: MetaT): FormatT;
}

export abstract class BaseHandler<MessageT, FormatT, MetaT> {

    protected abstract formatter?: BaseFormatter<MessageT, FormatT, MetaT>;

    public abstract handle(message: MessageT, meta: MetaT): void;

    public abstract setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetaT>): void;
}

export abstract class BaseLogger<MessageT, FormatT, MetaT> {

    protected handlers: Array<BaseHandler<MessageT, FormatT, MetaT>> = [];
    protected parent?: BaseLogger<MessageT, FormatT, MetaT>;

    constructor(parent?: BaseLogger<MessageT, FormatT, MetaT>) {
        this.parent = parent;
    }

    abstract log(message: MessageT, meta: MetaT): void;

    abstract addHandler(handler: BaseHandler<MessageT, FormatT, MetaT>): void;
}

export class Logger<MessageT, FormatT> extends BaseLogger<MessageT, FormatT, Meta> {

    static parseStackTrace(stack: string | undefined): IMeta {

        let match = stack?.match(/^[^\n]+?\n[^\n]+?\n[^\n]+?\n\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);

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

    addHandler(handler: BaseHandler<MessageT, FormatT, Meta>) {
        this.handlers.push(handler);
    }

    removeHandler(handler: BaseHandler<MessageT, FormatT, Meta>) {
        this.handlers = this.handlers.filter((value) => value !== handler);
    }
}

export class ConsoleHandler<MessageT, FormatT> extends BaseHandler<MessageT, FormatT, Meta> {

    private level: number = Level.BASE;
    protected formatter?: BaseFormatter<MessageT, FormatT, Meta>;

    handle(message: MessageT, meta: Meta): void {

        if (meta.Level && meta.Level >= this.level) {

            if (this.formatter) {

                let formattedMessage = this.formatter.format(message, meta);

                if (meta.Level == Level.ERROR) {
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

    private formatter: (message: MessageT, meta: Meta) => FormatT;

    constructor(formatter: (message: MessageT, meta: Meta) => FormatT) {
        super();

        this.formatter = formatter;
    }

    format(message: MessageT, meta: Meta): FormatT {
        return this.formatter(message, meta);
    }
}

export let logger = new Logger<string, string>();