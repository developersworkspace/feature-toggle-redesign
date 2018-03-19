import * as Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ConsumerGroup } from '../entities/consumer-group';
import { Feature } from '../entities/feature';
import { ConsumerGroupView } from '../entity-views/consumer-group';
import { OperationResult } from '../models/operation-result';
import { IConsumerGroupRepository } from '../repositories/consumer-group';
import { IFeatureRepository } from '../repositories/feature';
import { DomainEvents } from './domain-events';

@injectable()
export class ConsumerGroupService {

    constructor(
        @inject('IConsumerGroupRepository')
        private consumerGroupRepository: IConsumerGroupRepository,
        @inject('DomainEvents')
        private domainEvents: DomainEvents,
        @inject('IFeatureRepository')
        private featureRepository: IFeatureRepository,
    ) {
    }

    public async create(consumerGroup: ConsumerGroup, userName: string): Promise<OperationResult<ConsumerGroup>> {
        const result: OperationResult<ConsumerGroup> = new OperationResult(null);

        const existingConsumerGroup: ConsumerGroup = await this.consumerGroupRepository.find(consumerGroup.key);

        if (existingConsumerGroup) {
            result.addMessage('Consumer Group with this key already exist');
            return result;
        }

        this.validateConsumerGroup(result, consumerGroup);

        if (result.hasErrors()) {
            return result;
        }

        consumerGroup = await this.consumerGroupRepository.create(consumerGroup);

        result.setValue(consumerGroup);

        await this.updateFeatureEnvironmentConsumerGroups(consumerGroup);

        this.domainEvents.consumerGroupCreated(consumerGroup, userName);

        return result;
    }

    public async find(key: string): Promise<ConsumerGroup> {
        const result: ConsumerGroup = await this.consumerGroupRepository.find(key);

        return result;
    }

    public async list(): Promise<ConsumerGroup[]> {
        const result: ConsumerGroup[] = await this.consumerGroupRepository.list();

        return result;
    }

    public async update(consumerGroup: ConsumerGroup, userName: string): Promise<OperationResult<ConsumerGroup>> {
        const result: OperationResult<ConsumerGroup> = new OperationResult(null);

        const existingConsumerGroup: ConsumerGroup = await this.consumerGroupRepository.find(consumerGroup.key);

        if (!existingConsumerGroup) {
            result.addMessage('Consumer Group with this key does not exist');
            return result;
        }

        existingConsumerGroup.consumers = consumerGroup.consumers;
        existingConsumerGroup.name = consumerGroup.name;

        this.validateConsumerGroup(result, existingConsumerGroup);

        if (result.hasErrors()) {
            return result;
        }

        consumerGroup = await this.consumerGroupRepository.update(existingConsumerGroup);

        result.setValue(consumerGroup);

        await this.updateFeatureEnvironmentConsumerGroups(consumerGroup);

        this.domainEvents.consumerGroupUpdated(consumerGroup, userName);

        return result;
    }

    private async updateFeatureEnvironmentConsumerGroups(consumerGroup: ConsumerGroup): Promise<void> {
        const features: Feature[] = await this.featureRepository.list();

        for (const feature of features) {
            let updated: boolean = false;

            for (const environment of feature.environments) {

                let consumerGroupView: ConsumerGroupView = environment.consumerGroups.find((x) => x.key === consumerGroup.key);

                if (consumerGroup) {
                    consumerGroupView = new ConsumerGroupView(consumerGroup.key, consumerGroup.name);

                    updated = true;
                }
            }

            if (updated) {
                await this.featureRepository.update(feature);
            }
        }
    }

    private validateConsumerGroup(result: OperationResult<ConsumerGroup>, consumerGroup: ConsumerGroup): void {
        const ajv = new Ajv();

        const validator = ajv.compile({
            properties: {
                key: { minLength: 2, pattern: '^[a-z|0-9|-]+$', type: 'string' },
                name: { minLength: 2, type: 'string' },
            },
        });

        const validationResult = validator(consumerGroup);

        if (!validationResult) {
            for (const error of validator.errors) {
                result.addMessage(`${error.dataPath.substring(1)} ${error.message}`);
            }
        }

        this.validateConsumers(result, consumerGroup);
    }

    private validateConsumers(result: OperationResult<ConsumerGroup>, consumerGroup: ConsumerGroup): void {
        for (const consumer of consumerGroup.consumers) {
            const ajv = new Ajv();

            const validator = ajv.compile({
                properties: {
                    consumer: { minLength: 1, type: 'string' },
                },
            });

            const validationResult = validator({
                consumer,
            });

            if (!validationResult) {
                for (const error of validator.errors) {
                    result.addMessage(`${error.dataPath.substring(1)} ${error.message}`);
                }
            }
        }
    }
}
