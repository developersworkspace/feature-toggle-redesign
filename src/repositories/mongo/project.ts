import { Project } from '../../entities/project';
import { IProjectRepository } from '../project';
import { BaseRepository } from './base';

export class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {

    constructor(
        connectionString: string,
    ) {
        super(connectionString, 'project');
    }

    protected mapToEntity(item: any): Project {
        return new Project(item.key, item.name);
    }
}
