import { rootLogger, Logger, Level, StringFormatter, ConsoleHandler, Meta } from 'memoir';

let log = new Logger(rootLogger);

let handler = new ConsoleHandler();

handler.setLevel(Level.DEBUG);

let formatter = new StringFormatter(
    (message: string, meta: Meta): string => `${new Date().toISOString()}:${meta.func}:${meta.url}:${meta.line}:${meta.col}:${message}`
);

handler.setFormatter(formatter);

log.addHandler(handler);

(function test() {
    log.info('TEST1');
})()

log.info('TEST2')