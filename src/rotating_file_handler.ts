import * as pth from 'node:path';
import * as fs from 'node:fs/promises';
import { Level } from './abstract.js';
import { MetadataHandler } from './metadata_handler.js';
import { Metadata } from './metadata.js';
import { MetadataFormatter } from './metadata_formatter.js';

export interface RotatingFileHandlerOptions {
    path: string;
    rotations?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    bytes?: number;
    encoding?: BufferEncoding;
    mode?: number;
}

export class RotatingFileHandler extends MetadataHandler<string, string> {

    private path: string;
    private rotations: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    private bytes: number;
    private encoding: BufferEncoding;
    private mode: number;

    public level: Level = Level.BASE;

    private mutex: Promise<void> = Promise.resolve();

    constructor({ path, rotations = 0, bytes = 10e6, encoding = 'utf8', mode = 0o666 }: RotatingFileHandlerOptions) {
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

    async handle(message: string, meta: Metadata) {

        if (Level[meta.level] >= this.level) {

            if (this.formatter) {
                message = this.formatter.format(message, meta);
                message = message + (message[message.length - 1] == '\n' ? '' : '\n');
            }

            this.mutex = (async () => {

                await this.mutex;

                await fs.appendFile(this.path, message, { encoding: this.encoding, mode: this.mode, flag: 'a' });

                const stats = await fs.stat(this.path);

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
                                    const stats = await fs.stat(path);
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

            return this.mutex;
        }
    }

    setFormatter(formatter: MetadataFormatter<string, string>) {
        this.formatter = formatter;
    }

    setLevel(level: Level) {
        this.level = level;
    }
}
