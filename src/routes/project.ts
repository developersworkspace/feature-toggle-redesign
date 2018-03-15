import * as express from 'express';
import { Project } from '../entities/project';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { ProjectService } from '../services/project';
import { BaseRouter } from './base';

export class ProjectRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            const projectService: ProjectService = container.get<ProjectService>('ProjectService');

            const result: Project[] = await projectService.list();

            res.json(result);
        } catch (err) {
            ProjectRouter.sendErrorResponse(err, res);
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const projectService: ProjectService = container.get<ProjectService>('ProjectService');

            const result: OperationResult<Project> = await projectService.create(req.body, req['user']);

            ProjectRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            ProjectRouter.sendErrorResponse(err, res);
        }
    }
}
