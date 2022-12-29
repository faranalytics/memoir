export var Level;
(function (Level) {
    Level[Level["BASE"] = -100] = "BASE";
    Level[Level["DEBUG"] = 100] = "DEBUG";
    Level[Level["INFO"] = 1000] = "INFO";
    Level[Level["WARN"] = 10000] = "WARN";
    Level[Level["ERROR"] = 100000] = "ERROR";
})(Level || (Level = {}));
export class BaseFormatter {
}
export class BaseHandler {
    formatter;
}
export class BaseLogger {
    handlers = [];
    parent;
    constructor(parent) {
        this.parent = parent;
    }
}
export class Logger extends BaseLogger {
    static parseStackTrace(error) {
        let match = error?.stack?.match(/^[^\n]+?\n[^\n]+?\n\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);
        let groups = match?.groups;
        if (groups) {
            return {
                error,
                func: groups['func'],
                url: groups['url'],
                line: groups['line'],
                col: groups['col']
            };
        }
    }
    log(message, meta) {
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
    base(message) {
        this.log(message, { level: Level.BASE, error: new Error() });
    }
    debug(message) {
        this.log(message, { level: Level.DEBUG, error: new Error() });
    }
    info(message) {
        this.log(message, { level: Level.INFO, error: new Error() });
    }
    warn(message) {
        this.log(message, { level: Level.WARN, error: new Error() });
    }
    error(message) {
        this.log(message, { level: Level.ERROR, error: new Error() });
    }
    addHandler(handler) {
        this.handlers.push(handler);
    }
}
export class ConsoleHandler extends BaseHandler {
    level = Level.BASE;
    handle(message, meta) {
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
    setFormatter(formatter) {
        this.formatter = formatter;
    }
    setLevel(level) {
        this.level = level;
    }
}
export class StringFormatter extends BaseFormatter {
    formatter;
    constructor(formatter) {
        super();
        this.formatter = formatter;
    }
    format(message, meta) {
        return this.formatter(message, meta);
    }
}
export let rootLogger = new Logger();
