import { LevelLogger, ConsoleHandler, MetadataFormatter, Metadata } from 'memoir';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatter = (objMessage: object, { name, level, func, url, line, col }: Metadata) =>
    `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`;

const objectLogger = new LevelLogger<object, string>({ name: 'Console Handler Example 2' });
const objectHandler = new ConsoleHandler<object, string>();
const objectFormatter = new MetadataFormatter<object, string>({ formatter });

objectHandler.setFormatter(objectFormatter);
objectLogger.addHandler(objectHandler);

objectLogger.info?.({ 'greeting': 'Hello, World!' });
(function test() { objectLogger.info?.({ 'greeting': 'Hello, World!' }); }());
