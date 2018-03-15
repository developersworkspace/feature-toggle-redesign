import { Environment } from '../entities/environment';

export interface IEnvironmentRepository {
    create(environment: Environment): Promise<Environment>;
    find(key: string): Promise<Environment>;
    list(): Promise<Environment[]>;
    update(environment: Environment): Promise<Environment>;
}
