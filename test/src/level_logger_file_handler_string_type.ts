import { LevelLogger, MetadataFormatter, Level, Metadata, RotatingFileHandler } from 'memoir';

const log = new LevelLogger<string, string>({ name: 'Rotating File Handler Example', level: Level.INFO }); // Create an instance of a Logger.
const fileHandler = new RotatingFileHandler({ path: './test.log', rotations: 5}); // Create an instance of a Handler.
const formatter = new MetadataFormatter<string, string>(
    // Pass a function to the constructor of the Formatter that will format the message and add metadata.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (message: string, { name, level, func, url, line, col }: Metadata): string =>
        `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
); // Create an instance of a Formatter.

fileHandler.setLevel(Level.DEBUG); // Set the Level of the Handler.
fileHandler.setFormatter(formatter); // Set the Formatter on the Handler.
log.addHandler(fileHandler); // Add the Handler to the Logger.

log.info?.('Hello World.'); // Log a Hello World to the console.
(function test() { log.info?.('Hello World.'); }());
