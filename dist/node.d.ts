/// <reference types="node" />
import { BaseHandler, BaseFormatter } from './base.js';
import { Level, Meta } from './index.js';
interface FileHandlerOptions {
    path: string;
    rotations?: number;
    bytes?: number;
    encoding?: BufferEncoding;
    mode?: number;
}
export declare class RotatingFileHandler extends BaseHandler<string, string, Meta> {
    private path;
    private rotations;
    private bytes;
    private encoding;
    private mode;
    private level;
    protected formatter?: BaseFormatter<string, string, Meta>;
    private deferred;
    private i;
    constructor({ path, rotations, bytes, encoding, mode }: FileHandlerOptions);
    handle(message: string, meta: Meta): void;
    setFormatter(formatter: BaseFormatter<string, string, Meta>): void;
    setLevel(level: Level): void;
}
export {};
//# sourceMappingURL=node.d.ts.map