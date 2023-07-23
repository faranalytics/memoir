import { BaseLogger, BaseLoggerOptions, LevelHandler } from './abstract.js';
import {Meta} from './meta.js';

export class MetaLogger<MessageT, FormatT> extends BaseLogger<MessageT, FormatT, Meta> {

    public handlers: Array<LevelHandler<MessageT, FormatT, Meta>> = [];

    constructor(options: BaseLoggerOptions = { name: '' }, ...loggers: Array<BaseLogger<MessageT, FormatT, Meta>>) {
        super(options, ...loggers);
        this.log = this.log.bind(this);
    }

    async log(message: MessageT, meta: Meta): Promise<void> {

        try {
            for (let i = 0; i < this.handlers.length; i = i + 1) {
                await this.handlers[i].handle(message, meta);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}