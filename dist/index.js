export var Level;
(function (Level) {
    Level[Level["BASE"] = -100] = "BASE";
    Level[Level["DEBUG"] = 100] = "DEBUG";
    Level[Level["INFO"] = 1000] = "INFO";
    Level[Level["WARN"] = 10000] = "WARN";
    Level[Level["ERROR"] = 100000] = "ERROR";
})(Level || (Level = {}));
export class Formatter {
}
export class Handler {
    formatter;
    level;
    constructor(level) {
        this.level = level;
    }
    setFormatter(formatter) {
        this.formatter = formatter;
    }
    setLevel(level) {
        this.level = level;
    }
}
class StringFormatter extends Formatter {
    format(message) {
        return message;
    }
}
class ObjectFormatter extends Formatter {
    format(message) {
        return JSON.stringify(message);
    }
}
class ConsoleHandler extends Handler {
    handle(message) {
        if (this.formatter) {
            message = this.formatter.format(message);
            console.log(message);
        }
    }
}
class Logger {
    handlers;
    parent;
    constructor(parent) {
        this.parent = parent;
        this.handlers = [];
    }
    addHandler(handler) {
        this.handlers.push(handler);
    }
    log(message, level = Level.BASE - 1) {
        if (this.handlers) {
            for (let handler of this?.handlers) {
                handler.handle(message);
            }
        }
        this.parent?.log(message, level);
    }
}
class LevelLogger extends Logger {
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
}
