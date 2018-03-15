import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ConsumerGroup } from '../entities/consumer-group';
import { OperationResult } from '../models/operation-result';
import { IConsumerGroupRepository } from '../repositories/consumer-group';
import { DomainEvents } from './domain-events';

@injectable()
export class ConsumerGroupService {

    constructor(
        @inject('DomainEvents')
        private domainEvents: DomainEvents,
        @inject('IConsumerGroupRepository')
        private consumerGroupRepositoryy: IConsumerGroupRepository,
    ) {
    }

    public async create(consumerGroup: ConsumerGroup, userName: string): Promise<OperationResult<ConsumerGroup>> {
        const result: OperationResult<ConsumerGroup> = new OperationResult(null);

        const existingConsumerGroup: ConsumerGroup = await this.consumerGroupRepositoryy.find(consumerGroup.key);

        if (existingConsumerGroup) {
            result.addMessage('Consumer Group with this key already exist');
            return result;
        }

        this.validateConsumerGroup(result, consumerGroup);

        if (result.hasErrors()) {
            return result;
        }

        consumerGroup = await this.consumerGroupRepositoryy.create(consumerGroup);

        this.domainEvents.consumerGroupCreated(consumerGroup, userName);

        return result;
    }

    public async list(): Promise<ConsumerGroup[]> {
        const result: ConsumerGroup[] = await this.consumerGroupRepositoryy.list();

        return result;
    }

    private validateConsumerGroup(result: OperationResult<ConsumerGroup>, consumerGroup: ConsumerGroup): void {

    }
}
