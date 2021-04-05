import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
var database = require("../database");

let mongo;
beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await MongoClient.connect(mongoUri, {
        useNewParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await database.getDb().collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await MongoClient.connection.close();
});