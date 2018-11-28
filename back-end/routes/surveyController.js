// Survey Controller - Handles fetching survey for current logged in user

const mysql = require('../mysql/mysql');
const DATABASE_POOL = require('../mysql/mysql');

// FETCH SURVEY CREATED BY LOGGED IN USER - GET: '/fetchMySurveys'
exports.fetchMySurveys = function fetchMySurveys(req, res) {

    // req will give email, use that to query database
    console.log(req.body.email);
    // query survey table
    var sql = 'SELECT * FROM SURVEY WHERE screated_by = ' + mysql.pool.escape(req.body.email);

    if (DATABASE_POOL) {

        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(sql, function (err, rows, fields) {
                if (err) throw err;
                console.log(rows);
                // send data to frontend
            })
        })
    }
    res.send({ "Reply": "done" });
}

// FETCH SURVEY SHARED WITH LOGGED IN USER - GET: '/fetchSharedWithMe'
exports.fetchSharedWithMe = function fetchSharedWithMe(req, res) {
    console.log(`Inside fetchSharedWithMe`);
}

// FETCH VOLUNTARY SURVEY - GET: '/fetchSharedWithMe'
exports.fetchVolunteerSurvey = function fetchVolunteerSurvey(req, res) {
    console.log(`Inside fetchVolunteerSurvey`);
}
