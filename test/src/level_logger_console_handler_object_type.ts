import { LevelLogger, ConsoleHandler, MetadataFormatter, Level, Metadata } from 'memoir';

let objectLogger = new LevelLogger<object, string>({ name: 'Console Handler Example 2' , level: Level.INFO});
let objectHandler = new ConsoleHandler<object, string>();
let objectFormatter = new MetadataFormatter<object, string>((objMessage: object, { name, level, func, url, line, col }: Metadata) =>
    `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`
);

objectHandler.setFormatter(objectFormatter);
objectLogger.addHandler(objectHandler);

objectLogger.info?.({ 'greeting': 'Hello World.' });
(function test() { objectLogger.info?.({ 'greeting': 'Hello World.' }); }());
