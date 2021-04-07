const request = require('supertest');
const { app } = require('../server');
var database = require("../database")


const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
// const { response, response } = require('express');

let accountId;

const testAccount = {
  role: "user",
  cardNo: "12345678901236",
  username: "PhuongAn",
  password: "12345678",
  address: "HD",
  dob: "2000-05-26",
  phone: "084834232",
  email: "anphuong2605@gmail.com",
  balance: 0
}

function serialise(obj) {
  return Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
}

describe('TEST ACCOUNT', () => {
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

    const insertedAccount = await account.findOne({ cardNo: mockAccount["cardNo"] });
    // console.log(insertedAccount);
    accountId = String(insertedAccount._id);
    // console.log( " PHUONG" + accountId);
    expect(insertedAccount).toStrictEqual(mockAccount);
  });

  //not done yet
  it("GET ACCOUNT-LIST", async () => {
    const response = await request(app).get('/account_list')
    // console.log(response);
    // console.log(request);
    expect(response.type).toEqual(expect.stringMatching('text/html'));
    expect(response.status).toEqual(200);

  });

  //not done yet
  it('GET ACCOUNT-CREATE', async () => {
    const response = await request(app).get('/account_create');
    // console.log(response);
    expect(response.type).toEqual(expect.stringMatching('text/html'));
    expect(response.status).toEqual(200);
  });


  describe("POST ACCOUNT-CREATE", () => {
    describe("POST ACCOUNT-CREATE - Valid Account", () => {
      it("Should add the account to database", async () => {
        app.set('body', testAccount);
        const response = await request(app).post('/account_create')
          .send(serialise(testAccount));
        // console.log(response.statusCode);
        // console.log("SERIALISE " + serialise(testAccount));
        expect(response.statusCode).toEqual(201);

        const insertTestAccount = await account.findOne({ cardNo: testAccount["cardNo"] });
        expect(insertTestAccount["cardNo"]).toStrictEqual(testAccount["cardNo"]);
        expect(insertTestAccount.username).toStrictEqual(testAccount.username);
        expect(insertTestAccount.phonenumber).toStrictEqual(testAccount.phonenumber);

        // done();
      });
    });

    describe("POST ACCOUNT-CREATE - Invalid password (password.length < 6 || password.length > 32)", () => {
      let invalidPassAccount = {
        role: "user",
        cardNo: "12345678901234",
        username: "PhuongAA",
        password: "",
        address: "HD",
        dob: "2000-09-08",
        phone: "084834232",
        email: "anphuong2605@gmail.com",
        balance: 0
      }
      it("Not add the account to db due to password.lenghth = 0", async () => {
        app.set('body', invalidPassAccount);
        const response = await request(app).post('/account_create')
          .send(serialise(invalidPassAccount));
        // console.log(response.statusCode);
        expect(response.statusCode).toEqual(400);

        const insertTestAccount = await account.findOne({ cardNo: invalidPassAccount["cardNo"] });
        expect(insertTestAccount).toBeNull();
        // done();

      });

      it("Not add the account to db due to password.lenghth = 2", async () => {
        invalidPassAccount.password = "12";
        app.set('body', invalidPassAccount);
        const response = await request(app).post('/account_create')
          .send(serialise(invalidPassAccount));
        // console.log(response.statusCode);
        expect(response.statusCode).toEqual(400);

        const insertTestAccount = await account.findOne({ cardNo: invalidPassAccount["cardNo"] });
        expect(insertTestAccount).toBeNull();
        // done();

      });

      it("Not add the account to db due to password.lenghth = 33", async () => {
        invalidPassAccount.password = "123456123456123456123456123456123456";
        app.set('body', invalidPassAccount);
        const response = await request(app).post('/account_create')
          .send(serialise(invalidPassAccount));
        // console.log(response.statusCode);
        expect(response.statusCode).toEqual(400);

        const insertTestAccount = await account.findOne({ cardNo: invalidPassAccount["cardNo"] });
        expect(insertTestAccount).toBeNull();
        // done();

      });
    });

    describe("POST - ACCOUNT-CREATE - Invalid username (username.length <3 || username.length >32)", () => {
      let invalidNameAccount = {
        role: "user",
        cardNo: "12345678901234",
        username: "P",
        password: "12345678",
        address: "HD",
        dob: "2000-09-08",
        phone: "084834232",
        email: "anphuong2605@gmail.com",
        balance: 0
      }
      it("Not add the account to db due to username.length = 1", async () => {
        app.set('body', invalidNameAccount);
        const response = await request(app).post('/account_create')
          .send(serialise(invalidNameAccount));
        // console.log(response.statusCode);
        expect(response.statusCode).toEqual(400);

        const insertTestAccount = await account.findOne({ username: invalidNameAccount["username"] });
        expect(insertTestAccount).toBeNull();
      });
      it("Not add the account to db due to username.length = 0", async () => {
        invalidNameAccount.username = "";
        app.set('body', invalidNameAccount);
        const response = await request(app).post('/account_create')
          .send(serialise(invalidNameAccount));
        // console.log(response.statusCode);
        expect(response.statusCode).toEqual(400);

        const insertTestAccount = await account.findOne({ username: invalidNameAccount["username"] });
        expect(insertTestAccount).toBeNull();
      });

      it("Not add the account to db due to username.length = 34", async () => {
        invalidNameAccount.username = "1234561234561234561234561234561234561";
        app.set('body', invalidNameAccount);
        // console.log("BODY" + request.body);
        const response = await request(app).post('/account_create')
          .send(serialise(invalidNameAccount));
        // console.log(response.statusCode);
        expect(response.statusCode).toEqual(400);

        const insertTestAccount = await account.findOne({ username: invalidNameAccount["username"] });
        expect(insertTestAccount).toBeNull();
      });
    });
  })

  describe("GET ACCOUNT-EDIT", () => {
    it("Should return HTML as EDIT AN ACCOUNT PAGE", async () => {
      // console.log(accountId);
      // app.set('params', accountId);
      // console.log(" PARAM " + request.params);
      const response = await request(app).get("/account_edit_" + accountId)
      expect(response.type).toEqual(expect.stringMatching('text/html'));

    });
    it("Should update the account", async () => {
      // console.log(accountId);
      testAccount.username = "Test";
      app.set('body', testAccount);
      // console.log(" PARAM " + request.params);
      const response = await request(app).post("/account_edit_" + accountId)
      .send(serialise(testAccount))
      expect(response.statusCode).toEqual(200);

      const updateAccount = await account.findOne({_id: ObjectId(accountId)});
      expect(updateAccount.username).toEqual(expect.stringMatching(testAccount.username));
      expect(updateAccount.cardNo).toEqual(testAccount.cardNo);

    });
  });

  describe("GET ACCOUNT-DELETE", () => {
    it("Should delete the account", async () => {
      const response = await request(app).get("/account_delete_" + accountId)
      expect(response.statusCode).toEqual(302);
    });

  });
});

