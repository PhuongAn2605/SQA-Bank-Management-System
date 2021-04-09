var express = require("express")
var bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')
var app = express()
var authController = require("./controller/authentication")
var accController = require("./controller/accountController")
var tranController = require("./controller/transactionController")
var PORT = process.env.PORT || 5000;

// middlewares
app.use(bodyParser.urlencoded({ extended: false })) // enable req.body
app.use(express.static('public'));
app.use(cookieParser())

// // custom middlewares
// app.use(function(req, res, next) {
//     (async function() {
//         if (req.url != '/home_page') {
//             var uid = req.cookies['login']
//             if (uid != undefined) {
//                 var oid = new ObjectId(uid)
//                 var query = { "_id": oid }
//                 objUser = null
//                 try {
//                     objUser = await database.getDb().collection("account").findOne(query)
//                 } catch (err) {
//                     console.log("index.js: error")
//                 }
//                 if (objUser == null) {
//                     var err = new Error('Not authorized! Go back!');
//                     err.status = 400;
//                     return next(err);
//                 } else {
//                     res.redirect(302, "/home_page")
//                     return
//                 }
//             } else {
//                 res.redirect(302, "/home_page")
//                 return
//             }
//         }
//         next()
//     })()
// })

app.use(authController);
app.use(accController);
app.use(tranController);

app.get("/", function(req, res) {
    res.redirect(302, "/home_page");
})

app.get("/admin", function(req, res) {
    res.redirect(302, "/user_list");
})

app.listen(PORT);
// module.export={
//     app
// }

module.exports = { app };