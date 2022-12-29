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
    protected formatter?: BaseFormatter<MessageT, FormatT, MetaT>;
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
export declare class Logger extends BaseLogger<string, string, Meta> {
    static parseStackTrace(stack: string | undefined): Meta;
    log(message: string, level: number): void;
    base(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    addHandler(handler: BaseHandler<string, string, Meta>): void;
    removeHandler(handler: BaseHandler<string, string, Meta>): void;
}
export declare class ConsoleHandler extends BaseHandler<string, string, Meta> {
    private level;
    handle(message: string, meta: Meta, level: number): void;
    setFormatter(formatter: BaseFormatter<string, string, Meta>): void;
    setLevel(level: Level): void;
}
export declare class StringFormatter extends BaseFormatter<string, string, Meta> {
    private formatter;
    constructor(formatter: (message: string, meta: Meta) => string);
    format(message: string, meta: Meta): string;
}
export declare let rootLogger: Logger;
//# sourceMappingURL=index.d.ts.map