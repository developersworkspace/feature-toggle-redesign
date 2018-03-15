import * as express from 'express';
import { Audit } from '../entities/audit';
import { container } from '../ioc';
import { AuditService } from '../services/audit';
import { BaseRouter } from './base';

export class AuditRouter extends BaseRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            const auditService: AuditService = container.get<AuditService>('AuditService');

            const result: Audit[] = await auditService.list();

            res.json(result);
        } catch (err) {
            AuditRouter.sendErrorResponse(err, res);
        }
    }
}
