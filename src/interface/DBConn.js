const mysql = require('mysql2/promise');
const config = require('../config.js');

const dbConfig = {
    host: config.ServerDB,
    user: config.UserDB,
    password: config.PasswordBD,
    database: config.Database,
    port: config.PortDB
};

/**
 * Método para conectarse a la base de datos
 * @returns {mysql.Connection}
 */
function getConnection() {
    const connection = mysql.createConnection(dbConfig);
    return connection;
}

module.exports.getConnection = getConnection;
