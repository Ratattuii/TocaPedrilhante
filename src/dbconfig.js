const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'TocaPedrilhante'
});

db.connect((err) => {
    if(err) {
        throw err;
    } else {
        console.log('MySQL conectado');
    }
});

module.exports = db;