import { injectable } from 'inversify';
import 'reflect-metadata';
import { FeatureGroup } from '../../entities/feature-group';
import { IFeatureGroupRepository } from '../feature-group';
import { BaseRepository } from './base';

@injectable()
export class FeatureGroupRepository extends BaseRepository<FeatureGroup> implements IFeatureGroupRepository {

    constructor(
        connectionString: string,
    ) {
        super(connectionString, 'feature-group');
    }

    protected mapToEntity(item: any): FeatureGroup {
        return new FeatureGroup(item.key, item.name);
    }
}
