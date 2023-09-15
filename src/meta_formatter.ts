
import { BaseFormatter } from "./abstract.js";
import { Metadata, IMetadata } from "./meta.js";

export class MetadataFormatter<MessageT, FormatT> extends BaseFormatter<MessageT, FormatT, Metadata> {

    private formatter: (message: MessageT, meta: IMetadata) => FormatT;

    constructor(formatter: (message: MessageT, meta: IMetadata) => FormatT) {
        super();
        this.formatter = formatter;
    }

    format(message: MessageT, meta: IMetadata): FormatT {
        return this.formatter(message, meta);
    }
}