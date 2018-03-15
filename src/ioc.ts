import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { config } from './config';
import { IAuditRepository } from './repositories/audit';
import { IConsumerGroupRepository } from './repositories/consumer-group';
import { IEnvironmentRepository } from './repositories/environment';
import { IFeatureRepository } from './repositories/feature';
import { IFeatureGroupRepository } from './repositories/feature-group';
import { AuditRepository } from './repositories/mongo/audit';
import { ConsumerGroupRepository } from './repositories/mongo/consumer-group';
import { EnvironmentRepository } from './repositories/mongo/environment';
import { FeatureRepository } from './repositories/mongo/feature';
import { FeatureGroupRepository } from './repositories/mongo/feature-group';
import { ProjectRepository } from './repositories/mongo/project';
import { IProjectRepository } from './repositories/project';
import { AuditService } from './services/audit';
import { ConsumerGroupService } from './services/consumer-group';
import { DomainEvents } from './services/domain-events';
import { EnvironmentService } from './services/environment';
import { FeatureService } from './services/feature';
import { FeatureGroupService } from './services/feature-group';
import { ProjectService } from './services/project';

const container: Container = new Container();

// Repositories
container.bind<IAuditRepository>('IAuditRepository').toDynamicValue((context: interfaces.Context) => {
    return new AuditRepository(config.database.connectionString);
});

container.bind<IConsumerGroupRepository>('IConsumerGroupRepository').toDynamicValue((context: interfaces.Context) => {
    return new ConsumerGroupRepository(config.database.connectionString);
});

container.bind<IEnvironmentRepository>('IEnvironmentRepository').toDynamicValue((context: interfaces.Context) => {
    return new EnvironmentRepository(config.database.connectionString);
});

container.bind<IFeatureGroupRepository>('IFeatureGroupRepository').toDynamicValue((context: interfaces.Context) => {
    return new FeatureGroupRepository(config.database.connectionString);
});

container.bind<IFeatureRepository>('IFeatureRepository').toDynamicValue((context: interfaces.Context) => {
    return new FeatureRepository(config.database.connectionString);
});

container.bind<IProjectRepository>('IProjectRepository').toDynamicValue((context: interfaces.Context) => {
    return new ProjectRepository(config.database.connectionString);
});

// Services
container.bind<AuditService>('AuditService').to(AuditService);
container.bind<ConsumerGroupService>('ConsumerGroupService').to(ConsumerGroupService);
container.bind<EnvironmentService>('EnvironmentService').to(EnvironmentService);
container.bind<FeatureGroupService>('FeatureGroupService').to(FeatureGroupService);
container.bind<FeatureService>('FeatureService').to(FeatureService);
container.bind<ProjectService>('AuditService').to(ProjectService);

// Other
container.bind<DomainEvents>('DomainEvents').to(DomainEvents);

export {
    container,
};
