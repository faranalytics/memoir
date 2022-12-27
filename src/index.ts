export enum Level {
    BASE = -10e1,
    DEBUG = 10e1,
    INFO = 10e2,
    WARN = 10e3,
    ERROR = 10e4
}

export abstract class Formatter<T, S> {
    abstract format(message: T): S;
}

export abstract class Handler<T, S> {

    protected formatter?: Formatter<T, S>;
    private level?: number;

    constructor(level?: number) {
        this.level = level;
    }

    abstract handle(message: T): void;

    setFormatter(formatter: Formatter<T, S>) {
        this.formatter = formatter;
    }

    setLevel(level: number) {
        this.level = level;
    }
}

class StringFormatter extends Formatter<string, string> {

    format(message: string): string {
        return message;
    }
}

class ObjectFormatter extends Formatter<object, string> {

    format(message: object): string {
        return JSON.stringify(message);
    }
}

class ConsoleHandler extends Handler<string, string> {

    handle(message: string) {
        if (this.formatter) {
            message = this.formatter.format(message);

            console.log(message);
        }
    }
}

class Logger<T, S> {

    private handlers: Array<Handler<T, S>>;
    private parent?: Logger<T, S>;

    constructor(parent?: Logger<T, S>) {
        this.parent = parent;
        this.handlers = [];
    }

    addHandler(handler: Handler<T, S>) {
        this.handlers.push(handler);
    }

    log(message: T, level: number = Level.BASE-1) {

        if (this.handlers) {
            for (let handler of this?.handlers) {
                handler.handle(message);
            }
        }

        this.parent?.log(message, level);
    }
}

class LevelLogger extends Logger<string, string> {

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

}
