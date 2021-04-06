const request =require('supertest');
const { app } =require('../../server.js');
var database = require("../../database")


const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        mongo = new MongoMemoryServer();
        const mongoUri = await mongo.getUri();
        connection = await MongoClient.connect(mongoUri, {
          useNewUrlParser: true,
        });
        // db = await database.getDb().collection("account");
    });
    
    afterAll(async () => {
        await connection.close();
        // await db.close();
        await database.close();
    });

    it('should insert a doc into collection', async () => {
        const account = database.getDb().collection("account");
    
        const mockAccount = {
            role: 'user', 
            cardNo: '1234567890123',
            username: "Phuongzz",
            password: "12345678",
            address: "HD",
            dob: "2000-09-08",
            phone: "084834232",
            email: "anphuong2605@gmail.com",
            balance: "0"
        };
        await account.insertOne(mockAccount);
    
        const insertedAccount = await account.findOne({accountNo: '1234567890123'});
        expect(insertedAccount).toEqual(mockAccount);
      });
    });