export { BaseLogger, BaseHandler, BaseFormatter } from './base.js';
export { RotatingFileHandler } from './node.js';
import { BaseLogger, BaseHandler, BaseFormatter } from './base.js';
export declare enum Level {
    BASE = -100,
    DEBUG = 100,
    INFO = 1000,
    WARN = 10000,
    ERROR = 100000
}
export interface IMeta {
    level: number;
    func?: string;
    url?: string;
    line?: string;
    col?: string;
}
export declare class Meta implements IMeta {
    level: number;
    error?: Error;
    func?: string;
    url?: string;
    line?: string;
    col?: string;
    constructor(level: Level);
}
export declare class Logger<MessageT, FormatT> extends BaseLogger<MessageT, FormatT, Meta> {
    static parseStackTrace(stack: string | undefined): {
        func?: string;
        url?: string;
        line?: string;
        col?: string;
    };
    constructor(parent?: BaseLogger<MessageT, FormatT, Meta>);
    log(message: MessageT, meta: Meta): void;
    base(message: MessageT): void;
    debug(message: MessageT): void;
    info(message: MessageT): void;
    warn(message: MessageT): void;
    error(message: MessageT): void;
    addHandler(handler: BaseHandler<MessageT, FormatT, Meta>): void;
    removeHandler(handler: BaseHandler<MessageT, FormatT, Meta>): void;
}
export declare class ConsoleHandler<MessageT, FormatT> extends BaseHandler<MessageT, FormatT, Meta> {
    private level;
    protected formatter?: BaseFormatter<MessageT, FormatT, Meta>;
    constructor();
    handle(message: MessageT, meta: Meta): void;
    setFormatter(formatter: BaseFormatter<MessageT, FormatT, Meta>): void;
    setLevel(level: Level): void;
}
export declare class Formatter<MessageT, FormatT> extends BaseFormatter<MessageT, FormatT, Meta> {
    private formatter;
    constructor(formatter: (message: MessageT, meta: IMeta) => FormatT);
    format(message: MessageT, meta: IMeta): FormatT;
}
export declare let logger: Logger<string, string>;
//# sourceMappingURL=index.d.ts.map