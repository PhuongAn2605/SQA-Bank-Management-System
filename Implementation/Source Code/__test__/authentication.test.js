const request = require('supertest');
const { app } = require('../server.js');
var database = require("../database")


const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { response } = require('express');
// const { serialize } = require('node:v8');
// const { read } = require('node:fs');

let mockUser = {
    role: 'user',
    cardNo: '1234567890000',
    username: "Test-login",
    password: "12345678",
    address: "HN",
    dob: "2000-09-08",
    phone: "084834232",
    email: "anphuong2605@gmail.com",
    balance: "0"
}

let mockAdmin = {
    username: "quocdat",
    password: "123456",
    dbrole: "admin",
    address: "HN",
    dob: "2000-09-08",
    phone: "084834232",
    email: "sadinh1106@gmail.com",
    cardNo: "1801040061",
    balance: "0"
}

function serialise(obj) {
    return Object.keys(obj)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
        .join('&');
}

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
        // window.document.cookie.login = "j%3A%22606c44f392060d1d88964c06%22";
    });

    afterAll(async () => {
        await connection.close();
        // await db.close();
        await database.close();
    });


    it("GET LOG IN should return status 200'", async () => {
        const response = await request(app).get('/login');
        // console.log(response)
        expect(response.statusCode).toBe(200);

    });

    //not done yet
    describe("LOGIN ADMIN", () => {
        it("Admin logs in with valid username and password", async () => {
            await account.insertOne(mockAdmin);

            const insertedAccount = await account.findOne({ cardNo: mockAdmin["cardNo"] });
            expect(insertedAccount).toStrictEqual(mockAdmin);

            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin))
                .expect(302);

            // const response = request(app).get('/account_list')
            //     .set("Cookie", data.body._id)
            //     .expect(201);

            //     console.log(data.body._id)
        });
        it("Admin login with invalid username, it should return an error", async () => {
            mockAdmin.username = "";
            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin));
            // console.log(response.text);
            expect(response.text).toEqual(expect.stringContaining('Incorrect username'));
            expect(response.statusCode).toEqual(400);
        });

        it("Admin login with invalid password, it should return an error", async () => {
            mockAdmin.password = "";
            mockAdmin.username = "quocdat";
            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin));
            // console.log(response.text);
            expect(response.text).toEqual(expect.stringContaining('Incorrect password'));
        });

        it("Admin login with wrong password, it should return an error", async () => {
            mockAdmin.password = "632763";
            mockAdmin.username = "quocdat";
            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin));
            // console.log(response.text);
            expect(response.text).toEqual(expect.stringContaining('Incorrect password'));
        });
    });

    //not done yet
    describe("POST LOGIN USER", () => {
        it("Loin with valid information", async () => {

            // const mockAccount = {
            //     role: 'user',
            //     cardNo: '1234567890000',
            //     username: "Test-login",
            //     password: "12345678",
            //     address: "HN",
            //     dob: "2000-09-08",
            //     phone: "084834232",
            //     email: "anphuong2605@gmail.com",
            //     balance: "0"
            // };
            await account.insertOne(mockUser);

            const insertedUser = await account.findOne({ cardNo: mockUser["cardNo"] });
            expect(insertedUser).toStrictEqual(mockUser);


            app.set('body', mockUser);
            let response = await request(app).post('/login')
                .send(serialise(mockUser))
                //    expect('Content-Type', /json/)
                .expect(302);
        })

        it("Login with invalid username", async () => {
            mockUser.username = "";
            app.set('body', mockUser);
            let response = await request(app).post('/login')
                .send(serialise(mockUser));
            // console.log(data);
            //  console.log(response.text);
            expect(400);
            expect(response.text).toEqual(expect.stringContaining('Incorrect username'));
        });

        it("Login with wrong username", async () => {
            mockUser.username = "phuongan";
            app.set('body', mockUser);
            let response = await request(app).post('/login')
                .send(serialise(mockUser));
            // console.log(data);
            //  console.log(response.text);
            expect(400);
            expect(response.text).toEqual(expect.stringContaining('Incorrect username'));
        });

        it("Login with invalid password", async () => {
            mockUser.username = "quocdat";
            mockUser.password = "12";
            app.set('body', mockUser);
            let response = await request(app).post('/login')
                .send(serialise(mockUser));
            // console.log(data);
            //  console.log(response.text);
            expect(400);
            expect(response.text).toEqual(expect.stringContaining('Incorrect password'));
        })
    })

    it("GET HOMEPAGE", async () => {
        const response = await request(app).get('/home_page');
        // console.log(response)
        expect(response.statusCode).toBe(200);
    });

    it("GET ADMIN", async () => {
        const response = await request(app).get('/admin');
        // console.log(response)
        expect(response.statusCode).toBe(200);
    });

    //  it("GET USER", async () => {
    //     let query = { "_id": new ObjectId("606c28459e5f923888fb2bb7")};
    //     console.log(query);
    //     let user = await User.findOne({query});
    //    console.log(user);
    //     let data = await request(app).get('/user')
    //     .send(query);
    //  })

    it("GET SIGN UP", async () => {
        const response = await request(app).get('/sign_up');
        // console.log(response);
        expect(response.statusCode).toBe(200);
    });

    // test("POST SIGN UP", async () => {
    //     return await request(app).post('/sign_up')
    //     .send({
    //         role: 'user', 
    //         cardNo: '123456789012356',
    //         username: "PhuongAA",
    //         password: "12345678",
    //         address: "HD",
    //         dob: "2000-09-08",
    //         phone: "084834232",
    //         email: "anphuong2605@gmail.com",
    //         balance: "0"
    //     })
    //     .expect(200)
    //     // console.log(response);
    //     // expect(response.statusCode).toBe(200);
    // });

    it("GET SIGN OUT", async () => {
        const response = await request(app).get('/sign_out');
        // console.log(response);
        expect(response.statusCode).toBe(302);
    });
});