import { ConsumerGroupView } from "../entity-views/consumer-group";

export class Environment {

    constructor(
        public consumerGroup: ConsumerGroupView[],
        public enabled: boolean,
        public key: string,
        public name: string,
    ) {

    }
}