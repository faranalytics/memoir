import { Handler, Level } from "./abstract";

export abstract class LevelHandler<MessageT, FormatT, MetadataT> extends Handler<MessageT, FormatT, MetadataT> {
    public level: Level = Level.BASE;
    setLevel(level: Level): void {
        this.level = level;
    }
}