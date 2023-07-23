
import { BaseFormatter } from "./abstract.js";
import { Meta, IMeta } from "./meta.js";

export class MetaFormatter<MessageT, FormatT> extends BaseFormatter<MessageT, FormatT, Meta> {

    private formatter: (message: MessageT, meta: IMeta) => FormatT;

    constructor(formatter: (message: MessageT, meta: IMeta) => FormatT) {
        super();
        this.formatter = formatter;
    }

    format(message: MessageT, meta: IMeta): FormatT {
        return this.formatter(message, meta);
    }
}