export { BaseLogger, BaseHandler, BaseFormatter } from './base.js';
import { BaseLogger, BaseHandler, BaseFormatter } from './base.js';
export var Level;
(function (Level) {
    Level[Level["BASE"] = -100] = "BASE";
    Level[Level["DEBUG"] = 100] = "DEBUG";
    Level[Level["INFO"] = 1000] = "INFO";
    Level[Level["WARN"] = 10000] = "WARN";
    Level[Level["ERROR"] = 100000] = "ERROR";
})(Level || (Level = {}));
export class Meta {
    error;
    Level;
    level;
    func;
    url;
    line;
    col;
    constructor(level) {
        this.Level = level;
        this.level = Level[level];
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
    log(message, meta) {
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
    base(message) {
        this.log(message, new Meta(Level.BASE));
    }
    debug(message) {
        this.log(message, new Meta(Level.DEBUG));
    }
    info(message) {
        this.log(message, new Meta(Level.INFO));
    }
    warn(message) {
        this.log(message, new Meta(Level.WARN));
    }
    error(message) {
        this.log(message, new Meta(Level.ERROR));
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
    handle(message, meta) {
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
export let logger = new Logger();
