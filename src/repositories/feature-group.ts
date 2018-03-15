import { FeatureGroup } from '../entities/feature-group';

export interface IFeatureGroupRepository {
    create(featureGroup: FeatureGroup): Promise<FeatureGroup>;
    find(key: string): Promise<FeatureGroup>;
    list(): Promise<FeatureGroup[]>;
    update(featureGroup: FeatureGroup): Promise<FeatureGroup>;
}
