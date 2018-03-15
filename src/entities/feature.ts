import { ProjectView } from "../entity-views/project-view";
import { EnvironmentView } from "../entity-views/environment";

export class Feature {

    constructor(
        public environments: EnvironmentView[],
        public key: string,
        public name: string,
        public project: ProjectView,
        public type: string,
    ) {

    }
}