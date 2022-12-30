
export abstract class BaseFormatter<MessageT, FormatT, MetaT> {
    abstract format(message: MessageT, meta: MetaT): FormatT;
}

export abstract class BaseHandler<MessageT, FormatT, MetaT> {

    protected abstract formatter?: BaseFormatter<MessageT, FormatT, MetaT>;

    public abstract handle(message: MessageT, meta: MetaT): void;

    public abstract setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetaT>): void;
}

export abstract class BaseLogger<MessageT, FormatT, MetaT> {

    protected handlers: Array<BaseHandler<MessageT, FormatT, MetaT>> = [];
    protected parent?: BaseLogger<MessageT, FormatT, MetaT>;

    constructor(parent?: BaseLogger<MessageT, FormatT, MetaT>) {
        this.parent = parent;
    }

    abstract log(message: MessageT, meta: MetaT): void;

    abstract addHandler(handler: BaseHandler<MessageT, FormatT, MetaT>): void;
}
