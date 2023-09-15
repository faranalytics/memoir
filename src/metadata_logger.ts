import { Logger, LoggerOptions, Level, LevelHandler } from './abstract.js';
import {Metadata} from './metadata.js';

export class MetadataLogger<MessageT, FormatT> extends Logger<MessageT, FormatT, Metadata> {

    public handlers: Array<LevelHandler<MessageT, FormatT, Metadata>> = [];

    constructor(options: LoggerOptions = { name: '' }, ...loggers: Array<Logger<MessageT, FormatT, Metadata>>) {
        super(options, ...loggers);
        this.log = this.log.bind(this);
    }

    async log(message: MessageT, level: Level): Promise<void> {

        try {
            for (let i = 0; i < this.handlers.length; i = i + 1) {
                if (level >= this.handlers[i].level) {
                    let meta = new Metadata(this.name, level);
                    await this.handlers[i].handle(message, meta);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}