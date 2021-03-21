let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../controller/accountController");

var common = require('../common')


async function getAccount() {
    let account_list = await common.getDb().collection("account")
    await console.log(account_list)
}

getAccount();
// console.log("A");

// console.log(account_list)

//Assertion Style
chai.should();

chai.use(chaiHttp);

// describe('Test Account API', () => {

//     /**
//      * Test GET route
//      */
//     describe("GET /account_list", () => {

//         before( async (done) => {
//             // await common.getDb().collection("account").find().toArray()
//             //   .then(() => done())
//             await done()
//               .catch((err) => done(err));
//           })
        
//         //   after((done) => {
//         //    common.close()
//         //       .then(() => done())
//         //       .catch((err) => done(err));
//         //   })

//         it("It should GET all accounts from data", (done) => {
//             chai.request(server)
//             .get("/account_list")
//             .end((err, response) => {
//                 response.should.have.status(200);
//                 // response.body.should.be.a('array');
//                 response.body.length.should.be.eq(6);
//                 done();

//             })
//         })
//     })

//     /**
//      * Test POST route
//      */

//     /**
//      * Test DELETE route
//      */

// })

// describe("Accounts", () => {
//     before(async () => {

//         await 
//     })
// })