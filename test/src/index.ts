import { Logger, ConsoleHandler, Formatter, Level, IMeta, RotatingFileHandler } from 'memoir';

//  Create an instance of a Logger.
let log = new Logger<string, string>();

//  Create an instance of a Handler.
let handler = new ConsoleHandler<string, string>();

let fileHandler = new RotatingFileHandler({path: './test.log', bytes: 10e20})

//  Set the Level of the handler.
handler.setLevel(Level.DEBUG);

//  Create an instance of a Formatter.
//  Pass a function to the constructor of the Formatter that will format the message and add metadata.
let formatter = new Formatter<string, string>(
    (message: string, { level, func, url, line, col }: IMeta): string =>
        `${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
);

//  Set the Formatter on the Handler.
handler.setFormatter(formatter);
fileHandler.setFormatter(formatter);

//  Add the Handler to the Logger.
log.addHandler(handler);
log.addHandler(fileHandler);

//  Log a message.
log.info('Hello World.');
//  INFO:2022-12-30T00:22:05.981Z:undefined:26:5:Hello World.

for (let i = 0; i < 3; i++) {
    (function test(){log.info('Hello World.');}());
}
//  INFO:2022-12-30T00:22:43.073Z:test:28:24:Hello World.
