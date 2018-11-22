let mysql = require('mysql');
const DATABASE_POOL = false;

let pool = mysql.createPool({
    host: 'cmpe226.cesec0b1q06m.us-east-1.rds.amazonaws.com',
    user: 'root',
    password: 'toor*root',
    database: 'respondmedb',
    connectionLimit: 10, // this is the max number of connections before your pool starts waiting for a release
});

//Put your mysql configuration settings - user, password, database and port
function getConnection() {

    var connection = mysql.createConnection({
        host: 'cmpe226.cesec0b1q06m.us-east-1.rds.amazonaws.com',
        user: 'root',
        password: 'toor*root',
        database: 'respondmedb',
        port: 3306
    });

    checkConnection(connection);

    return connection;
}

function checkConnection(connection) {
    connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ...");
        } else {
            console.log("Error connecting database ...");
        }
    });
}

function fetchData(callback, sqlQuery) {

    console.log("\nSQL Query::" + sqlQuery);

    var connection = getConnection();

    checkConnection(connection);

    connection.query(sqlQuery, function (err, rows, fields) {
        if (err) {
            console.log("ERROR: " + err.message);
        }
        else {	// return err or result
            console.log("DB Results:" + rows);
            callback(err, rows);
        }
    });
    console.log("\nConnection closed..");
    connection.end();
}

function fetchObjData(callback, obj, sqlQuery) {

    console.log("\nSQL Query::" + sqlQuery);

    var connection = getConnection();

    checkConnection(connection);

    connection.query(sqlQuery, obj, function (err, rows, fields) {
        if (err) {
        }
        else {	// return err or result
            callback(err, rows);
        }
    });
    console.log("\nConnection closed..");
    connection.end();
}
exports.getConnection = getConnection;
exports.fetchData = fetchData;
exports.fetchObjData = fetchObjData;
exports.DATABASE_POOL = DATABASE_POOL;
exports.pool = pool;