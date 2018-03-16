import * as Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Feature } from '../entities/feature';
import { FeatureGroup } from '../entities/feature-group';
import { FeatureGroupView } from '../entity-views/feature-group';
import { OperationResult } from '../models/operation-result';
import { IFeatureRepository } from '../repositories/feature';
import { IFeatureGroupRepository } from '../repositories/feature-group';
import { DomainEvents } from './domain-events';

@injectable()
export class FeatureGroupService {

    constructor(
        @inject('DomainEvents')
        private domainEvents: DomainEvents,
        @inject('IFeatureGroupRepository')
        private featureGroupRepository: IFeatureGroupRepository,
        @inject('IFeatureRepository')
        private featureRepository: IFeatureRepository,
    ) {
    }

    public async create(featureGroup: FeatureGroup, userName: string): Promise<OperationResult<FeatureGroup>> {
        const result: OperationResult<FeatureGroup> = new OperationResult(null);

        const existingFeatureGroup: FeatureGroup = await this.featureGroupRepository.find(featureGroup.key);

        if (existingFeatureGroup) {
            result.addMessage('Feature Group with this key already exist');
            return result;
        }

        this.validateFeatureGroup(result, featureGroup);

        if (result.hasErrors()) {
            return result;
        }

        featureGroup = await this.featureGroupRepository.create(featureGroup);

        result.setValue(featureGroup);

        await this.updateFeatureGroups(featureGroup);

        this.domainEvents.featureGroupCreated(featureGroup, userName);

        return result;
    }

    public async list(): Promise<FeatureGroup[]> {
        const result: FeatureGroup[] = await this.featureGroupRepository.list();

        return result;
    }

    public async update(featureGroup: FeatureGroup, userName: string): Promise<OperationResult<FeatureGroup>> {
        const result: OperationResult<FeatureGroup> = new OperationResult(null);

        const existingFeatureGroup: FeatureGroup = await this.featureGroupRepository.find(featureGroup.key);

        if (!existingFeatureGroup) {
            result.addMessage('Feature Group with this key does not exist');
            return result;
        }

        existingFeatureGroup.name = featureGroup.name;

        this.validateFeatureGroup(result, existingFeatureGroup);

        if (result.hasErrors()) {
            return result;
        }

        featureGroup = await this.featureGroupRepository.update(existingFeatureGroup);

        result.setValue(featureGroup);

        await this.updateFeatureGroups(featureGroup);

        this.domainEvents.featureGroupUpdated(featureGroup, userName);

        return result;
    }

    private async updateFeatureGroups(featureGroup: FeatureGroup): Promise<void> {
        const features: Feature[] = await this.featureRepository.list();

        for (const feature of features) {
            if (feature.group.key === featureGroup.key) {

                feature.group = new FeatureGroupView(featureGroup.key, featureGroup.name);

                await this.featureRepository.update(feature);
            }
        }
    }

    private validateFeatureGroup(result: OperationResult<FeatureGroup>, featureGroup: FeatureGroup): void {
        const ajv = new Ajv();

        const validator = ajv.compile({
            properties: {
                key: { minLength: 2, pattern: '^[a-z|0-9|-]+$', type: 'string' },
                name: { minLength: 2, type: 'string' },
            },
        });

        const validationResult = validator(featureGroup);

        if (!validationResult) {
            for (const error of validator.errors) {
                result.addMessage(`${error.dataPath.substring(1)} ${error.message}`);
            }
        }
    }
}
