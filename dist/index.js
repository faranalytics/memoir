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
}
export class BaseLogger {
    handlers = [];
    parent;
    constructor(parent) {
        this.parent = parent;
    }
}
export class Logger extends BaseLogger {
    static parseStackTrace(stack) {
        let match = stack?.match(/^[^\n]+?\n[^\n]+?\n[^\n]+?\n\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);
        let groups = match?.groups;
        if (groups) {
            return {
                func: groups['func'],
                url: groups['url'],
                line: groups['line'],
                col: groups['col']
            };
        }
        return {};
    }
    log(message, level) {
        let parse = Logger.parseStackTrace(new Error().stack);
        if (this.handlers.length) {
            let meta = { ...{ level: Level[level] }, ...parse };
            for (let handler of this.handlers) {
                handler.handle(message, meta, level);
            }
            this.parent?.log(message, level);
        }
    }
    base(message) {
        this.log(message, Level.BASE);
    }
    debug(message) {
        this.log(message, Level.DEBUG);
    }
    info(message) {
        this.log(message, Level.INFO);
    }
    warn(message) {
        this.log(message, Level.WARN);
    }
    error(message) {
        this.log(message, Level.ERROR);
    }
    addHandler(handler) {
        this.handlers.push(handler);
    }
    removeHandler(handler) {
        this.handlers = this.handlers.filter((value) => value !== handler);
    }
}
export class ConsoleHandler extends BaseHandler {
    level = Level.BASE;
    formatter;
    handle(message, meta, level) {
        if (level >= this.level) {
            if (this.formatter) {
                let formattedMessage = this.formatter.format(message, meta);
                if (level == Level.ERROR) {
                    console.error(formattedMessage);
                }
                else {
                    console.log(formattedMessage);
                }
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
export class Formatter extends BaseFormatter {
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
