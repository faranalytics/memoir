# Memoir

Memoir is a type checked logging facility with a simple and familiar interface - for server and client applications.  

## Usage

```js
import { Logger, Level, Formatter, ConsoleHandler, Meta } from 'memoir';

//  Create an instance of a Logger.
let log = new Logger<string, string>();

//  Create an instance of a Handler.
let handler = new ConsoleHandler<string, string>();

//  Set the Level of the handler.
handler.setLevel(Level.DEBUG);

//  Create an instance of a Formatter.
let formatter = new Formatter<string, string>(
    (message: string, { level, func, url, line, col }: Meta): string =>
        `${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
);
//  Pass a function to the constructor of the Formatter that will format the message and optionally add metadata.


//  The meta object contains: 
//  * the Level, 
//  * the name of the function, 
//  * the stack trace URL, 
//  * the line number, 
//  * and the column number. 
//  E.g., 
//  `${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}` 
//  will produce a log message:
//  INFO:2022-12-29T23:07:44.841Z:test:9:9:TEST


//  Set the Formatter on the Handler.
handler.setFormatter(formatter);

//  Add the Handler to the Logger.
log.addHandler(handler);

//  Log a message.
log.info('Hello World.');
// INFO:2022-12-30T00:22:05.981Z:undefined:26:5:Hello World.

(function test(){log.info('Hello World.');}());
//  INFO:2022-12-30T00:22:43.073Z:test:28:24:Hello World.
```

## Easily build a type checked custom logger.

```js
//  This simple logger will log a JavaScript *object* as a JSON *string*.
let objectLogger = new Logger<object, string>();
let objectHandler = new ConsoleHandler<object, string>();
let objectFormatter = new Formatter<object, string>(
    (objMessage, { level, func, url, line, col }) => 
    `${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`
    );

objectHandler.setFormatter(objectFormatter);

objectLogger.addHandler(objectHandler);

objectLogger.info({'message':'Hello World.'}); 
//  INFO:2022-12-30T00:21:13.664Z:undefined:33:14:{"message":"Hello World."}

(function test(){objectLogger.info({'message':'Hello World.'});}());
//  INFO:2022-12-30T00:24:05.680Z:test:38:33:{"message":"Hello World."}
```