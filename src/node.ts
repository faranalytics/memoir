import * as pth from 'node:path';
import * as fs from 'node:fs/promises';
import { BaseHandler, BaseFormatter } from './base.js'
import { Level, Meta } from './index.js';

interface FileHandlerOptions {
    path: string;
    rotations?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    bytes?: number;
    encoding?: BufferEncoding;
    mode?: number;
}

export class RotatingFileHandler extends BaseHandler<string, string, Meta> {

    private path: string;
    private rotations: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    private bytes: number;
    private encoding: BufferEncoding;
    private mode: number;

    public level: number = Level.BASE;
    protected formatter?: BaseFormatter<string, string, Meta>;

    private deferred: Promise<any> = Promise.resolve();

    constructor({ path, rotations = 0, bytes = 10e6, encoding = 'utf8', mode = 0o666 }: FileHandlerOptions) {
        super();
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
        this.setLevel = this.setLevel.bind(this);

        this.path = pth.resolve(pth.normalize(path));
        this.rotations = rotations;
        this.bytes = bytes;
        this.encoding = encoding;
        this.mode = mode;
    }

    handle(message: string, meta: Meta) {

        if (meta.level >= this.level) {

            if (this.formatter) {
                message = this.formatter.format(message, meta);
                message = message + (message[message.length - 1] == '\n' ? '' : '\n');
            }

            try {
                this.deferred = (async () => {

                    await this.deferred;

                    await fs.appendFile(this.path, message, { encoding: this.encoding, mode: this.mode, flag: 'a' });

                    let stats = await fs.stat(this.path);

                    if (stats.isFile()) {
                        if (stats.size > this.bytes) {
                            if (this.rotations === 0) {
                                await fs.rm(this.path);
                            }
                            else {
                                for (let i = this.rotations - 1; i >= 0; i--) {
                                    let path;
                                    if (i == 0) {
                                        path = `${this.path}`;
                                    }
                                    else {
                                        path = `${this.path}.${i}`;
                                    }

                                    try {
                                        let stats = await fs.stat(path);
                                        if (stats.isFile()) {
                                            await fs.rename(path, `${this.path}.${i + 1}`);
                                        }
                                    }
                                    catch (e) { /* flow-control */ }
                                }
                            }
                        }
                    }
                })();
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    setFormatter(formatter: BaseFormatter<string, string, Meta>) {
        this.formatter = formatter;
    }

    setLevel(level: Level) {
        this.level = level;
    }
}
