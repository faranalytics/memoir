# Memoir

Memoir is a type-checked asynchronous logging facility with a simple and familiar interface.

## Install

```
npm install memoir
```

## Usage

```js
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
    (message: string, { name, level, func, url, line, col }: IMeta): string => {
        return `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
    }
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


let objectLogger = new LevelLogger<object, string>({ name: 'example 2' });
let objectHandler = new ConsoleHandler<object, string>();
let objectFormatter = new MetaFormatter<object, string>((objMessage: object, { name, level, func, url, line, col }: IMeta) => {
    return `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`
});

objectHandler.setFormatter(objectFormatter);

objectLogger.addHandler(objectHandler);

objectLogger.info({ 'greeting': 'Hello World.' });
// INFO:2022-12-30T00:21:13.664Z:undefined:33:14:{"greeting":"Hello World."}

(function test() { objectLogger.info({ 'greeting': 'Hello World.' }); }());
// INFO:2022-12-30T00:24:05.680Z:test:38:33:{"greeting":"Hello World."}

```

## The Meta Object.

The formatter function passed to the constructor of the MetaFormatter can have the type:

`(formatter: (message: MessageT, meta: Meta) => FormatT`

The interface to the meta object contains the properties:
* name: the name of the Logger.
* level: the Level, 
* func: the name of the function, 
* url: the stack trace URL,
* line: the line number,
* col: the column number. 

## How to construct a custom type-checked logger.

This logger will log a JavaScript *object* to the console as a JSON *string*.  The formatter will add the Logger Name, Date, function, line number, and column number to the log message.

```js
let objectLogger = new LevelLogger<object, string>();
let objectHandler = new ConsoleHandler<object, string>();
let objectFormatter = new Formatter<object, string>(
    (objMessage, { level, func, url, line, col }) => 
    `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`
    );

objectHandler.setFormatter(objectFormatter);

objectLogger.addHandler(objectHandler);

objectLogger.info({'greeting':'Hello World.'}); 
//  INFO:2022-12-30T00:21:13.664Z:undefined:33:14:{"greeting":"Hello World."}

(function test(){objectLogger.info({'greeting':'Hello World.'});}());
//  INFO:2022-12-30T00:24:05.680Z:test:38:33:{"greeting":"Hello World."}
```

## How to build a custom type-checked Handler.

1. Extend the BaseHandler.
2. Implement the Handler method.
3. Add the Handler to a type compatible Logger.

```js
import { BaseHandler, BaseFormatter, Meta } from 'memoir';

export class CustomHandler extends BaseHandler<string, string, Meta> {

    private level: number = Level.BASE;
    protected formatter?: BaseFormatter<string, string, Meta>;

    handle(message: string, meta: Meta): void {

        if (meta.level && meta.level >= this.level) {

            if (this.formatter) {

                let formattedMessage = this.formatter.format(message, meta);

                if (meta.level == Level.ERROR) {
                    console.error(formattedMessage);
                }
                else {
                    console.log(formattedMessage);
                }
            }
        }
    }

    setFormatter(formatter: BaseFormatter<string, string, Meta>) {
        this.formatter = formatter;
    }

    setLevel(level: Level) {
        this.level = level;
    }
}
```