import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Project } from '../entities/project';
import { DomainEvents } from './domain-events';
import { OperationResult } from '../models/operation-result';
import { IProjectRepository } from '../repositories/project';

@injectable()
export class ProjectService {

    constructor(
        @inject('DomainEvents')
        private domainEvents: DomainEvents,
        @inject('IProjectRepository')
        private projectRepository: IProjectRepository,
    ) {
    }

    public async create(project: Project, userName: string): Promise<OperationResult<Project>> {
        const result: OperationResult<Project> = new OperationResult(null);

        const existingProject: Project = await this.projectRepository.find(project.key);

        if (existingProject) {
            result.addMessage('Project with this key already exist');
            return result;
        }

        this.validateProject(result, project);

        if (result.hasErrors()) {
            return result;
        }

        project = await this.projectRepository.create(project);

        this.domainEvents.projectCreated(project, userName);

        return result;
    }

    public async list(): Promise<Project[]> {
        const result: Project[] = await this.projectRepository.list();

        return result;
    }

    private validateProject(result: OperationResult<Project>, project: Project): void {

    }
}
