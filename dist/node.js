import * as pth from 'node:path';
import * as fs from 'node:fs/promises';
import { BaseHandler } from './base.js';
import { Level } from './index.js';
export class RotatingFileHandler extends BaseHandler {
    path;
    rotations;
    bytes;
    encoding;
    mode;
    level = Level.BASE;
    formatter;
    deferred = Promise.resolve();
    constructor({ path, rotations = 0, bytes = 10e6, encoding = 'utf8', mode = 0o666 }) {
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
    handle(message, meta) {
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
    setFormatter(formatter) {
        this.formatter = formatter;
    }
    setLevel(level) {
        this.level = level;
    }
}
