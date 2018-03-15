import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Feature } from '../entities/feature';
import { EnvironmentView } from '../entity-views/environment';
import { OperationResult } from '../models/operation-result';
import { IFeatureRepository } from '../repositories/feature';
import { DomainEvents } from './domain-events';

@injectable()
export class FeatureService {

    constructor(
        @inject('DomainEvents')
        private domainEvents: DomainEvents,
        @inject('IFeatureRepository')
        private featureRepository: IFeatureRepository,
    ) {
    }

    public async create(feature: Feature, userName: string): Promise<OperationResult<Feature>> {
        const result: OperationResult<Feature> = new OperationResult(null);

        const existingFeature: Feature = await this.featureRepository.find(feature.key);

        if (existingFeature) {
            result.addMessage('Feature with this key already exist');
            return result;
        }

        this.validateFeature(result, feature);

        if (result.hasErrors()) {
            return result;
        }

        feature = await this.featureRepository.create(feature);

        result.setValue(feature);

        this.domainEvents.featureCreated(feature, userName);

        return result;
    }

    public async enabled(consumerId: string, environmentKey: string, key: string): Promise<boolean> {
        const feature: Feature = await this.featureRepository.find(key);

        if (!feature) {
            return false;
        }

        const environment: EnvironmentView = feature.environments.find((x) => x.key === environmentKey);

        if (!environment) {
           return false;
       }

        if (!environment.enabled) {
           return false;
       }

        for (const consumerGroup of environment.consumerGroups) {
           const consumer: string = consumerGroup.consumers.find((x) => x === consumerId);

           if (consumer) {
               return true;
           }
       }

        return false;
    }

    public async list(): Promise<Feature[]> {
        const result: Feature[] = await this.featureRepository.list();

        return result;
    }

    public async update(feature: Feature, userName: string): Promise<OperationResult<Feature>> {
        const result: OperationResult<Feature> = new OperationResult(null);

        const existingFeature: Feature = await this.featureRepository.find(feature.key);

        if (!existingFeature) {
            result.addMessage('Feature with this key does not exist');
            return result;
        }

        existingFeature.environments = feature.environments;
        existingFeature.name = feature.name;
        existingFeature.project = feature.project;
        existingFeature.type = feature.type;

        this.validateFeature(result, feature);

        if (result.hasErrors()) {
            return result;
        }

        feature = await this.featureRepository.update(feature);

        result.setValue(feature);

        this.domainEvents.featureUpdated(feature, userName);

        return result;
    }

    private validateFeature(result: OperationResult<Feature>, feature: Feature): void {

    }
}
