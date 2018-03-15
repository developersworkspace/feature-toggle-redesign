import { injectable } from 'inversify';
import 'reflect-metadata';
import { Environment } from '../../entities/environment';
import { IEnvironmentRepository } from '../environment';
import { BaseRepository } from './base';

@injectable()
export class EnvironmentRepository extends BaseRepository<Environment> implements IEnvironmentRepository {

    constructor(
        connectionString: string,
    ) {
        super(connectionString, 'environment');
    }

    protected mapToEntity(item: any): Environment {
        return new Environment(item.key, item.name);
    }
}
