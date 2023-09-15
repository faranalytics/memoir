# Memoir

Memoir is a type-checked asynchronous logging facility with a simple and familiar interface.  

Memoir provides a framework for building custom `Logger`, `Handler`, or `Formatter` implementations or you may use a prebuilt implementation, such as Memoir's performance oriented `LevelLogger`.

## Table of Contents
- [Install](#install)
- [Concepts](#concepts)
- [Performant Logging](#performant-logging)
- [Examples](#examples)
  - [Console Logger](#console-logger)
  - [FileHandler Logger](#filehandler-logger)

## Install
```bash
npm install memoir
```

## Concepts
Memoir implements concepts that are familiar in the logging domain i.e., `Level`s, `Logger`s, `Handler`s, and `Formatter`s.  In addition to these familiar concepts, Memoir features a `Metadata` object that contains information about the logged message. It is passed to `Formatter`'s that support it.  

The following concepts are a subset of Memoir classes that are of practical use.  These concepts are used in the provided [`Examples`](#examples).

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

The LevelLogger implementation is unique in that it is assigned a `Level` in its constuctor or a `Level` is set using its `setLevel` method.  The `LevelLogger` will configure its interface according to the log `Level` it is set to.  JavaScript's [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator can be used in order to only log messages that meet the specified `Level` constraint.

### memoir.MetadataHandler<MessageT, FormatT>()
- Extends: <memoir.Handler>
`handler.setFormatter(formatter: Formatter)`
- `formatter` `<memoir.formatter>` A memoir `Formatter`. 

### memoir.MetadataFormatter<MessageT, FormatT>(formatter)
- Extends: <memoir.Formatter>
- `formatter` `(message: MessageT, meta: Metadata) => FormatT` A function that will return the formatted message of type `FormatT`.

## Performant Logging
>> Memoir provides a performant `Logger` class named `LevelLogger` that implements a familiar logging interface.  `LevelLogger` may implement any of common logging methods: `base`, `debug`, `info`, `warn`, and `error`.  The `LevelLogger` is unique in that it dynamically configures itself to only implement the methods that are relevant for the specified logging `Level` that is passed to its constructor or set using its `setLevel` method.  This approach allows the programmer to take advantage of JavaScript's [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator in order to eliminate unecessary calls to the `Logger` and its `Handlers`.  Practically, it ensures that frequent calls to `LevelLogger.debug` are not evaluated unless the `LevelLogger` has been configured to the `DEBUG` `Level`.

TypeScript will enforce the usage of the optional chaining operator when calling `LevelLogger`'s methods. Please see the examples for how to use the `LevelLogger` interface.

## Examples
### Console Logger
In this simple example you will create a `LevelLogger`.  The `LevelLogger`'s `Handler` will be set to log at the `DEBUG` Level; however, the `LevelLogger` level will be set to `INFO`, which will log `INFO`, `WARN`, and `ERROR`; hence, this ensures that more frequent calls throughout the codebase to `log.debug` will never be evaluated.  This is achieved by using JavaScript's [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator.
#### Code
```ts
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
```
#### Output
```bash
Console Handler Example 1:INFO:2023-09-15T20:05:10.621Z:undefined:11:11:Hello World.
Console Handler Example 1:INFO:2023-09-15T20:05:10.631Z:test:12:30:Hello World.
Console Handler Example 1:DEBUG:2023-09-15T20:05:10.632Z:undefined:14:12:The LevelLogger's `level` property has been set to Level.DEBUG; hence, the method is called.
```

### FileHandler Logger
#### Code
```ts
let log = new LevelLogger<string, string>({ name: 'Rotating File Handler Example', level: Level.INFO }); // Create an instance of a Logger.
let fileHandler = new RotatingFileHandler({ path: './test.log', rotations: 5}); // Create an instance of a Handler.
let formatter = new MetadataFormatter<string, string>(
    // Pass a function to the constructor of the Formatter that will format the message and add metadata.
    (message: string, { name, level, func, url, line, col }: Metadata): string =>
        `${name}:${level}:${new Date().toISOString()}:${func}:${line}:${col}:${message}`
); // Create an instance of a Formatter.

fileHandler.setLevel(Level.DEBUG); // Set the Level of the Handler.
fileHandler.setFormatter(formatter); // Set the Formatter on the Handler.
log.addHandler(fileHandler); // Add the Handler to the Logger.

log.info?.('Hello World.'); // Log a Hello World to the console.
(function test() { log.info?.('Hello World.'); }());
```
#### Output
```bash
Rotating File Handler Example:INFO:2023-09-15T20:03:45.657Z:undefined:10:11:Hello World.
Rotating File Handler Example:INFO:2023-09-15T20:03:45.657Z:test:11:30:Hello World.
```