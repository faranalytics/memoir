import { Level } from './abstract.js';

export class Metadata {
    name: string;
    level: keyof typeof Level;
    error?: Error;
    func?: string;
    url?: string;
    line?: string;
    col?: string;

    constructor(name: string, level: Level) {
        this.name = name;
        this.level = Level[level] as keyof typeof Level;

        const error = new Error();
        const match = error.stack?.match(/^([^\n]+?\n){4}\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);
        const groups = match?.groups;

        if (groups) {
            this.func = groups['func'];
            this.url = groups['url'];
            this.line = groups['line'];
            this.col = groups['col'];
        }
    }
}
