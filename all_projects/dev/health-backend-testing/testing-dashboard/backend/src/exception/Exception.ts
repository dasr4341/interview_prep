
interface DataInterface { [key: string]: any }

export class Exception extends Error {
    status: number;
    data: DataInterface;

    constructor(message: string, data: DataInterface, status: number) {
        super(message);
        this.message = message;
        this.status = status;
        this.data = data;
    }
}