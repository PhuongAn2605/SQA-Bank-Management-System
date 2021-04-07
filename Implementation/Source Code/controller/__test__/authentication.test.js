const request = require('supertest');
const { app } = require('../../server.js');
var database = require("../../database")


const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { response } = require('express');
// const { read } = require('node:fs');

const mockUser = {
    username: "Phuong An",
    password: "12345678"
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

    it("POST LOGIN ADMIN", async () => {
       let data = await request(app).post('/login')
       .send({
           username: "test-admin",
           password: "12345",
           dbrole:"admin"
       })
       .expect(200);
    //    console.log(response.text);

    const response = request(app).get('/account_list')
        .set('Accept', 'application/json')
        .set("Cookie", data.body._id)
        .expect('Content-Type', /json/)
        .expect(201);

        // console.log(data.body._id)
    })

    it("POST LOGIN USER", async () => {
        let data = await request(app).post('/login')
     //    .set('Accept', 'application/json')
        .send({
            username: mockUser.username,
            password: mockUser.password,
            dbrole:"user"
        })
     //    expect('Content-Type', /json/)
        .expect(200);
     })

    // it("POST LOGIN with username.lenght = 0", async () => {
    //     let data = await request(app).post('/login')
    //     .send({
    //         username: "",
    //         password: mockUser.password
    //     });
    //     console.log(data);
    // //  console.log(data.request._data);
    //  })

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
    //     let user = await account.findOne({query});
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