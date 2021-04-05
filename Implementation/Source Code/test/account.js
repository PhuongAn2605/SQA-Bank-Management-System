let chai = require("chai");
let chaiHttp = require("chai-http");
const { response } = require("express");
let server = require("../controller/accountController");

chai.should();

chai.use(chaiHttp);

describe('Account API', () => {

    // GET route
    describe("GET /account_create", () => {
        it("It should GET all the accounts", (done) => {
            chai.request(server)
            .get("/account_create")
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                this.setTimeout(3000);
                setTimeout(done, 3000);
            })
        })
    })
})
