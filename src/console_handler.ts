import { Metadata } from "./metadata.js";
import { LevelHandler, Level } from "./abstract.js";
import { MetadataFormatter } from "./metadata_formatter.js";

export class ConsoleHandler<MessageT, FormatT> extends LevelHandler<MessageT, FormatT, Metadata> {

    protected formatter?: MetadataFormatter<MessageT, FormatT>;

    constructor() {
        super();
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
        this.setLevel = this.setLevel.bind(this);
    }

    handle(message: MessageT, meta: Metadata): void {

        if (meta.level && Level[meta.level] >= this.level) {

            if (this.formatter) {

                let formattedMessage = this.formatter.format(message, meta);

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
