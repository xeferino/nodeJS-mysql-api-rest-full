const mysql = require('mysql');
const { promisify } = require('util');


const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            Console.error('Database connection was closed');        
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            Console.error('Database HAS TO MANY CONNECTIONS');        
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            Console.error('Database HAS TO MANY CONNECTIONS');        
        }
        if (err.code === 'ECONNREFUSED') {
            Console.error('Database CONNECTION WAS REFUSED');        
        }
    }
    if (connection) connection.release();
    console.log('DB is Connected');
});

//promisify of query
pool.query = promisify(pool.query);

module.exports = pool;
