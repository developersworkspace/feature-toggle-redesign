export class ConsumerGroup {

    constructor(
        public consumers: string[],
        public key: string,
        public name: string,
    ) {

    }
}
