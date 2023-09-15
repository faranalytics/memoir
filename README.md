# Memoir

Memoir is a type-checked asynchronous logging facility with a simple and familiar interface.  

Memoir allows you to build your own `Logger`, `Handler`, or `Formatter` implementations or use a prebuilt implementation, such as Memoir's performance oriented `LevelLogger`.

## Table of Contents
- [Install](#install)
- [Concepts](#concepts)
- [Performant Logging](#performant-logging)
- [Examples](#examples)
  - [Console Logger](#console-logger)
  - [FileHandler Logger](#filehandler-logger)

## Install
```
npm install memoir
```

## Concepts
Memoir implements concepts that are familiar in the logging domain i.e., `Logger`s, `Handler`s, and `Formatter`s.  The following concepts are a subset of Memoir classes that are used in the provided [`Examples`](#examples).

### memoir.Level[level]
- level `<string>`
    - `BASE` `<string>`
    - `DEBUG` `<string>`
    - `INFO` `<string>`
    - `WARN` `<string>`
    - `ERROR` `<string>`
- Returns: `<number>`

### memoir.Metadata
- `name` `<string>` The name of the `Logger`.
- `level` `<string>` The level of the log message represented as a string.
- `func` `<string>` The name of the function where the `Logger` method was called. 
- `line` `<string>` The line number where the `Logger` method was called.
- `col` `<string>` The column number where the `Logger` method was called.

The `Metadata` object is passed to a `Formatter` that supports `Metadata`.

### memoir.LevelLogger<MessageT, FormatT>(options)
- Extends: <memoir.MetadataLogger>
- options `<LoggerOptions & LevelLoggerOptions>`
    - `name` `<string>` Optional string that names the Logger.
    - `level` `<memoir.Level>` Optional `Level` that indicates which methods the `Logger` will implement for logging.

`levelLogger.setLevel(level)`
- `level` `<memoir.Level>` A `Level` that indicates which methods the `Logger` will implement for logging. 

`levelLogger.addHandler(handler)`
- `handler` `memoir.MetadataHandler` A Memoir `Handler` that supports a `Metadata` argument.

### memoir.MetadataHandler<MessageT, FormatT>()
- Extends: <memoir.Handler>
`handler.setFormatter(formatter: Formatter)`
- `formatter` `<memoir.formatter>` A memoir `Formatter`. 

### memoir.MetadataFormatter<MessageT, FormatT>(formatter)
- Extends: <memoir.Formatter>
- `formatter` `(message: MessageT, meta: Metadata) => FormatT` A function that will return the formatted message of type `FormatT`.

## Performant Logging
>> Memoir provides a performant `Logger` class named `LevelLogger` that implements a familiar logging interface.  `LevelLogger` may implement any of common logging methods: `base`, `debug`, `info`, `warn`, and `error`.  The `LevelLogger` is unique in that it dynamically configures itself to only implement the methods that are relevant for a specified logging `Level` that is passed to its constructor or set using the `setLevel` method.  This approach allows the programmer to take advantage of JavaScript's [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator in order to eliminate unecessary calls to the `Logger` and its `Handlers`.  Practically, it ensures that frequent calls to `LevelLogger.debug` are not evaluated unless the `LevelLogger` has been configured to the `DEBUG` `Level`.

TypeScript will enforce the usage of the optional chaining operator when calling `LevelLogger`'s methods. Please see the examples for how to use the `LevelLogger` interface.

## Examples
### Console Logger
In this simple example you will create a `LevelLogger`.  The `LevelLogger`'s `Handler` will be set to log at the `DEBUG` Level; however, the `LevelLogger` level will be set to `INFO`, which will log `INFO`, `WARN`, and `ERROR`; hence, this ensures that more frequent calls throughout the codebase to `log.debug` will never be evaluated.  This is achieved by using JavaScript's [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator.

```ts
let log = new LevelLogger<string, string>({ name: 'Console Logger', level: Level.INFO }); // Create an instance of a Logger.
let consoleHandler = new ConsoleHandler<string, string>(); // Create an instance of a Handler.
let formatter = new MetadataFormatter<string, string>(
    // Pass a function to the constructor of the Formatter that will format the message and add metadata.
    (message: string, { name, level, func, url, line, col }: IMetadata): string =>
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

/*Output
Console Logger:INFO:2023-09-15T04:29:12.762Z:undefined:11:11:Hello World.
Console Logger:INFO:2023-09-15T04:29:12.768Z:test:12:30:Hello World.
Console Logger:DEBUG:2023-09-15T04:29:12.769Z:undefined:14:12:Now the `level` has been set to Level.DEBUG; hence, this method is called.
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
import { BaseHandler, Formatter, Meta } from 'memoir';

export class CustomHandler extends BaseHandler<string, string, Meta> {

    private level: number = Level.BASE;
    protected formatter?: Formatter<string, string, Meta>;

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

    setFormatter(formatter: Formatter<string, string, Meta>) {
        this.formatter = formatter;
    }

    setLevel(level: Level) {
        this.level = level;
    }
}
```