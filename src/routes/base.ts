import * as express from 'express';
import { OperationResult } from '../models/operation-result';

export class BaseRouter {

    protected static sendErrorResponse(err: Error, response: express.Response): void {
        console.error(err);
        response.status(500).json({
            message: err.message,
        });
    }

    protected static sendOperationResultResponse(operationResult: OperationResult<any>, response: express.Response): void {
        if (operationResult.hasErrors()) {
            response.status(400).json(operationResult.messages);
        } else {
            response.json(operationResult.value);
        }
    }
}
