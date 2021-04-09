const request = require('supertest');
const { app } = require('../server.js');
var database = require("../database")


const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

let mockUserSignup = {
    role: 'user',
    cardNo: '1234567890002',
    username: "Test",
    password: "12345678",
    address: "HN",
    dob: "2000-09-08",
    phone: "084834232",
    email: "anphuong2605@gmail.com",
    // balance: "0"
}

let mockAdmin = {
    username: "quocdat",
    password: "123456",
    role: "admin",
    address: "HN",
    dob: "2000-09-08",
    phone: "084834232",
    email: "sadinh1106@gmail.com",
    cardNo: "1801040061",
    balance: "0"
}

let testUserId;
let testAdminId;

function serialise(obj) {
    return Object.keys(obj)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
        .join('&');
}

describe('TEST AUTHENTICATION', () => {
    let connection;
    let account;

    beforeAll(async done  => {
        mongo = new MongoMemoryServer();
        const mongoUri = await mongo.getUri();
        connection = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
        });
        account = await database.getDb().collection("account");
        await account.deleteMany({});
        done();
        // window.document.cookie.login = "j%3A%22606c44f392060d1d88964c06%22";
    });

    // afterEach(async () => {
    //     await account.deleteMany({});
    // })

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
        it("Login with valid username and password", async () => {
            await account.insertOne(mockAdmin);

            const insertedAccount = await account.findOne({ cardNo: mockAdmin["cardNo"] });
            expect(insertedAccount).toStrictEqual(mockAdmin);
            expect(insertedAccount.cardNo).toEqual(mockAdmin.cardNo);
            expect(insertedAccount.username).toEqual(mockAdmin.username);


            testAdminId = insertedAccount._id;

            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin))
                .expect(302);

            // const response = request(app).get('/account_list')
            //     .set("Cookie", data.body._id)
            //     .expect(201);

            //     console.log(data.body._id)
        });
        it("Login with invalid username, it should return an error", async () => {
            mockAdmin.username = "";
            // let query = { "_id": testAdminId };
            // await account.updateOne(query, { $set: mockAdmin })
            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin));
            // console.log(response.text);
            expect(response.text).toEqual(expect.stringContaining('Incorrect username'));
            expect(response.statusCode).toEqual(400);
        });

        it("Login with invalid password, it should return an error", async () => {
            mockAdmin.password = "";
            mockAdmin.username = "quocdat";
            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin));
            // console.log(response.text);
            expect(400);
            expect(response.text).toEqual(expect.stringContaining('Incorrect password'));
        });

        it("Login with wrong password, it should return an error", async () => {
            mockAdmin.password = "632763";
            mockAdmin.username = "quocdat";
            app.set('body', mockAdmin);
            let response = await request(app).post('/login')
                .send(serialise(mockAdmin));
            // console.log(response.text);
            expect(400);
            expect(response.text).toEqual(expect.stringContaining('Incorrect password'));
        });
    });

    //not done yet
    describe("POST LOGIN USER", () => {
        it("Login with valid information", async () => {
            await account.insertOne(mockUser);

            const insertedUser = await account.findOne({ cardNo: mockUser["cardNo"] });
            expect(insertedUser.username).toStrictEqual(mockUser.username);
            expect(insertedUser.cardNo).toStrictEqual(mockUser.cardNo);


            testUserId = insertedUser._id;

            app.set('body', mockUser);
            let response = await request(app).post('/login')
                .send(serialise(mockUser))
                //    expect('Content-Type', /json/)
                .expect(302);
            // await account.deleteMany({});
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
            // await account.deleteMany({});

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
            // await account.deleteMany({});

        });

        it("Login with invalid password", async () => {
            mockUser.username = "quocdat";
            mockUser.password = "12";
            app.set('body', mockUser);
            // console.log(mockUser);
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


    it("GET SIGN UP", async () => {
        const response = await request(app).get('/sign_up');
        // console.log(response);
        expect(response.statusCode).toBe(200);
    });

    describe("POST SIGN-UP", () => {
        it("Should return return status 201 - OK", async () => {
            app.set('body', mockUserSignup);
            const response = await request(app).post("/sign_up")
            .send(serialise(mockUserSignup));
            expect(response.status).toEqual(201);
            // console.log(response);
        });

        it("Should return an error and status 400- BAD REQUEST due to invalid username", async () => {
            mockUserSignup.username ="PP";
            app.set('body', mockUserSignup);
            const response = await request(app).post("/sign_up")
            .send(serialise(mockUserSignup));
            expect(response.statusCode).toEqual(400);
            expect(response.text).toEqual(expect.stringContaining("Name length isn't valid"));
            // console.log(response);
        });

        it("Should return an error and status 400- BAD REQUEST due to exsiting username", async () => {
            mockUserSignup.username ="quocdat";
            app.set('body', mockUserSignup);
            const response = await request(app).post("/sign_up")
            .send(serialise(mockUserSignup));
            expect(response.statusCode).toEqual(400);
            expect(response.text).toEqual(expect.stringContaining("Name already existed"));
            // console.log(response);
        });

        it("Should return an error and status 400- BAD REQUEST due to invalid password", async () => {
            mockUserSignup.username ="Test";
            mockUserSignup.password = "aa";
            app.set('body', mockUserSignup);
            const response = await request(app).post("/sign_up")
            .send(serialise(mockUserSignup));
            expect(response.statusCode).toEqual(400);
            expect(response.text).toEqual(expect.stringContaining("Password length is not valid"));
            // console.log(response);
        });

    });

    // describe("GET PROFILE", () => {


    //     it("Should retun Profile page", async () => {
    //         let testLogin = {
    //             login: testUserId
    //         }
    //         app.set('cookies', testLogin);
    //         const response = await request(app).get('/profile')
    //         .send(testLogin)
    //     })
    // })

    it("GET SIGN OUT", async () => {
        const response = await request(app).get('/sign_out');
        // console.log(response);
        expect(response.statusCode).toBe(302);
    });
});