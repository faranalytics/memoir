import { Metadata } from "./meta.js";
import { LevelHandler, BaseFormatter, Level } from "./abstract.js";

export class ConsoleHandler<MessageT, FormatT> extends LevelHandler<MessageT, FormatT, Metadata> {

    protected formatter?: BaseFormatter<MessageT, FormatT, Metadata>;

    constructor() {
        super();
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
        this.setLevel = this.setLevel.bind(this);
    }

    handle(message: MessageT, meta: Metadata): void {
        let test = Level['DEBUG'];
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
