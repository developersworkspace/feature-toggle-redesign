import { injectable } from 'inversify';
import 'reflect-metadata';
import { Audit } from '../../entities/audit';
import { IAuditRepository } from '../audit';
import { BaseRepository } from './base';

@injectable()
export class AuditRepository extends BaseRepository<Audit> implements IAuditRepository {

    constructor(
        connectionString: string,
    ) {
        super(connectionString, 'audit');
    }

    protected mapToEntity(item: any): Audit {
        return new Audit(item.message, item.reason, new Date(item.timestamp), item.userName);
    }
}
