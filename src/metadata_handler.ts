
import { Formatter, Handler } from "./abstract.js";
import { Metadata } from "./metadata.js";

export abstract class MetadataHandler<MessageT, FormatT> extends Handler<MessageT, FormatT, Metadata> {

    protected formatter?: Formatter<MessageT, FormatT, Metadata>;

    constructor() {
        super();
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
    }

    public abstract handle(message: MessageT, meta: Metadata): Promise<void> | void;

    public setFormatter(formatter: Formatter<MessageT, FormatT, Metadata>) {
        this.formatter = formatter;
    }
}