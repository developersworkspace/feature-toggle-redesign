import * as express from 'express';
import { Feature } from '../entities/feature';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { FeatureService } from '../services/feature';
import { BaseRouter } from './base';

export class FeatureRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            const featureService: FeatureService = container.get<FeatureService>('FeatureService');

            const result: Feature[] = await featureService.list();

            res.json(result);
        } catch (err) {
            FeatureRouter.sendErrorResponse(err, res);
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const featureService: FeatureService = container.get<FeatureService>('FeatureService');

            const result: OperationResult<Feature> = await featureService.create(req.body, req['user']);

            FeatureRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            FeatureRouter.sendErrorResponse(err, res);
        }
    }

    public static async put(req: express.Request, res: express.Response) {
        try {
            const featureService: FeatureService = container.get<FeatureService>('FeatureService');

            const result: OperationResult<Feature> = await featureService.update(req.body, req['user']);

            FeatureRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            FeatureRouter.sendErrorResponse(err, res);
        }
    }
}