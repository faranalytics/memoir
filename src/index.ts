export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export interface Meta {
    level?: string;
    func?: string;
    url?: string;
    line?: string;
    col?: string;
}

export abstract class BaseFormatter<MessageT, FormatT, MetaT> {
    abstract format(message: MessageT, meta: MetaT, ...args: any): FormatT;
}

export abstract class BaseHandler<MessageT, FormatT, MetaT> {

    protected formatter?: BaseFormatter<MessageT, FormatT, MetaT>;

    abstract handle(message: MessageT, meta: MetaT, ...args: any): void;

    abstract setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetaT>): void;
}

export abstract class BaseLogger<MessageT, FormatT, MetaT> {

    protected handlers: Array<BaseHandler<MessageT, FormatT, MetaT>> = [];
    protected parent?: BaseLogger<MessageT, FormatT, MetaT>;

    constructor(parent?: BaseLogger<MessageT, FormatT, MetaT>) {
        this.parent = parent;
    }

    abstract log(message: MessageT, ...args: any): void;

    abstract addHandler(handler: BaseHandler<MessageT, FormatT, MetaT>): void;
}

export class Logger extends BaseLogger<string, string, Meta> {

    static parseStackTrace(stack: string | undefined): Meta {

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

    log(message: string, level: number): void {

        let parse = Logger.parseStackTrace(new Error().stack);

        if (this.handlers.length) {

            let meta = { ...{ level: Level[level] }, ...parse };

            for (let handler of this.handlers) {
                handler.handle(message, meta, level);
            }

            this.parent?.log(message, level);
        }
    }

    base(message: string) {
        this.log(message, Level.BASE);
    }

    debug(message: string) {
        this.log(message, Level.DEBUG);
    }

    info(message: string) {
        this.log(message, Level.INFO);
    }

    warn(message: string) {
        this.log(message, Level.WARN);
    }

    error(message: string) {
        this.log(message, Level.ERROR);
    }

    addHandler(handler: BaseHandler<string, string, Meta>) {
        this.handlers.push(handler);
    }

    removeHandler(handler: BaseHandler<string, string, Meta>) {
        this.handlers = this.handlers.filter((value)=> value !== handler);
    }
}

export class ConsoleHandler extends BaseHandler<string, string, Meta> {

    private level: number = Level.BASE;

    handle(message: string, meta: Meta, level: number): void {

        if (level >= this.level) {

            if (this.formatter) {
                message = this.formatter.format(message, meta);
            }

            if (level == Level.ERROR) {
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