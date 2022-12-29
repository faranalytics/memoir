import { rootLogger, Logger, Level, StringFormatter, ConsoleHandler, Meta } from 'memoir';

let log = new Logger(rootLogger);

let handler = new ConsoleHandler();

handler.setLevel(Level.DEBUG);

let formatter = new StringFormatter(
    (message: string, {level, func, url, line, col}: Meta): string => 
    `${level}:${new Date().toISOString()}:${func}:${url}:${line}:${col}:${message}`
);

handler.setFormatter(formatter);

log.addHandler(handler);

(function test() {
    log.info('TEST1');
})();

log.debug('TEST2');