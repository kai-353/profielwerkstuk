const mysql = require("mysql");

config = {
    host      : 'localhost',
    user      : "root",
    password  : "",
    database  : "nodemysqltest"
}

// module.exports = function () {
//     return {
//         host      : 'localhost',
//         user      : "root",
//         password  : "",
//         database  : "nodemysqltest"
//     };
//   };

module.exports = function () {
    var db = mysql.createConnection({
        host      : 'localhost',
        user      : "root",
        password  : "",
        database  : "geluksproject"
    });
    db.connect((err) => {
        if(err) {
            throw err;
        }
        console.log("Connected");
    });
    return db;
}