const request = require('supertest');
const { app } = require('../server.js');
var database = require("../database")


const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let transactionId;

let mockTransaction = {
  receiver: "123456789123545",
  receiver_name: "Phuong An",
  bankName: "BIDV",
  giver_number: "434745842235435",
  giver: "AAA",
  date: "2021-02-06",
  amount: "2000000",
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

  it('should insert a transaction into db', async () => {
    await transaction.insertOne(mockTransaction);

    const insertedTransaction = await transaction.findOne({ _id: mockTransaction["_id"] });
    // console.log(insertedTransaction);
    expect(insertedTransaction).toStrictEqual(mockTransaction);
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

      app.set('body', mockTransaction);
      const response = await request(app).post('/transaction_create')
        .send(serialise(mockTransaction));
      expect(response.statusCode).toEqual(200);

      const insertTransaction = await transaction.findOne({ receiver_number: mockTransaction.receiver_number });
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

      const response = await request(app).post("/transaction_edit_" + transactionId)
        .send(serialise(mockTransaction));

      expect(response.statusCode).toEqual(200);
      const updateTransaction = await transaction.findOne({ _id: ObjectId(transactionId) });

      // console.log(updateTransaction);
      expect(updateTransaction.receiver_name).toEqual(mockTransaction.receiver_name);

    })

    it("Should return cannot find the transaction with wrong id", async () => {
      mockTransaction.receiver_name = "Test";
      testTransactionId = "606d82baf906162be8b6bd11";
      app.set('body', mockTransaction);

      const response = await request(app).post("/transaction_edit_" + testTransactionId)
        .send(serialise(mockTransaction));
      const updateTransaction = await transaction.findOne({ _id: ObjectId(testTransactionId) });
      // expect(response.status).toEqual(400);
      expect(updateTransaction).toBeNull();
      expect(response.text).toEqual(expect.stringContaining('cannot be found'));

    })
  });

  it("Should delete the transaction", async () => {
    const response = await request(app).get("/transaction_delete_" + transactionId);
      expect(response.statusCode).toEqual(302);
  });

  it("Should return HTML as FUND TRANSFER LIST", () => {
    const response = await request(app).get("/fund_transfer")
    .expect(200)
  })


});