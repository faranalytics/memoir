export class BaseFormatter {
}
export class BaseHandler {
}
export class BaseLogger {
    handlers = [];
    parent;
    constructor(parent) {
        this.parent = parent;
    }
}
