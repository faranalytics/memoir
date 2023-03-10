/// <reference types="node" />
import { BaseHandler, BaseFormatter } from './base.js';
import { Level, Meta } from './index.js';
interface FileHandlerOptions {
    path: string;
    rotations?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
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
    level: number;
    protected formatter?: BaseFormatter<string, string, Meta>;
    private deferred;
    constructor({ path, rotations, bytes, encoding, mode }: FileHandlerOptions);
    handle(message: string, meta: Meta): void;
    setFormatter(formatter: BaseFormatter<string, string, Meta>): void;
    setLevel(level: Level): void;
}
export {};
//# sourceMappingURL=node.d.ts.map