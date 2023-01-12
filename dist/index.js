export { BaseLogger, BaseHandler, BaseFormatter } from './base.js';
export { RotatingFileHandler } from './node.js';
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
    level;
    error;
    func;
    url;
    line;
    col;
    constructor(level) {
        this.level = level;
    }
}
export class Logger extends BaseLogger {
    static parseStackTrace(stack) {
        let match = stack?.match(/^([^\n]+?\n){3}\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);
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
    level = Level.ERROR;
    handlers = [];
    constructor(parent) {
        super(parent);
        this.log = this.log.bind(this);
        this.base = this.base.bind(this);
        this.debug = this.debug.bind(this);
        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
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
        if (handler.level < this.level) {
            this.level = handler.level;
        }
    }
    removeHandler(handler) {
        let handlers = [];
        this.level = Level.ERROR;
        for (let _handler of this.handlers) {
            if (_handler != handler) {
                handlers.push(_handler);
                if (_handler.level < this.level) {
                    this.level = _handler.level;
                }
            }
        }
        this.handlers = handlers;
    }
}
export class LevelHandler extends BaseHandler {
    level = Level.BASE;
}
export class ConsoleHandler extends LevelHandler {
    formatter;
    constructor() {
        super();
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
        this.setLevel = this.setLevel.bind(this);
    }
    handle(message, meta) {
        if (meta.level && meta.level >= this.level) {
            if (this.formatter) {
                let formattedMessage = this.formatter.format(message, meta);
                if (meta.level == Level.ERROR) {
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
