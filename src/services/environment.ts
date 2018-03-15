import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Environment } from '../entities/environment';
import { OperationResult } from '../models/operation-result';
import { IEnvironmentRepository } from '../repositories/environment';
import { DomainEvents } from './domain-events';

@injectable()
export class EnvironmentService {

    constructor(
        @inject('DomainEvents')
        private domainEvents: DomainEvents,
        @inject('IEnvironmentRepository')
        private environmentRepository: IEnvironmentRepository,
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

        this.domainEvents.environmentCreated(environment, userName);

        return result;
    }

    public async list(): Promise<Environment[]> {
        const result: Environment[] = await this.environmentRepository.list();

        return result;
    }

    private validateEnvironment(result: OperationResult<Environment>, environment: Environment): void {

    }
}
