var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectID;
var database = require("../database");

router.get("/login", function(req, res) {
    (async function() {
        let p = { usr_value: "", msg: "Sign in" };
        res.parts = {...res.parts, ...p };
        res.viewpath = './public/login.html';
        // console.log(res);
        await database.render(res);
    })()
})

router.post("/login", async function(req, res) {
    var query = { "username": req.body.username };
    let p = { usr_value: "", msg: "" };
    var send_html = true,
        result = null;
    try {
        result = await database.getDb().collection("account").findOne(query);
    } catch (err) {
        console.log("error");
    }
    if (result == null) {
        p["msg"] = "<span style='color:red'>Incorrect username</span>";
        res.statusCode = 400;
    } else {
        var dbpass = String(result["password"]);
        if (dbpass == req.body.password) {
            res.cookie('login', result["_id"], { maxAge: 3600000 });
            var dbrole = String(result["role"]);
            if (dbrole == "admin") {
                res.redirect(302, '/admin');
            } else if (dbrole == "user") {
                res.redirect(302, '/user');
            }
            send_html = false;
        } else {
            p["msg"] = "<span style='color:red'>Incorrect password</span>";
            res.statusCode = 400;
        }
    }

    // console.log(res.statusCode);
    if (send_html) {
        res.parts = {...res.parts, ...p };
        res.viewpath = './public/login.html';
        await database.render(res);
    }
})

router.get('/home_page', async function(req, res) {
    res.viewpath = './public/homePage.html';
    res.parts = {...res.parts };
    await database.render(res);
})

router.get('/admin', async function(req, res) {
    res.viewpath = './public/mainPage.html';
    res.parts = {...res.parts };
    // console.log(res.parts);
    await database.render(res);
})

router.get('/user', async function(req, res) {
    // console.log(req);
    var uid = req.cookies["login"];
    // console.log(uid);
    var oid = new ObjectId(uid);
    var query = { "_id": oid };
    var objUser = null;
    try {
        objUser = await database.getDb().collection("account").findOne(query);
    } catch (err) {
        console.log("error");
    }
    let parts = {
        balance_value: objUser["balance"],
        user_name: objUser["username"]
    }
    res.viewpath = './public/MainPage_User.html';
    res.parts = {...res.parts, ...parts };
    // console.log(res.parts);
    await database.render(res);
})

router.get("/sign_up", function(req, res) {
    (async function() {
        let parts = {
            name_err: "Username must be from 4 - 32 characters",
            pass_err: "Password must be 6 - 32 characters"
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/Register.html'
        await database.render(res)
    })()
})

router.post("/sign_up", function(req, res) {
    (async function() {
        let success = true
        let parts = {
            name_err: "Name must be from 3 - 32 characters",
            pass_err: "Password must be 6 - 32 characters"
        }
        var query = { "username": req.body.username }
        var result = null
        if (req.body.username.length < 3 || req.body.username.length > 32) {
            parts["name_err"] = "<span style='color:red'>Name length isn't valid</span>"
            success = false
        } else {
            try {
                result = await database.getDb().collection("account").findOne(query)
            } catch (err) {
                console.log("error")
            }
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
                "cardNo": req.body.cardNo,
                "username": req.body.username,
                "password": req.body.password,
                "address": req.body.address,
                "dob": req.body.dob,
                "phone": req.body.phone,
                "email": req.body.email,
                "balance": "0"
            }
            try {
                await database.getDb().collection("account").insertOne(accountObj)
                parts["msg_style"] = ""
            } catch (err) {
                console.log(err)
                res.send("500 errors inserting to db")
            }
        }
        res.parts = {...res.parts, ...parts }
        res.viewpath = './public/Register.html'
        // console.log(res)
        await database.render(res)
    })()
})

router.get("/profile", async function(req, res) {
    var uid = req.cookies["login"];
    var oid = new ObjectId(uid);
    var query = { "_id": oid };
    objUser = null;
    try {
        objUser = await database.getDb().collection("account").findOne(query);
    } catch (err) {
        console.log("error");
    }

    let p = {
        balance_value: objUser.balance,
        user_name: objUser.username,
        email_value: objUser.email,
        user_value: objUser.username,
        password_value: objUser.password,
        address_value: objUser.address,
        dob_value: objUser.dob,
        phone_value: objUser.phone,
        usr_err: "Username must be from 4 - 32 characters",
        pwd_err: "Password must be 6 - 32 characters"
    };
    res.parts = {...res.parts, ...p };
    let dbrole = String(objUser.role);
    if (dbrole == "admin") {
        res.viewpath = './public/admin_profile.html';
    } else if (dbrole == "user") {
        res.viewpath = './public/Profile.html';
    }
    await database.render(res);
})

router.post("/profile", async function(req, res) {
    let success = true;
    var uid = req.cookies["login"];
    var oid = new ObjectId(uid);
    var query = { "_id": oid };
    objUser = null;
    try {
        objUser = await database.getDb().collection("account").findOne(query);
    } catch (err) {
        console.log("error");
    }
    if (objUser == null) {
        res.send("User with id '" + uid + "' cannot be found!");
        return;
    }

    let parts = {
        balance_value: objUser.balance,
        user_name: objUser.usernme,
        email_value: objUser.email,
        user_value: objUser.username,
        password_value: objUser.password,
        address_value: objUser.address,
        dob_value: objUser.dob,
        phone_value: objUser.phone,
        usr_err: "Username must be from 4 - 32 characters",
        pwd_err: "Password must be 6 - 32 characters"
    };

    // if (req.file != undefined) {
    //     var filename = objUser["username"] + ".jpg";
    //     await sharp(req.file.path)
    //         .resize(100, 100)
    //         .jpeg({ quality: 100, progressive: true })
    //         .toFile('public/profile_pics/' + filename)
    //     fs.unlink(req.file.path);
    //     objUser["avatar"] = 'profile_pics/' + filename;
    // }

    if (req.body.username.length < 4 || req.body.username.length > 32) {
        parts["usr_err"] = "<span style='color:red'>Username length is not valid</span>";
        success = false;
    } else {
        var query = { "_id": { $ne: oid }, username: req.body.username };
        result = null;
        try {
            result = await database.getDb().collection("account").findOne(query);
        } catch (err) {
            console.log("error");
        }
        if (result != null) {
            parts["usr_err"] = "<span style='color:red'>Username '" + req.body.username + "' has been used already</span>";
            success = false;
        }
    }
    objUser["username"] = req.body.username;
    objUser["email"] = req.body.email;
    if (req.body["password"] != "") {
        if (req.body["password"].length < 6 || req.body["password"].length > 32) {
            parts["pwd_err"] = "<span style='color:red'>Password length is not valid</span>";
            success = false;
        } else {
            let dbpass = req.body["password"];
            objUser["password"] = dbpass;
        }
    }

    if (req.body.confirm != req.body.password) {
        success = false;
    }

    if (success) {
        var query = { "_id": oid };
        try {
            const result = await database.getDb().collection("account").updateOne(query, { $set: objUser });
        } catch (err) {
            console.log(err)
            res.send("500 error updating db")
            return;
        }
    }

    res.parts = {...res.parts, ...parts };
    let dbrole = String(objUser.role);
    if (dbrole == "admin") {
        res.viewpath = './public/admin_profile.html';
    } else if (dbrole == "user") {
        res.viewpath = './public/Profile.html';
    }
    await database.render(res)
})

router.get("/sign_out", function(req, res) {
    res.clearCookie('login')
    res.redirect(302, "/home_page")
})

module.exports = router