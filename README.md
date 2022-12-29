# Memoir

Memoir is a typed logging facility with a simple and familiar design - for both server and client applications.  

## Usage

```js
import { Logger, Level, StringFormatter, ConsoleHandler, Meta } from 'memoir';

let log = new Logger();

let handler = new ConsoleHandler();

handler.setLevel(Level.DEBUG);

let formatter = new StringFormatter(
    (message: string, meta: Meta): string => 
    `${new Date().toISOString()}:${meta.func}:${meta.url}:${meta.line}:${meta.col}:${message}`
    );

handler.setFormatter(formatter);

log.addHandler(handler);

log.info('Hello World.');
```

## 
