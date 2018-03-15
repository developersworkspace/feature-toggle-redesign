import { injectable } from 'inversify';
import 'reflect-metadata';
import { Feature } from '../../entities/feature';
import { ConsumerGroupView } from '../../entity-views/consumer-group';
import { EnvironmentView } from '../../entity-views/environment';
import { FeatureGroupView } from '../../entity-views/feature-group';
import { ProjectView } from '../../entity-views/project-view';
import { Option } from '../../value-objects/option';
import { IFeatureRepository } from '../feature';
import { BaseRepository } from './base';

@injectable()
export class FeatureRepository extends BaseRepository<Feature> implements IFeatureRepository {

    constructor(
        connectionString: string,
    ) {
        super(connectionString, 'feature');
    }

    protected mapToEntity(item: any): Feature {
        return new Feature(
            this.mapToEnvironments(item.environments),
            this.mapToFeatureGroup(item.group),
            item.key,
            item.name,
            this.mapToProject(item.project),
            item.type,
        );
    }

    private mapToConsumerGroups(items: any[]): ConsumerGroupView[] {
        return items.map((item) => new ConsumerGroupView(item.consumers, item.key, item.name));
    }

    private mapToEnvironments(items: any[]): EnvironmentView[] {
        return items.map((item) => new EnvironmentView(
            this.mapToConsumerGroups(item.consumerGroups),
            item.enabled,
            item.key,
            item.name,
            this.mapToOptions(item.options),
        ));
    }

    private mapToFeatureGroup(item: any): FeatureGroupView {
        return new FeatureGroupView(item.key, item.name);
    }

    private mapToOptions(items: any[]): Option[] {
        return items.map((item) => new Option(item.key, item.name, item.value));
    }

    private mapToProject(item: any): ProjectView {
        return new ProjectView(item.key, item.name);
    }
}
