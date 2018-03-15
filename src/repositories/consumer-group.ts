import { ConsumerGroup } from '../entities/consumer-group';

export interface IConsumerGroupRepository {
    create(consumerGroup: ConsumerGroup): Promise<ConsumerGroup>;
    find(key: string): Promise<ConsumerGroup>;
    list(): Promise<ConsumerGroup[]>;
    update(consumerGroup: ConsumerGroup): Promise<ConsumerGroup>;
}
