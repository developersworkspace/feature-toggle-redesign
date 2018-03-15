import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Audit } from '../entities/audit';
import { IAuditRepository } from '../repositories/audit';

@injectable()
export class AuditService {

    constructor(
        @inject('IAuditRepository')
        private auditRepository: IAuditRepository,
    ) {
    }

    public async list(): Promise<Audit[]> {
        const result: Audit[] = await this.auditRepository.list();

        return result;
    }
}
