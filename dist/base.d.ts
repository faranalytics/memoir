export declare abstract class BaseFormatter<MessageT, FormatT, MetaT> {
    abstract format(message: MessageT, meta: MetaT): FormatT;
}
export declare abstract class BaseHandler<MessageT, FormatT, MetaT> {
    protected abstract formatter?: BaseFormatter<MessageT, FormatT, MetaT>;
    abstract handle(message: MessageT, meta: MetaT): void;
    abstract setFormatter(formatter: BaseFormatter<MessageT, FormatT, MetaT>): void;
}
export declare abstract class BaseLogger<MessageT, FormatT, MetaT> {
    protected handlers: Array<BaseHandler<MessageT, FormatT, MetaT>>;
    protected parent?: BaseLogger<MessageT, FormatT, MetaT>;
    constructor(parent?: BaseLogger<MessageT, FormatT, MetaT>);
    abstract log(message: MessageT, meta: MetaT): void;
    abstract addHandler(handler: BaseHandler<MessageT, FormatT, MetaT>): void;
}
//# sourceMappingURL=base.d.ts.map