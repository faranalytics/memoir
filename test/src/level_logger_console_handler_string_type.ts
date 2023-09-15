import { LevelLogger, ConsoleHandler, MetadataFormatter, Level, Metadata } from 'memoir';

let log = new LevelLogger<string, string>({ name: 'Console Handler Example 1', level: Level.INFO }); // Create an instance of a Logger.
let consoleHandler = new ConsoleHandler<string, string>(); // Create an instance of a Handler.
let formatter = new MetadataFormatter<string, string>(
    // Pass a function to the constructor of the Formatter that will format the message and add metadata.
    (message: string, { name, level, func, url, line, col }: Metadata): string =>
        `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
); // Create an instance of a Formatter.

consoleHandler.setLevel(Level.DEBUG); // Set the Level of the Handler.
consoleHandler.setFormatter(formatter); // Set the Formatter on the Handler.
log.addHandler(consoleHandler); // Add the Handler to the Logger.

log.debug?.("Because the LevelLogger's `level` property is set to Level.INFO, this method is never called.");
log.info?.('Hello World.'); // Log a Hello World to the console.
(function test() { log.info?.('Hello World.'); }());
log.setLevel(Level.DEBUG);
log.debug?.("The LevelLogger's `level` property has been set to Level.DEBUG; hence, the method is called.");
