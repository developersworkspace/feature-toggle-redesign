import * as express from 'express';
import { Environment } from '../entities/environment';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { EnvironmentService } from '../services/environment';
import { BaseRouter } from './base';

export class EnvironmentRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            const environmentService: EnvironmentService = container.get<EnvironmentService>('EnvironmentService');

            const result: Environment[] = await environmentService.list();

            res.json(result);
        } catch (err) {
            EnvironmentRouter.sendErrorResponse(err, res);
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const environmentService: EnvironmentService = container.get<EnvironmentService>('EnvironmentService');

            const result: OperationResult<Environment> = await environmentService.create(req.body, req['user']);

            EnvironmentRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            EnvironmentRouter.sendErrorResponse(err, res);
        }
    }
}
