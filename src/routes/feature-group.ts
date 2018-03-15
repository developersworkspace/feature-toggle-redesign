import * as express from 'express';
import { FeatureGroup } from '../entities/feature-group';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { FeatureGroupService } from '../services/feature-group';
import { BaseRouter } from './base';

export class FeatureGroupRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            const featureGroupService: FeatureGroupService = container.get<FeatureGroupService>('FeatureGroupService');

            const result: FeatureGroup[] = await featureGroupService.list();

            res.json(result);
        } catch (err) {
            FeatureGroupRouter.sendErrorResponse(err, res);
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const featureGroupService: FeatureGroupService = container.get<FeatureGroupService>('FeatureGroupService');

            const result: OperationResult<FeatureGroup> = await featureGroupService.create(req.body, req['user']);

            FeatureGroupRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            FeatureGroupRouter.sendErrorResponse(err, res);
        }
    }

    public static async put(req: express.Request, res: express.Response) {
        try {
            const featureGroupService: FeatureGroupService = container.get<FeatureGroupService>('FeatureGroupService');

            const result: OperationResult<FeatureGroup> = await featureGroupService.update(req.body, req['user']);

            FeatureGroupRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            FeatureGroupRouter.sendErrorResponse(err, res);
        }
    }
}
