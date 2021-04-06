const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

// describe('insert', () => {
//   let connection;
//   let db;


// let mongo;
beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    connection = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
    });
    db = await connection.db("SQA");
});

// beforeEach(async () => {
//     console.log(mongoose.connection);
//     const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }
// });

afterAll(async () => {
    await connection.close();
    await db.close();
});
// });