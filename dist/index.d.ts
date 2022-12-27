export declare enum Level {
    BASE = -100,
    DEBUG = 100,
    INFO = 1000,
    WARN = 10000,
    ERROR = 100000
}
export declare abstract class Formatter<T, S> {
    abstract format(message: T): S;
}
export declare abstract class Handler<T, S> {
    protected formatter?: Formatter<T, S>;
    private level?;
    constructor(level?: number);
    abstract handle(message: T): void;
    setFormatter(formatter: Formatter<T, S>): void;
    setLevel(level: number): void;
}
//# sourceMappingURL=index.d.ts.map