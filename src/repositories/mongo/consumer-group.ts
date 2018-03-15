import { injectable } from 'inversify';
import 'reflect-metadata';
import { ConsumerGroup } from '../../entities/consumer-group';
import { IConsumerGroupRepository } from '../consumer-group';
import { BaseRepository } from './base';

@injectable()
export class ConsumerGroupRepository extends BaseRepository<ConsumerGroup> implements IConsumerGroupRepository {

    constructor(
        connectionString: string,
    ) {
        super(connectionString, 'consumer-group');
    }

    protected mapToEntity(item: any): ConsumerGroup {
        return new ConsumerGroup(item.consumers, item.key, item.name);
    }
}
