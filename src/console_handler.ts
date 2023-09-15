import { Metadata } from "./metadata.js";
import { Level } from "./abstract.js";
import { LevelHandler } from "./level_handler.js";
import { MetadataFormatter } from "./metadata_formatter.js";

export class ConsoleHandler<MessageT, FormatT> extends LevelHandler<MessageT, FormatT, Metadata> {

    protected formatter?: MetadataFormatter<MessageT, FormatT>;

    constructor() {
        super();
        this.handle = this.handle.bind(this);
    }

    handle(message: MessageT, meta: Metadata): void {

        if (meta.level && Level[meta.level] >= this.level) {

            if (this.formatter) {

                const formattedMessage = this.formatter.format(message, meta);

                if (Level[meta.level] == Level.ERROR) {
                    console.error(formattedMessage);
                }
                else {
                    console.log(formattedMessage);
                }
            }
        }
    }
}
