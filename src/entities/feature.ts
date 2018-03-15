import { EnvironmentView } from '../entity-views/environment';
import { FeatureGroupView } from '../entity-views/feature-group';
import { ProjectView } from '../entity-views/project-view';

export class Feature {

    constructor(
        public environments: EnvironmentView[],
        public group: FeatureGroupView,
        public key: string,
        public name: string,
        public project: ProjectView,
        public type: string,
    ) {

    }
}
