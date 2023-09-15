import { LevelLogger, ConsoleHandler, MetadataFormatter, Level, IMetadata, RotatingFileHandler } from 'memoir';

let log = new LevelLogger<string, string>({ 'name': 'example 1' , level:Level.INFO}); // Create an instance of a Logger.
let consoleHandler = new ConsoleHandler<string, string>(); // Create an instance of a Handler.
consoleHandler.setLevel(Level.DEBUG); // Set the Level of the handler.
// Create an instance of a Formatter.
// Pass a function to the constructor of the Formatter that will format the message and add metadata.
let formatter = new MetadataFormatter<string, string>(
    (message: string, { name, level, func, url, line, col }: IMetadata): string =>
        `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
);
consoleHandler.setFormatter(formatter); // Set the Formatter on the Handler.
log.addHandler(consoleHandler); // Add the Handler to the Logger.

log.debug?.('Because the `level` is set to Level.INFO, this method is never called.');
log.info?.('Hello World.'); // Log a Hello World to the console.
(function test() { log.info?.('Hello World.'); }());
log.setLevel(Level.DEBUG);
log.debug?.('Now the `level` has been set to Level.DEBUG; hence, this method is called.');

/*Output:
example 1:INFO:2023-09-15T04:23:20.088Z:undefined:11:11:Hello World.
example 1:INFO:2023-09-15T04:23:20.095Z:test:13:30:Hello World.
example 1:DEBUG:2023-09-15T04:23:20.095Z:undefined:16:12:Now the `level` has been set to Level.DEBUG; hence, this method is called.
*/

// let objectLogger = new LevelLogger<object, string>({ name: 'example 2' , level: Level.DEBUG});
// let objectHandler = new ConsoleHandler<object, string>();
// let objectFormatter = new MetadataFormatter<object, string>((objMessage: object, { name, level, func, url, line, col }: IMetadata) =>
//     `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`
// );

// objectHandler.setFormatter(objectFormatter);

// objectLogger.addHandler(objectHandler);

// objectLogger.info?.({ 'greeting': 'Hello World.' });
// // INFO:2022-12-30T00:21:13.664Z:undefined:33:14:{"greeting":"Hello World."}

// (function test() { objectLogger.info?.({ 'greeting': 'Hello World.' }); }());
// // INFO:2022-12-30T00:24:05.680Z:test:38:33:{"greeting":"Hello World."}

