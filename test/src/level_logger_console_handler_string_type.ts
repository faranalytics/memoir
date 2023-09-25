import { LevelLogger, ConsoleHandler, MetadataFormatter, Level, Metadata } from 'memoir';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatter = (message: string, { name, level, func, url, line, col }: Metadata): string =>
    `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`;

const log = new LevelLogger<string, string>({ name: 'Console Handler Example 1', level: Level.INFO }); // Create an instance of a Logger.
const consoleHandler = new ConsoleHandler<string, string>(); // Create an instance of a Handler.
const metadataFormatter = new MetadataFormatter<string, string>({ formatter }); // Create an instance of a Formatter.

consoleHandler.setLevel(Level.DEBUG); // Set the Level of the Handler.
consoleHandler.setFormatter(metadataFormatter); // Set the Formatter on the Handler.
log.addHandler(consoleHandler); // Add the Handler to the Logger.

log.debug?.("Because the LevelLogger's `level` property is set to Level.INFO, this method is never called.");
log.info?.('Hello, World!'); // Log a Hello World to the console.
(function test() { log.info?.('Hello, World!'); }());
log.setLevel(Level.DEBUG);
log.debug?.("The LevelLogger's `level` property has been set to Level.DEBUG; hence, the method is called.");
