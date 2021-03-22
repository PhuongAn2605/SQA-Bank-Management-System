var express = require("express")
var router = express.Router()
var ObjectId = require("mongodb").ObjectID
var common = require("../common")

router.get("/account_list", function(req, res) {
    (async function() {
        var uid = req.cookies['login']
        var oid = new ObjectId(uid)
        var query = { "_id": oid }
        let tbtext = "";
        const result = await common.getDb().collection("account").find().toArray()
        let role = null
        try {
            //querying the database
            role = await common.getDb().collection("account").findOne(query)
        } catch (err) {
            console.log("error")
        }
        let stt = 1
        result.forEach(function(account) {
            tbtext = tbtext + "<tr><th scope=\"row\">" + stt + "</th>" +
                "<td>" + account["cardNo"] + "</td>" +
                "<td>" + account["username"] + "</td>" +
                "<td>" + account["password"] + "</td>" +
                "<td>" + account["address"] + "</td>" +
                "<td>" + account["dob"] + "</td>" +
                "<td>" + account["phone"] + "</td>" +
                "<td>" + account["email"] + "</td>" +
                "<td>" + account["balance"] + "</td>" +
                "<td><a href=\"/account_edit_" + account["_id"] + "\">Edit</a></td>" +
                "<td><a href=\"javascript:confirmDelete('" + account["_id"] + "')\">Delete</a></td>" +
                "</tr>"
            stt++
        })
        let parts = { tb: tbtext }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/accountList.html'
        await common.render(res)
    })()
})

router.get("/account_create", function(req, res) {
    (async function() {
        var uid = req.cookies['login']
        var oid = new ObjectId(uid)
        var query = { "_id": oid }
        let role = null
        try {
            //querying the common
            role = await common.getDb().collection("account").findOne(query)
        } catch (err) {
            console.log("error")
        }
        let parts = {
            msg_style: "display:none;",
            acc_err: "",
            accountNumber_value: "",
            user_value: "",
            password_value: "",
            address_value: "",
            dob_value: "",
            phone_value: "",
            email_value: "",
            balance_value: "",
            name_err: "Username must be from 4 - 32 characters",
            pass_err: "Password must be 6 - 32 characters"
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/accountAdd.html'
        await common.render(res)
    })()
})

router.post("/account_create", function(req, res) {
    (async function() {
        let success = true
        let parts = {
            msg_style: "display:none;",
            acc_err: "",
            accountNumber_value: "",
            user_value: "",
            password_value: "",
            address_value: "",
            dob_value: "",
            phone_value: "",
            email_value: "",
            balance_value: "",
            name_err: "Name must be from 3 - 32 characters",
            pass_err: "Password must be 6 - 32 characters"
        }
        var query = { "username": req.body.username }
        var card = {"cardNo": req.body.accountNumber}
        var result,r = null

        try {
            result = await common.getDb().collection("account").findOne(query)
            r = await common.getDb().collection("account").findOne(card)
        } catch (err) {
            console.log("error")
        }
        
        if(r != null){
            parts["acc_err"] = "<span style='color:red'>Account already exists</span>"
            success = false
        }

        if (req.body.username.length < 3 || req.body.username.length > 32) {
            parts["name_err"] = "<span style='color:red'>Name length isn't valid</span>"
            success = false
        }else{
            if (result != null) {
            parts["name_err"] = "<span style='color:red'>Name already exists</span>"
            success = false
            }
        }  
    
        if (req.body.password.length < 6 || req.body.password.length > 32) {
            parts["pass_err"] = "<span style='color:red'>Password length is not valid</span>"
            success = false
        }      

        if (success) {
            let accountObj = {
                "role": "user",
                "cardNo": req.body.accountNumber,
                "username": req.body.username,
                "password": req.body.password,
                "address": req.body.address,
                "dob": req.body.dob,
                "phone": req.body.phone,
                "email": req.body.email,
                "balance": Number(req.body.balance)
            }
            try {
                await common.getDb().collection("account").insertOne(accountObj)
                parts["msg_style"] = ""
            } catch (err) {
                console.log(err)
                res.send("500 errors inserting to db")
            }
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/accountAdd.html'
        await common.render(res)
            // res.redirect(302, "/account_list")
    })()
})

router.get("/account_edit_:accountId", function(req, res) {
    (async function() {
        var oid = new ObjectId(req.params["accountId"])
        var query = { "_id": oid }
        result = null
        try {
            result = await common.getDb().collection("account").findOne(query)
        } catch (err) {
            console.log("error")
        }
        if (result == null) {
            res.send("Account with id '" + req.params["accountId"] + "' cannot be found!")
            return;
        }
        let parts = {
            msg_style: "display:none;",
            accountId: req.params["accountId"],
            accountNumber_value: result["cardNo"],
            user_value: result["username"],
            password_value: result["password"],
            address_value: result["address"],
            dob_value: result["dob"],
            phone_value: result["phone"],
            email_value: result["email"],
            name_err: "Username must be from 3 - 32 characters",
            pass_err: "Password must be 6 - 32 characters"
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/accountEdit.html'
        await common.render(res)
    })()
})

router.post("/account_edit_:accountId", function(req, res) {
    (async function() {
        let success = true
        var oid = new ObjectId(req.params["accountId"])
        var query = { "_id": oid }
        result = null
        try {
            result = await common.getDb().collection("account").findOne(query)
        } catch (err) {
            console.log("error")
        }
        if (result == null) {
            res.send("Account with id '" + req.params["accountId"] + "' cannot be found!")
            return;
        }

        let parts = {
            msg_style: "display:none;",
            accountId: req.params["accountId"],
            accountNumber_value: req.body.accountNumber,
            user_value: req.body.username,
            password_value: req.body.password,
            address_value: req.body.address,
            dob_value: req.body.dob,
            phone_value: req.body.phone,
            email_value: req.body.email,
            name_err: "Username must be from 3 - 32 characters",
            pass_err: "Password must be 6 - 32 characters"
        }

        if (req.body.username.length < 3 || req.body.username.length > 32) {
            parts["name_err"] = "<span style='color:red'>Username length is not valid</span>"
            success = false
        } else {
            var q = { "_id": { $ne: oid }, username: req.body.username }
            r = null
            try {
                r = await common.getDb().collection("account").findOne(q)
            } catch (err) {
                console.log("error")
            }
            if (r != null) {
                parts["name_err"] = "<span style='color:red'>Username '" + req.body.username + "' has been used already</span>"
                success = false
            }
        }
        result["cardNo"] = req.body.accountNumber
        result["username"] = req.body.username
        result["address"] = req.body.address
        result["dob"] = req.body.dob
        result["phone"] = req.body.phone
        result["email"] = req.body.email
        if (req.body["password"] != "") {
            if (req.body["password"].length < 6 || req.body["password"].length > 32) {
                parts["pass_err"] = "<span style='color:red'>Password length is not valid</span>"
                success = false
            } else {
                result["password"] = req.body.password;
            }
        }

        if (success) {
            try {
                await common.getDb().collection("account").updateOne(query, { $set: result })
                parts["msg_style"] = ""
            } catch (err) {
                console.log(err)
                res.send("500 error updating db")
                return;
            }
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/accountEdit.html'
        await common.render(res)
    })()
})

router.get("/account_delete_:accountId", function(req, res) {
    (async function() {
        var oid = new ObjectId(req.params["accountId"])
        var query = { "_id": oid }
        result = null
        try {
            result = await common.getDb().collection("account").deleteOne(query)
        } catch (err) {
            res.send("database error")
            return;
        }
        res.redirect(302, "/account_list")
    })()
})

module.exports = router;