# Memoir

Memoir is a type-checked logging facility with a simple and familiar interface - for server and client applications.

## Install

```
npm install memoir
```

## Usage

```js
import { Logger, ConsoleHandler, Formatter, Level, IMeta } from 'memoir';

//  Create an instance of a Logger.
let log = new Logger<string, string>();

//  Create an instance of a Handler.
let handler = new ConsoleHandler<string, string>();

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

//  Add the Handler to the Logger.
log.addHandler(handler);

//  Log a message.
log.info('Hello World.');
//  INFO:2022-12-30T00:22:05.981Z:undefined:26:5:Hello World.

(function test(){log.info('Hello World.');}());
//  INFO:2022-12-30T00:22:43.073Z:test:28:24:Hello World.
```

## The Meta Object.

The formatter function passed to the constructor of the Formatter can have the signature:

`(formatter: (message: MessageT, meta: IMeta) => FormatT`

The interface to the meta object contains the properties: 
* level: the Level, 
* func: the name of the function, 
* url: the stack trace URL,
* line: the line number,
* col: the column number. 

## How to construct a custom type-checked logger.

This logger will log a JavaScript *object* to the console as a JSON *string*.  The formatter will add the Date, function, line number, and column number to the log message.

```js
let objectLogger = new Logger<object, string>();
let objectHandler = new ConsoleHandler<object, string>();
let objectFormatter = new Formatter<object, string>(
    (objMessage, { level, func, url, line, col }) => 
    `${level}:${new Date().toISOString()}:${func}:${line}:${col}:${JSON.stringify(objMessage)}`
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

        if (meta.Level && meta.Level >= this.level) {

            if (this.formatter) {

                let formattedMessage = this.formatter.format(message, meta);

                if (meta.Level == Level.ERROR) {
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