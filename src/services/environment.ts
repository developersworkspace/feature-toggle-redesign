import * as Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Environment } from '../entities/environment';
import { Feature } from '../entities/feature';
import { EnvironmentView } from '../entity-views/environment';
import { OperationResult } from '../models/operation-result';
import { IEnvironmentRepository } from '../repositories/environment';
import { IFeatureRepository } from '../repositories/feature';
import { DomainEvents } from './domain-events';

@injectable()
export class EnvironmentService {

    constructor(
        @inject('DomainEvents')
        private domainEvents: DomainEvents,
        @inject('IEnvironmentRepository')
        private environmentRepository: IEnvironmentRepository,
        @inject('IFeatureRepository')
        private featureRepository: IFeatureRepository,
    ) {
    }

    public async create(environment: Environment, userName: string): Promise<OperationResult<Environment>> {
        const result: OperationResult<Environment> = new OperationResult(null);

        const existingEnvironment: Environment = await this.environmentRepository.find(environment.key);

        if (existingEnvironment) {
            result.addMessage('Environment with this key already exist');
            return result;
        }

        this.validateEnvironment(result, environment);

        if (result.hasErrors()) {
            return result;
        }

        environment = await this.environmentRepository.create(environment);

        result.setValue(environment);

        await this.updateFeatureEnvironments(environment);

        this.domainEvents.environmentCreated(environment, userName);

        return result;
    }

    public async list(): Promise<Environment[]> {
        const result: Environment[] = await this.environmentRepository.list();

        return result;
    }

    private async updateFeatureEnvironments(environment: Environment): Promise<void> {
        const features: Feature[] = await this.featureRepository.list();

        for (const feature of features) {

            let environmentView: EnvironmentView = feature.environments.find((x) => x.key === environment.key);

            if (environmentView) {
                environmentView = new EnvironmentView(environmentView.consumerGroups, environmentView.enabled, environment.key, environment.name, environmentView.options);
            } else {
                feature.environments.push(new EnvironmentView([], false, environment.key, environment.name, []));
            }

            await this.featureRepository.update(feature);
        }
    }

    private validateEnvironment(result: OperationResult<Environment>, environment: Environment): void {
        const ajv = new Ajv();

        const validator = ajv.compile({
            properties: {
                key: { minLength: 2, pattern: '^[a-z|0-9|-]+$', type: 'string' },
                name: { minLength: 2, type: 'string' },
            },
        });

        const validationResult = validator(environment);

        if (!validationResult) {
            for (const error of validator.errors) {
                result.addMessage(`${error.dataPath.substring(1)} ${error.message}`);
            }
        }
    }
}
