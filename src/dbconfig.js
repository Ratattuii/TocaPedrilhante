const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'bxqqfmfsq9wwiddwznzj-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'uwfgvvtrntb5tysj',
    password: 'DS9Bw9Hf6xrC6pB0eZKl',
    database: 'bxqqfmfsq9wwiddwznzj'
});

// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT || 3306,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
// });

db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('MySQL conectado');
    }
});

module.exports = db;
