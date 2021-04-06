const request =require('supertest');
const { app } =require('../../server.js');
var database = require("../../database")


const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('TEST AUTHENTICATION', () => {
    let connection;
    let account;

    beforeAll(async () => {
        mongo = new MongoMemoryServer();
        const mongoUri = await mongo.getUri();
        connection = await MongoClient.connect(mongoUri, {
          useNewUrlParser: true,
        });
        account = await database.getDb().collection("account");
        await account.deleteMany({});
    });
    
    afterAll(async () => {
        await connection.close();
        // await db.close();
        await database.close();
    });

    it('should insert an account into collection', async () => {
        // account = database.getDb().collection("account");
    
        const mockAccount = {
            role: 'user', 
            cardNo: '12345678901235',
            username: "Phuongzz",
            password: "12345678",
            address: "HD",
            dob: "2000-09-08",
            phone: "084834232",
            email: "anphuong2605@gmail.com",
            balance: "0"
        };
        await account.insertOne(mockAccount);
    
        const insertedAccount = await account.findOne({cardNo: mockAccount["cardNo"]});
        // console.log(insertedAccount);
        expect(insertedAccount).toStrictEqual(mockAccount);
      });

      // it("Get all accounts", async () => {
      //   const response = request(app).get('/account_list');
      //   console.log(response);

      // })

      it("Create an account", async () => {
        const response = request(app).post('/account_create')
        // .set('Accept', 'application/json')
        .send({
            role: 'user', 
            cardNo: '123456789012356',
            username: "PhuongAA",
            password: "12345678",
            address: "HD",
            dob: "2000-09-08",
            phone: "084834232",
            email: "anphuong2605@gmail.com",
            balance: "0"
        })
        // .expect('Content-Type', /json/)
        .expect(201);
        console.log(response);

      })
    });

