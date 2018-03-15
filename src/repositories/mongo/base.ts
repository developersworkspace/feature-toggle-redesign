import * as mongodb from 'mongodb';

export abstract class BaseRepository<T> {

    private client: mongodb.MongoClient = null;

    protected databaseName: string = 'FeatureToggeRedesign';

    constructor(
        private connectionString: string,
        private name: string,
    ) {

    }

    public async create(entity: T): Promise<T> {
        const collection: mongodb.Collection = await this.getCollection();

        await collection.insertOne(entity);

        return entity;
    }

    public async find(key: string): Promise<T> {
        const collection: mongodb.Collection = await this.getCollection();

        const result: any = await collection.findOne({
            key,
        });

        return this.mapToEntity(result);
    }

    public async list(): Promise<T[]> {
        const collection: mongodb.Collection = await this.getCollection();

        const result: any[] = await collection.find({}).toArray();

        return result.map((item) => this.mapToEntity(item));
    }

    public async update(entity: any): Promise<T> {
        const collection: mongodb.Collection = await this.getCollection();

        await collection.replaceOne({
            key: entity.key,
        }, entity);

        return entity;
    }

    private async getClient(): Promise<mongodb.MongoClient> {
        if (!this.client) {
            this.client = await mongodb.MongoClient.connect(this.connectionString);
        }

        return this.client;
    }

    protected async getCollection(): Promise<mongodb.Collection> {
        const db: mongodb.Db = await this.getDatabase();

        return db.collection(this.name);
    }

    private async getDatabase(): Promise<mongodb.Db> {
        const client: mongodb.MongoClient = await this.getClient();

        return client.db(this.databaseName);
    }

    protected abstract mapToEntity(item: any): T;
}