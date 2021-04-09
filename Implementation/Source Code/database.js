var fs = require("fs")
var MongoClient = require("mongodb").MongoClient

class Database {

    _dbo = null

    constructor() {
        var self = this
        MongoClient.connect("mongodb+srv://sadin:Quocdat@123@cluster0.ckwoi.mongodb.net/SQA?retryWrites=true&w=majority", { useUnifiedTopology: true }, function(err, client) {
            if (err) throw err
            self._dbo = client.db("SQA") // select the database
            console.log("DB connected!")
        })
    }

    getDb() {
        return this._dbo;
    }

    randStr(len) {
        let s = '';
        while (s.length < len) s += Math.random().toString(36).substr(2, len - s.length)
        return s
    }

    // connect(self){
    //     MongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, function(err, client) {
    //         if (err) throw err
    //         self._dbo = client.db("SQA") // select the database
    //         console.log("DB connected!")
    //     })
    // }

    // close() {
    //     return MongoClient.
    //   }

    async render(res) {
        await fs.readFile(res.viewpath, 'utf8', function(err, data) {
            const keys = Object.keys(res.parts)
            keys.forEach(function(item) {
                data = data.replace("{" + item + "}", res.parts[item])
            })
            res.send(data)
        })
    }
}

module.exports = new Database()