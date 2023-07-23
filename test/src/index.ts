import { LevelLogger, ConsoleHandler, MetaFormatter, Level, IMeta, RotatingFileHandler } from 'memoir';

// Create an instance of a Logger.
let log = new LevelLogger<string, string>({ 'name': 'example 1' });

// Create an instance of a Handler.
let consoleHandler = new ConsoleHandler<string, string>();

let fileHandler = new RotatingFileHandler({ path: './test/test.log', rotations: 5, bytes: 10e3 });

// Set the Level of the handler.
consoleHandler.setLevel(Level.DEBUG);

// Create an instance of a Formatter.
// Pass a function to the constructor of the Formatter that will format the message and add metadata.
let formatter = new MetaFormatter<string, string>(
    (message: string, { name, level, func, url, line, col }: IMeta): string =>
        `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
);

// Set the Formatter on the Handler.
consoleHandler.setFormatter(formatter);
fileHandler.setFormatter(formatter);

// Add the Handler to the Logger.
log.addHandler(consoleHandler);
log.addHandler(fileHandler);

// Log a message.
log.info('Hello World.');
//  INFO:2022-12-30T00:22:05.981Z:undefined:26:5:Hello World.

for (let i = 0; i < 1e1; i++) {
    (function test() { log.info('Hello World.'); }());
}
// INFO:2022-12-30T00:22:43.073Z:test:28:24:Hello World.


// let objectLogger = new LevelLogger<object, string>({ name: 'example 2' });
// let objectHandler = new ConsoleHandler<object, string>();
// let objectFormatter = new MetaFormatter<object, string>((objMessage: object, { name, level, func, url, line, col }: IMeta) =>
//     `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`
// );

// objectHandler.setFormatter(objectFormatter);

// objectLogger.addHandler(objectHandler);

// objectLogger.info({ 'greeting': 'Hello World.' });
// // INFO:2022-12-30T00:21:13.664Z:undefined:33:14:{"greeting":"Hello World."}

// (function test() { objectLogger.info({ 'greeting': 'Hello World.' }); }());
// // INFO:2022-12-30T00:24:05.680Z:test:38:33:{"greeting":"Hello World."}

