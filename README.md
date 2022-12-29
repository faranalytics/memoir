# Memoir

Memoir is a typed logging facility with a simple and familiar interface - for server and client applications.  

## Usage

```js
import { Logger, Level, StringFormatter, ConsoleHandler, Meta } from 'memoir';

//  Create an instance of a Logger.
let log = new Logger();

//  Create an instance of a Handler.
let handler = new ConsoleHandler();

//  Set the Level of the handler.
handler.setLevel(Level.DEBUG);

//  Create an instance of a Formatter.
let formatter = new StringFormatter(
    (message: string, meta: Meta): string => 
    `${new Date().toISOString()}:${meta.func}:${meta.url}:${meta.line}:${meta.col}:${message}`
    );
//  Pass a function to the constructor of the Formatter that will format the message and optionally add metadata.


//  The meta object contains the Level, the name of the function, the stack trace URL, the line number, and the column number. 
interface Meta {
    level: Level;
    error?: Error;
    func?: string;
    url?: string;
    line?: number;
    col?: number;
}

// E.g., 
// `${new Date().toISOString()}:${meta.func}:${meta.url}:${meta.line}:${meta.col}:${message}` 
// will produce a log message:
// 2022-12-29T21:38:23.297Z:test:file:///home/adpatter/workspace/faranalytics/memoir/test/dist/index.js:9:9:TEST1


//  Set the Formatter on the Handler.
handler.setFormatter(formatter);

//  Add the Handler to the Logger.
log.addHandler(handler);

//  Log a message.
log.info('Hello World.');
```