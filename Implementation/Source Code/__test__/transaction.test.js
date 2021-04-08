const request = require('supertest');
const { app } = require('../server.js');
var database = require("../database")


const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { response } = require('express');


const mockAccount1 = {
  role: 'user',
  cardNo: '12345678901238',
  username: "PhuongZZZ",
  password: "12345678",
  address: "HD",
  dob: "2000-09-08",
  phone: "084834232",
  email: "anphuong2605@gmail.com",
  balance: "1000000"
};

const mockAccount2 = {
  role: 'user',
  cardNo: '12345678901234',
  username: "Sarang",
  password: "12345678",
  address: "HD",
  dob: "2000-09-08",
  phone: "084834232",
  email: "anphuong2605@gmail.com",
  balance: "0"
};

let mockTransaction = {
  // _id: "606e690ada5a593d8433073e",
  receiver_number: "12345678901234",
  receiver_name: "PhuongZZZ",
  bankName: "BIDV",
  giver_number: "12345678901238",
  giver_name: "Sarang",
  date: "2021-02-06",
  amount: "200000",
  status: "completed"
};

function serialise(obj) {
  return Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
}

describe('TEST TRANSACTION', () => {
  let connection;
  let transaction;
  let account;

  let transactionId;
let accountId1;

  beforeAll(async () => {
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    connection = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
    });

    account = await database.getDb().collection("account");
    await account.deleteMany({});
    await account.insertMany([mockAccount1, mockAccount2]);

    const insertedAccount1 = await account.findOne({cardNo: mockAccount1.cardNo})
    accountId1 = insertedAccount1._id;
    
    transaction = await database.getDb().collection("transaction");
    await transaction.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
    // await db.close();
    await database.close();
  });

  it('should insert a transaction into db', async () => {
    // console.log(mockTransaction);
    await transaction.insertOne(mockTransaction);

    const insertedTransaction = await transaction.findOne({ _id: mockTransaction["_id"] });
    // console.log(insertedTransaction);
    expect(insertedTransaction._id).toStrictEqual(mockTransaction._id);
  });

  it("Should return LIST OF TRANSACTION page", async () => {
    const response = await request(app).get('/transaction_list');
    // console.log(response.statusCode);
    expect(response.type).toEqual(expect.stringMatching('text/html'));
    expect(response.statusCode).toEqual(200);
  });

  it("Should return CREATE A TRANSACTION page", async () => {
    const response = await request(app).get('/transaction_create');
    // console.log(response.statusCode);
    expect(response.type).toEqual(expect.stringMatching('text/html'));
    expect(response.statusCode).toEqual(200);
  });

  describe("POST TRANSACTION-CREATE", () => {
    it("Should add the transaction to db", async () => {
      await transaction.deleteMany({});

      app.set('body', mockTransaction);
      const response = await request(app).post('/transaction_create')
        .send(serialise(mockTransaction));
      expect(response.statusCode).toEqual(200);

      const insertTransaction = await transaction.findOne({ receiver_name: mockTransaction.receiver_name });
      // console.log(insertTransaction);
      transactionId = insertTransaction._id;
      expect(insertTransaction.receiver_number).toStrictEqual(mockTransaction.receiver_number);

    });
  });

  describe("GET TRANSACTION-EDIT", () => {
    it("Should return HTML as EDIT A TRANSACTION page", async () => {
      const response = await request(app).get("/transaction_edit_" + transactionId)
      expect(response.type).toEqual(expect.stringMatching('text/html'));

    });
    it("Should return an error to notify the transaction id cannot be found", async () => {
      const response = await request(app).get("/transaction_edit_606d6f6cd209bb624494d3c7");
      // console.log(response);
      expect(response.text).toEqual(expect.stringContaining('cannot be found'));

    });
  });
  describe("POST TRANSACTION-EDIT", () => {
    it("Should update the transaction", async () => {
      mockTransaction.receiver_name = "Test";
      app.set('body', mockTransaction);
      // console.log(transactionId);

      const response = await request(app).post("/transaction_edit_" + transactionId)
        .send(serialise(mockTransaction));

      expect(response.statusCode).toEqual(200);
      const updateTransaction = await transaction.findOne({ _id: ObjectId(transactionId) });

      // console.log(updateTransaction);
      expect(updateTransaction.receiver_name).toEqual(mockTransaction.receiver_name);

    })

    it("Should return cannot find the transaction with wrong id", async () => {
      mockTransaction.receiver_name = "PhuongAn";
      testTransactionId = "606d82baf906162be8b6bd11";
      app.set('body', mockTransaction);

      const response = await request(app).post("/transaction_edit_" + testTransactionId)
        .send(serialise(mockTransaction));
      const updateTransaction = await transaction.findOne({ _id: ObjectId(testTransactionId) });
      // expect(response.status).toEqual(400);
      expect(updateTransaction).toBeNull();
      expect(response.text).toEqual(expect.stringContaining('cannot be found'));
      // expect(updateTransaction.receiver_name).toEqual(mockTransaction.receiver_number);

    })
  });

  describe("GET TRANSACTION-DELETE", () => {
    it("Should delete the transaction", async () => {
      const response = await request(app).get("/transaction_delete_" + transactionId);
      expect(response.statusCode).toEqual(302);
    });
    it("Shoud return status 400 due to wrong id", async () => {
      testTransactionId = "606e703774e2ec6b18c34511";
      const response = await request(app).get("/transaction_delete_" + testTransactionId)
      expect(400);
      // console.log(response);
    })
  })

  // it("Should return HTML as FUND TRANSFER LIST", async () => {
  //   app.set("cookies", {
  //     login: accountId1
  //   })
  //   console.log(accountId1);
  //   const response = await request(app).get("/fund_transfer")
  //     .expect(200)
  // });

  // describe("POST FUND-TRANSFER", async () => {
  //   mockTransaction.receiver_name = "PhuongAn";
  //   testTransactionId = "606d82baf906162be8b6bd11";
  //   app.set('body', mockTransaction);

  //   const response = await request(app).post("/fund_transfer");

  // })


});