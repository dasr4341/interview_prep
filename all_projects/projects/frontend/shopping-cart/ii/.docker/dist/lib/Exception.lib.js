export class Exception extends Error {
    status;
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    data;
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    constructor(message, statusCode, data) {
        super(message);
        this.status = statusCode;
        this.data = data;
    }
}
//# sourceMappingURL=Exception.lib.js.map