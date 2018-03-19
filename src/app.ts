import * as appInsights from 'applicationinsights';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as swaggerUI from 'swagger-ui-express';
import * as yargs from 'yargs';
import { config } from './config';
import { AuthenticationMiddleware } from './middleware/authentication';
import { AuditRouter } from './routes/audit';
import { ConsumerGroupRouter } from './routes/consumer-group';
import { EnvironmentRouter } from './routes/environment';
import { FeatureRouter } from './routes/feature';
import { FeatureGroupRouter } from './routes/feature-group';
import { ProjectRouter } from './routes/project';

const argv = yargs.argv;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.route('/api/audit')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, AuditRouter.get);

app.route('/api/consumergroup')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.get)
    .post(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.post)
    .put(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.put);

app.route('/api/environment')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, EnvironmentRouter.get)
    .post(AuthenticationMiddleware.shouldBeAuthenticated, EnvironmentRouter.post);

app.route('/api/featuregroup')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, FeatureGroupRouter.get)
    .post(AuthenticationMiddleware.shouldBeAuthenticated, FeatureGroupRouter.post)
    .put(AuthenticationMiddleware.shouldBeAuthenticated, FeatureGroupRouter.put);

app.route('/api/feature')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.get)
    .post(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.post)
    .put(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.put);

app.route('/api/feature/enabled')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.enabledGet);

app.route('/api/project')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, ProjectRouter.get)
    .post(AuthenticationMiddleware.shouldBeAuthenticated, ProjectRouter.post);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync(path.join(__dirname, './swagger.json'), 'utf8'))));

// Legacy Routes

app.route('/api/features')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.get)
    .post(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.post)
    .put(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.put);

app.route('/api/features/enabled')
    .get(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.enabledGet);

appInsights.setup(config.applicationInsights.instrumentationKey).setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();

app.listen(argv.port || process.env.PORT || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

export {
    app,
};
