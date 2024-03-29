import { Metadata } from "./metadata.js";
import { Level } from "./abstract.js";
import { MetadataHandler } from "./metadata_handler.js";

export class ConsoleHandler<MessageT, FormatT> extends MetadataHandler<MessageT, FormatT> {

    constructor() {
        super();
        this.handle = this.handle.bind(this);
    }

    public handle(message: MessageT, meta: Metadata): void {

        if (Level[meta.level] >= this.level) {

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
