import { Logger, LoggerOptions, Level } from './abstract.js';
import { LevelHandler } from "./level_handler.js";
import { Metadata } from './metadata.js';

export class MetadataLogger<MessageT, FormatT> extends Logger<MessageT, FormatT, Metadata> {

    public handlers: Array<LevelHandler<MessageT, FormatT, Metadata>> = [];

    constructor(
        { name = '' }: LoggerOptions,
        ...loggers: Array<Logger<MessageT, FormatT, Metadata>>
    ) {
        super({ name }, ...loggers);
        this.log = this.log.bind(this);
    }

    async log(level: Level, message: MessageT): Promise<void> {

        try {
            const meta = new Metadata({ name: this.name, level });
            for (let i = 0; i < this.handlers.length; i = i + 1) {
                if (level >= this.handlers[i].level) {
                    await this.handlers[i].handle(message, meta);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}