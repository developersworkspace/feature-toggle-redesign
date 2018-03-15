import { Option } from '../value-objects/option';
import { ConsumerGroupView } from './consumer-group';

export class EnvironmentView {

    constructor(
        public consumerGroups: ConsumerGroupView[],
        public enabled: boolean,
        public key: string,
        public name: string,
        public options: Option[],
    ) {

    }
}
