import { Logger, Level, Formatter, ConsoleHandler, IMeta } from 'memoir';

//  Create an instance of a Logger.
let log = new Logger<string, string>();

//  Create an instance of a Handler.
let handler = new ConsoleHandler<string, string>();

//  Set the Level of the handler.
handler.setLevel(Level.DEBUG);

//  Create an instance of a Formatter.
//  Pass a function to the constructor of the Formatter
//  that will format the message and optionally add metadata.
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