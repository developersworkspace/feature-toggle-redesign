import { ValidationMessage } from './validation-message';

export class OperationResult<T> {

    public messages: ValidationMessage[] = [];

    constructor(public value: T) {

    }

    public static create<T>(result: T): OperationResult<T> {
        return new OperationResult<T>(result);
    }

    public addMessage(message: string): OperationResult<T> {
        this.messages.push(new ValidationMessage(message));

        return this;
    }

    public hasErrors(): boolean {
        return this.messages.length > 0;
    }

    public setValue(value: T): OperationResult<T> {
        this.value = value;

        return this;
    }

}
