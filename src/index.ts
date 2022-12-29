export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export interface Meta {
    level: Level;
    error?: Error;
    func?: string;
    url?: string;
    line?: number;
    col?: number;
}

export abstract class BaseFormatter<MessageT, FormatT, MetaT> {
    abstract format(message: MessageT, meta: MetaT): FormatT;
}

export abstract class BaseHandler<MessageT, FormatT, MetaT> {

    protected formatter?: BaseFormatter<MessageT, FormatT, MetaT>;

    abstract handle(message: MessageT, meta: MetaT): void;

    abstract setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetaT>): void;
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

export class Logger extends BaseLogger<string, string, Meta> {

    static parseStackTrace(error: Error): any {
        let match = error?.stack?.match(/^[^\n]+?\n[^\n]+?\n\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);

        let groups = match?.groups;

        if (groups) {
            return {
                error,
                func: groups['func'],
                url: groups['url'],
                line: groups['line'],
                col: groups['col']
            }
        }
    }

    log(message: string, meta: Meta) {

        if (this.handlers.length) {
            if (meta.error) {
                meta = { ...meta, ...Logger.parseStackTrace(meta.error) };
            }

            for (let handler of this.handlers) {
                handler.handle(message, meta);
            }

            this.parent?.log(message, meta);
        }
    }

    base(message: string) {
        this.log(message, { level: Level.BASE, error: new Error() });
    }

    debug(message: string) {
        this.log(message, { level: Level.DEBUG, error: new Error() });
    }

    info(message: string) {
        this.log(message, { level: Level.INFO, error: new Error() });
    }

    warn(message: string) {
        this.log(message, { level: Level.WARN, error: new Error() });
    }

    error(message: string) {
        this.log(message, { level: Level.ERROR, error: new Error() });
    }

    addHandler(handler: BaseHandler<string, string, Meta>) {
        this.handlers.push(handler);
    }
}

export class ConsoleHandler extends BaseHandler<string, string, Meta> {

    private level: number = Level.BASE;

    handle(message: string, meta: Meta): void {

        if (meta.level > this.level) {

            if (this.formatter) {
                message = this.formatter.format(message, meta);
            }

            if (meta.level == Level.ERROR) {
                console.error(message);
            }
            else {
                console.log(message);
            }
        }
    }

    setFormatter(formatter: BaseFormatter<string, string, Meta>) {
        this.formatter = formatter;
    }

    setLevel(level: Level) {
        this.level = level;
    }
}

export class StringFormatter extends BaseFormatter<string, string, Meta> {

    private formatter: (message: string, meta: Meta) => string;

    constructor(formatter: (message: string, meta: Meta) => string) {
        super();

        this.formatter = formatter;
    }

    format(message: string, meta: Meta): string {
        return this.formatter(message, meta);
    }
}

export let rootLogger = new Logger();