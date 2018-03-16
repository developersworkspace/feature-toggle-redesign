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
        let result: Audit[] = await this.auditRepository.list();

        result = result.sort((a: Audit, b: Audit) => {
            if (a.timestamp.getTime() < b.timestamp.getTime()) {
                return 1;
            }
            if (a.timestamp.getTime() > b.timestamp.getTime()) {
                return -1;
            }

            return 0;
        });

        return result;
    }
}
