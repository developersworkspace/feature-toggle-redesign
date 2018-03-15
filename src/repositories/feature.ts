import { Feature } from "../entities/feature";

export interface IFeatureRepository {
    create(feature: Feature): Promise<Feature>;
    find(key: string): Promise<Feature>;
    list(): Promise<Feature[]>;
    update(feature: Feature): Promise<Feature>;
}
