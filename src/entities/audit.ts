export class Audit {

    constructor(
        public message: string,
        public reason: string,
        public timestamp: Date,
        public userName: string,
    ) {

    }
}
