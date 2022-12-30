export declare enum Level {
    BASE = -100,
    DEBUG = 100,
    INFO = 1000,
    WARN = 10000,
    ERROR = 100000
}
export interface Meta {
    level?: string;
    func?: string;
    url?: string;
    line?: string;
    col?: string;
}
export declare abstract class BaseFormatter<MessageT, FormatT, MetaT> {
    abstract format(message: MessageT, meta: MetaT, ...args: any): FormatT;
}
export declare abstract class BaseHandler<MessageT, FormatT, MetaT> {
    protected abstract formatter?: BaseFormatter<MessageT, FormatT, MetaT>;
    abstract handle(message: MessageT, meta: MetaT, ...args: any): void;
    abstract setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetaT>): void;
}
export declare abstract class BaseLogger<MessageT, FormatT, MetaT> {
    protected handlers: Array<BaseHandler<MessageT, FormatT, MetaT>>;
    protected parent?: BaseLogger<MessageT, FormatT, MetaT>;
    constructor(parent?: BaseLogger<MessageT, FormatT, MetaT>);
    abstract log(message: MessageT, ...args: any): void;
    abstract addHandler(handler: BaseHandler<MessageT, FormatT, MetaT>): void;
}
export declare class Logger<MessageT, FormatT> extends BaseLogger<MessageT, FormatT, Meta> {
    static parseStackTrace(stack: string | undefined): Meta;
    log(message: MessageT, level: number): void;
    base(message: MessageT): void;
    debug(message: MessageT): void;
    info(message: MessageT): void;
    warn(message: MessageT): void;
    error(message: MessageT): void;
    addHandler(handler: BaseHandler<MessageT, FormatT, Meta>): void;
    removeHandler(handler: BaseHandler<string, string, Meta>): void;
}
export declare class ConsoleHandler<MessageT, FormatT> extends BaseHandler<MessageT, FormatT, Meta> {
    private level;
    protected formatter?: BaseFormatter<MessageT, FormatT, Meta>;
    handle(message: MessageT, meta: Meta, level: number): void;
    setFormatter(formatter: BaseFormatter<MessageT, FormatT, Meta>): void;
    setLevel(level: Level): void;
}
export declare class Formatter<MessageT, FormatT> extends BaseFormatter<MessageT, FormatT, Meta> {
    private formatter;
    constructor(formatter: (message: MessageT, meta: Meta) => FormatT);
    format(message: MessageT, meta: Meta): FormatT;
}
export declare let rootLogger: Logger<string, string>;
//# sourceMappingURL=index.d.ts.map