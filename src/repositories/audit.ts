import { Audit } from '../entities/audit';

export interface IAuditRepository {
    create(audit: Audit): Promise<Audit>;
    find(key: string): Promise<Audit>;
    list(): Promise<Audit[]>;
    update(audit: Audit): Promise<Audit>;
}
