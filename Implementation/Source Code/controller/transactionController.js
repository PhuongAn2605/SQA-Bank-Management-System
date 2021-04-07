var express = require("express")
var router = express.Router()
var ObjectId = require("mongodb").ObjectID
var database = require("../database")

router.get("/transaction_list", function(req, res) {
    (async function() {
        let tbtext = "";
        const result = await database.getDb().collection("transaction").find().toArray()
        let stt = 1
        result.forEach(function(transaction) {
            var date = new Date(transaction["date"])
            let strDateCreated = date.getHours() + ":" + date.getMinutes() + ", " +
                date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

            tbtext = tbtext + "<tr><th scope=\"row\">" + stt + "</th>" +
                "<td>" + transaction["_id"] + "</td>" +
                "<td>" + transaction["receiver_number"] + "</td>" +
                "<td>" + transaction["receiver_name"] + "</td>" +
                "<td>" + transaction["bankName"] + "</td>" +
                "<td>" + transaction["giver_number"] + "</td>" +
                "<td>" + transaction["giver_name"] + "</td>" +
                "<td>" + strDateCreated + "</td>" +
                "<td>" + transaction["amount"] + "</td>" +
                "<td>" + transaction["status"] + "</td>" +
                "<td><a href=\"/transaction_edit_" + transaction["_id"] + "\">Edit</a></td>" +
                "<td><a href=\"javascript:confirmDelete('" + transaction["_id"] + "')\">Delete</a></td>" +
                "</tr>"
            stt++
        })
        let parts = { tb: tbtext }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/transactionList.html'
        // res.statusCode = 200;
        await database.render(res)
    })()
})

