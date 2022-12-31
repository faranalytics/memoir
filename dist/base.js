export class BaseFormatter {
    constructor() {
        this.format = this.format.bind(this);
    }
}
export class BaseHandler {
    constructor() {
        this.handle = this.handle.bind(this);
        this.setFormatter = this.setFormatter.bind(this);
    }
}
export class BaseLogger {
    handlers = [];
    parent;
    constructor(parent) {
        this.parent = parent;
        this.log = this.log.bind(this);
        this.addHandler = this.addHandler.bind(this);
    }
}
