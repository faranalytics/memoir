# Memoir

Memoir is a type-checked asynchronous logging facility with a simple and familiar interface.  

Memoir's `LevelLogger`, as of version 2.0, implements performant logging by taking advantage of JavaScript's [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator.  Please see the examples for how to use the `LevelLogger` interface.

## Table of Contents
- [Install](#install)
- [Performant Logging](#performant-logging)
- [Examples](#examples)
  - [Console Logger](#console-logger)
  - [FileHandler Logger](#filehandler-logger)

## Install
```
npm install memoir
```
## Performant Logging
Memoir achieves performant logging by taking advantage of JavaScript's [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator.  For example, if we only want for log messages at Level `INFO`, `WARN`, or `ERROR` to be logged, we do not want calls to `log.debug` to be evaluated.  By using the Optional chaining operator when calling the LevelLogger's methods this can be achieved.

TypeScript will enforce the usage of the Optional chaining operator when calling LevelLogger's methods.

## Examples
### Console Logger
In this simple example you will create a LevelLogger.  The LevelLogger's Handler will be set to log at the DEBUG Level; however, the LevelLogger itself will be configured to only permit method calls at Levels INFO, WARN, or ERROR.  This ensures that calls to `log.debug` will never be evaluated.
```ts
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
```

### FileHandler Logger
```ts

```

## The Metadata Object.

The formatter function passed to the constructor of the MetaFormatter can have the type:

`(formatter: (message: MessageT, meta: Metadata) => FormatT`

The Metadata object contains the properties:
* name: the name of the Logger.
* level: the Level, 
* func: the name of the function, 
* url: the stack trace URL,
* line: the line number,
* col: the column number. 



## How to build a custom type-checked Handler.

1. Extend the BaseHandler.
2. Implement the Handler method.
3. Add the Handler to a type compatible Logger.

```ts
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