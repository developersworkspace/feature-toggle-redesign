import { Project } from '../entities/project';

export interface IProjectRepository {
    create(project: Project): Promise<Project>;
    find(key: string): Promise<Project>;
    list(): Promise<Project[]>;
    update(project: Project): Promise<Project>;
}
