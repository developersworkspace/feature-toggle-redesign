import { BaseRepository } from "./base";
import { IAuditRepository } from "../audit";
import { Audit } from "../../entities/audit";

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