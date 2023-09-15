import { Level } from './abstract.js';

export interface MetadataOptions {
    name: string;
    level: Level;
}

export class Metadata {
    name: string;
    level: keyof typeof Level;
    error?: Error;
    func?: string;
    url?: string;
    line?: string;
    col?: string;

    constructor({ name, level }: MetadataOptions) {
        this.name = name;
        this.level = Level[level] as keyof typeof Level;

        const error = new Error();
        const match = error.stack?.match(/^([^\n]+?\n){3}\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);
        const groups = match?.groups;

        if (groups) {
            this.func = groups['func'];
            this.url = groups['url'];
            this.line = groups['line'];
            this.col = groups['col'];
        }
    }
}
