const request =require('supertest');
const { app } =require('../../server.js');
var database = require("../../database")


const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('TEST TRANSACTION', () => {
    let connection;
    let transaction;

    beforeAll(async () => {
        mongo = new MongoMemoryServer();
        const mongoUri = await mongo.getUri();
        connection = await MongoClient.connect(mongoUri, {
          useNewUrlParser: true,
        });
        transaction = await database.getDb().collection("transaction");
        await transaction.deleteMany({});
    });
    
    afterAll(async () => {
        await connection.close();
        // await db.close();
        await database.close();
    });

    it('should insert a transaction into collection', async () => {
        transaction = database.getDb().collection("transaction");
    
        const mockTransaction = {
            _id: "Transaction3123",
            receiver_number: "123456789123",
            receiver_name: "Phuong An",
            bankName: "BIDV",
            giver_number: "0347458422",
            giver_name: "AAA",
            date: "2021-02-06",
            amount: "2000000",
            status: "completed"
        };
        await transaction.insertOne(mockTransaction);
    
        const insertedTransaction = await transaction.findOne({_id: mockTransaction["_id"]});
        // console.log(insertedTransaction);
        expect(insertedTransaction).toStrictEqual(mockTransaction);
      });
    });