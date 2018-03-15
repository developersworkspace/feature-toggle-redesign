import { Project } from "../entities/project";
import { IAuditRepository } from "../repositories/audit";
import { Audit } from "../entities/audit";
import { read } from "fs";

export class DomainEvents {

    constructor(
        private auditRepository: IAuditRepository,
    ) {

    }

    public projectCreated(project: Project, userName: string): void {
        this.handleEvent(`Project '${project.name}' was created.`, null, userName);
    }

    private async handleEvent(message: string, reason: string, userName: string) {
        // await request({
        //     awaitmethod: 'POST',
        //     uri: 'https://hooks.slack.com/services/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',
        //     body: {
        //         text: username ? `${msg} [${username}]` : msg
        //     },
        //     json: true
        // });

        await this.auditRepository.create(new Audit(message, reason, new Date(), userName);
    }
}