
import { Formatter } from "./abstract.js";
import { Metadata } from "./metadata.js";

export interface MetadataFormatterOptions<MessageT, FormatT> {
    formatter: (message: MessageT, meta: Metadata) => FormatT;
}

export class MetadataFormatter<MessageT, FormatT> extends Formatter<MessageT, FormatT, Metadata> {

    private formatter: (message: MessageT, meta: Metadata) => FormatT;

    constructor({ formatter }: MetadataFormatterOptions<MessageT, FormatT>) {
        super();
        this.formatter = formatter;
    }

    public format(message: MessageT, meta: Metadata): FormatT {
        return this.formatter(message, meta);
    }
}