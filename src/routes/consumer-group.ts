import * as express from 'express';
import { ConsumerGroup } from '../entities/consumer-group';
import { container } from '../ioc';
import { OperationResult } from '../models/operation-result';
import { ConsumerGroupService } from '../services/consumer-group';
import { BaseRouter } from './base';

export class ConsumerGroupRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            if (req.query.key) {
                const consumerGroupService: ConsumerGroupService = container.get<ConsumerGroupService>('ConsumerGroupService');

                const result: ConsumerGroup = await consumerGroupService.find(req.query.key);

                res.json(result);
            } else {
                const consumerGroupService: ConsumerGroupService = container.get<ConsumerGroupService>('ConsumerGroupService');

                const result: ConsumerGroup[] = await consumerGroupService.list();

                res.json(result);
            }
        } catch (err) {
            ConsumerGroupRouter.sendErrorResponse(err, res);
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const consumerGroupService: ConsumerGroupService = container.get<ConsumerGroupService>('ConsumerGroupService');

            const result: OperationResult<ConsumerGroup> = await consumerGroupService.create(req.body, req['user']);

            ConsumerGroupRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            ConsumerGroupRouter.sendErrorResponse(err, res);
        }
    }

    public static async put(req: express.Request, res: express.Response) {
        try {
            const consumerGroupService: ConsumerGroupService = container.get<ConsumerGroupService>('ConsumerGroupService');

            const result: OperationResult<ConsumerGroup> = await consumerGroupService.update(req.body, req['user']);

            ConsumerGroupRouter.sendOperationResultResponse(result, res);
        } catch (err) {
            ConsumerGroupRouter.sendErrorResponse(err, res);
        }
    }
}
