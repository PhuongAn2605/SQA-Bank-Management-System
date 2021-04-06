const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    connection = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
    });
    db = await connection.db("SQA");
});

afterAll(async () => {
    await connection.close();
    await db.close();
});
// });

//npm test -- --coverage