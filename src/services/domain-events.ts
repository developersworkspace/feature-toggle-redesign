import { read } from 'fs';
import { Audit } from '../entities/audit';
import { ConsumerGroup } from '../entities/consumer-group';
import { Environment } from '../entities/environment';
import { Project } from '../entities/project';
import { IAuditRepository } from '../repositories/audit';

export class DomainEvents {

    constructor(
        private auditRepository: IAuditRepository,
    ) {

    }

    public consumerGroupCreated(consumerGroup: ConsumerGroup, userName: string): void {
        this.handleEvent(`Consumer Group '${consumerGroup.name}' was created.`, null, userName);
    }

    public environmentCreated(environment: Environment, userName: string): void {
        this.handleEvent(`Environment '${environment.name}' was created.`, null, userName);
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

        await this.auditRepository.create(new Audit(message, reason, new Date(), userName));
    }
}
