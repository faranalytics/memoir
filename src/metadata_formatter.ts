
import { Formatter } from "./abstract.js";
import { Metadata} from "./metadata.js";

export class MetadataFormatter<MessageT, FormatT> extends Formatter<MessageT, FormatT, Metadata> {

    private formatter: (message: MessageT, meta: Metadata) => FormatT;

    constructor(formatter: (message: MessageT, meta: Metadata) => FormatT) {
        super();
        this.formatter = formatter;
    }

    format(message: MessageT, meta: Metadata): FormatT {
        return this.formatter(message, meta);
    }
}