import { Level } from './abstract.js';

export interface IMeta {
    name: string;
    level: number;
    func?: string;
    url?: string;
    line?: string;
    col?: string;
}

export class Meta implements IMeta {
    name: string;
    level: number;
    error?: Error;
    func?: string;
    url?: string;
    line?: string;
    col?: string;

    constructor(name: string, level: Level) {
        this.name = name;
        this.level = level;

        let error = new Error();

        let match = error.stack?.match(/^([^\n]+?\n){3}\s+at(?: (?<func>[^\s]+) \(| )(?<url>[^\n]+):(?<line>\d+):(?<col>\d+)/is);

        let groups = match?.groups;

        if (groups) {
            this.func = groups['func'];
            this.url = groups['url'];
            this.line = groups['line'];
            this.col = groups['col'];
        }
    }
}
