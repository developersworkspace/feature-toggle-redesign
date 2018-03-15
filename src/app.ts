import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as yargs from 'yargs';
import { AuthenticationMiddleware } from './middleware/authentication';
import { AuditRouter } from './routes/audit';
import { ConsumerGroupRouter } from './routes/consumer-group';
import { EnvironmentRouter } from './routes/environment';

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

// app.route('/api/featuregroup')
// .get(AuthenticationMiddleware.shouldBeAuthenticated, FeatureGroup.get)
// .post(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.post)
// .put(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.put);

app.route('/api/consumergroup')
.get(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.get)
.post(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.post)
.put(AuthenticationMiddleware.shouldBeAuthenticated, ConsumerGroupRouter.put);

// app.route('/api/feature')
// .get(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.get)
// .post(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.post)
// .put(AuthenticationMiddleware.shouldBeAuthenticated, FeatureRouter.put);

// app.route('/api/project')
// .get(AuthenticationMiddleware.shouldBeAuthenticated, ProjectRouter.get)
// .post(AuthenticationMiddleware.shouldBeAuthenticated, ProjectRouter.post)
// .put(AuthenticationMiddleware.shouldBeAuthenticated, ProjectRouter.put);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

export {
    app,
};