router.get("/transaction_create", function(req, res) {
    (async function() {
        let parts = {
            receiver_number: "",
            receiver_name: "",
            giver_number: "",
            giver_name: "",
            amount: "",
            status: ""
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/transactionAdd.html'
        await database.render(res)
    })()
})

router.post("/transaction_create", function(req, res) {
    (async function() {
        let parts = {
            receiver_number: "",
            receiver_name: "",
            giver_number: "",
            giver_name: "",
            amount: "",
            status: ""
        }

        let transactionObj = {
            "receiver_number": req.body.receiver,
            "receiver_name": req.body.receiver_name,
            "bankName": "BIDV",
            "giver_number": req.body.giver,
            "giver_name": req.body.giver_name,
            "date": Date.now(),
            "amount": req.body.amount,
            "status": req.body.status,
        }
        try {
            await database.getDb().collection("transaction").insertOne(transactionObj)
            res.statusCode = 200;
        } catch (err) {
            console.log(err)
            res.send("500 errors inserting to db");
            res.statusCode = 400;
        }


        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/transactionAdd.html'
        await database.render(res)

    })()
})

router.get("/transaction_edit_:transactionId", function(req, res) {
    (async function() {
        var oid = new ObjectId(req.params["transactionId"])
        var query = { "_id": oid }
        result = null
        try {
            result = await database.getDb().collection("transaction").findOne(query)
        } catch (err) {
            console.log("error")
        }
        if (result == null) {
            res.send("transaction with id '" + req.params["transactionId"] + "' cannot be found!");
            res.statusCode = 400;
            return;
        }
        let parts = {
            transactionId: req.params["transactionId"],
            receiver_number: result["receiver_number"],
            receiver_name: result["receiver_name"],
            giver_number: result["giver_number"],
            giver_name: result["giver_name"],
            status: result["status"],
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/transactionEdit.html'
        // res.statusCode = 200;
        await database.render(res)
    })()
})

router.post("/transaction_edit_:transactionId", function(req, res) {
    (async function() {
        let success = true
        var oid = new ObjectId(req.params["transactionId"])
        var query = { "_id": oid }
        result = null
        try {
            result = await database.getDb().collection("transaction").findOne(query)
        } catch (err) {
            console.log("error")
        }
        if (result == null) {
            res.send("transaction with id '" + req.params["transactionId"] + "' cannot be found!")
            return;
        }

        let parts = {
            transactionId: req.params["transactionId"],
            receiver_number: result["receiver_number"],
            receiver_name: result["receiver_name"],
            giver_number: result["giver_number"],
            giver_name: result["giver_name"],
            status: result["status"],
        }

        result["receiver_number"] = req.body.receiver
        result["receiver_name"] = req.body.receiver_name
        result["giver_number"] = req.body.giver
        result["giver_name"] = req.body.giver_name
        result["status"] = req.body.status

        if (success) {
            try {
                const r = await database.getDb().collection("transaction").updateOne(query, { $set: result })
            } catch (err) {
                console.log(err)
                res.send("500 error updating db")
                return;
            }
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/transactionEdit.html'
        await database.render(res)
    })()
})

router.get("/transaction_delete_:transactionId", function(req, res) {
    (async function() {
        var oid = new ObjectId(req.params["transactionId"])
        var query = { "_id": oid }
        result = null
        try {
            result = await database.getDb().collection("transaction").deleteOne(query)
        } catch (err) {
            res.send("database error")
            return;
        }
        res.redirect(302, "/transaction_list")
    })()
})

router.get("/fund_transfer_list", function(req, res) {
    (async function() {
        var uid = req.cookies["login"];
        var oid = new ObjectId(uid);
        var query = { "_id": oid };
        var objUser = null;
        try {
            objUser = await database.getDb().collection("account").findOne(query);
        } catch (err) {
            console.log("error");
        }
        let giver = { "giver_name": objUser["username"] }
        let result = null;
        let tbtext = "";
        try {
            result = await database.getDb().collection("transaction").find(giver).toArray()
        } catch (err) {
            console.log("error");
        }

        if (result == null) {
            res.send("Cannot find this user with id: " + uid)
        }

        let stt = 1
        result.forEach(function(transaction) {
            var date = new Date(transaction["date"])
            let strDateCreated = date.getHours() + ":" + date.getMinutes() + ", " +
                date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

            tbtext = tbtext + "<tr><th scope=\"row\">" + stt + "</th>" +
                "<td>" + transaction["_id"] + "</td>" +
                "<td>" + transaction["receiver_number"] + "</td>" +
                "<td>" + transaction["receiver_name"] + "</td>" +
                "<td>" + transaction["bankName"] + "</td>" +
                "<td>" + transaction["giver_number"] + "</td>" +
                "<td>" + transaction["giver_name"] + "</td>" +
                "<td>" + strDateCreated + "</td>" +
                "<td>" + transaction["amount"] + "</td>" +
                "<td>" + transaction["status"] + "</td>" +
                "</tr>"
            stt++
        })
        let parts = {
            tb: tbtext,
            balance_value: objUser["balance"],
            user_name: objUser["username"]
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/FundTransReport.html'
        await database.render(res)
    })()
})

router.get("/fund_transfer", async function(req, res) {
    var uid = req.cookies["login"];
    var oid = new ObjectId(uid);
    var query = { "_id": oid };
    var objUser = null;
    try {
        objUser = await database.getDb().collection("account").findOne(query);
    } catch (err) {
        console.log("error");
    }
    let parts = {
        receiver_number: "",
        amount: "",
        balance_value: objUser["balance"],
        user_name: objUser["username"]
    }
    res.parts = {...res.parts, ...parts }
    res.viewpath = "./public/FundTransfer.html"
    await database.render(res)
})

router.post("/fund_transfer", async function(req, res) {
    var giverId = req.cookies["login"];
    var gId = new ObjectId(giverId);
    var receiverCardNo = req.body.card;
    let giver = null;
    let receiver = null;
    let success = true;

    try {
        giver = await database.getDb().collection("account").findOne({ "_id": gId });
        receiver = await database.getDb().collection("account").findOne({ "cardNo": receiverCardNo });
    } catch (err) {
        console.log("error");
    }

    let parts = {
        receiver_number: "",
        amount: "",
        balance_value: giver["balance"],
        user_name: giver["username"]
    }

    if (receiverCardNo == giver["cardNo"]) {
        res.send("That you dumbass!!!")
        success = false
        return
    }

    if (giver == null) {
        res.send("User with id '" + gId + "' cannot be found!");
        return;
    } else if (receiver == null) {
        res.send("User with id '" + receiver["_id"] + "' cannot be found!");
        return;
    }

    let amount = new Number(req.body.amount);
    let giverBalance = new Number(giver["balance"]);
    let receiverBalance = new Number(receiver["balance"]);

    if (amount > giverBalance) {
        res.send("Insufficient amount");
        success = false;
    }

    if (success) {
        receiver["balance"] = receiverBalance + amount;
        giver["balance"] = giverBalance - amount;
    }

    let transactionObj = {
        "receiver_number": receiver["cardNo"],
        "receiver_name": receiver["username"],
        "bankName": "BIDV",
        "giver_number": giver["cardNo"],
        "giver_name": giver["username"],
        "date": Date.now(),
        "amount": Number(amount),
        "status": "completed",
    }

    try {
        await database.getDb().collection("transaction").insertOne(transactionObj)
        await database.getDb().collection("account").updateOne({ "_id": gId }, { $set: giver })
        await database.getDb().collection("account").updateOne({ "cardNo": receiverCardNo }, { $set: receiver })
    } catch (err) {
        console.log(err)
        res.send("500 errors inserting to db")
    }

    res.parts = {...res.parts, ...parts };
    res.viewpath = "./public/FundTransfer.html"
    await database.render(res)
})

module.exports = router