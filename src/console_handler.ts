import { Meta } from "./meta.js";
import { LevelHandler, BaseFormatter, Level } from "./abstract.js";

export class ConsoleHandler<MessageT, FormatT> extends LevelHandler<MessageT, FormatT, Meta> {

    protected formatter?: BaseFormatter<MessageT, FormatT, Meta>;

    constructor() {
        super();
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
        this.setLevel = this.setLevel.bind(this);
    }

    handle(message: MessageT, meta: Meta): void {
        if (meta.level && meta.level >= this.level) {

            if (this.formatter) {

                let formattedMessage = this.formatter.format(message, meta);

                if (meta.level == Level.ERROR) {
                    console.error(formattedMessage);
                }
                else {
                    console.log(formattedMessage);
                }
            }
        }
    }
}
