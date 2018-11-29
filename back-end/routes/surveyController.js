const mysql = require('../mysql/mysql');
const DATABASE_POOL = require('../mysql/mysql');

exports.createSurvey = function createSurvey(req, res) {

    var surveyDetails = {
        "sname": req.body.surveyName,
        "sdesc": req.body.surveyDesc,
        "stype": req.body.surveyType,
        "svalidity": new Date(req.body.validDate),
        "screated_date": new Date(),
        "screated_by": "gaurav@gmail.com"
    }
    console.log("Inside Survey Controller : ", surveyDetails);
    var insertQuery = "INSERT INTO SURVEY SET ?";
    if (DATABASE_POOL) {
        console.log("NO DATABASE POOL");
        mysql.pool.getConnection(function (err, connection) {
            if (err) {
                console.log("Error connectiong : ", err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            else {
                console.log("Connected");
                connection.query(insertQuery, surveyDetails, function (err, rows) {
                    if (err) {
                        connection.release();
                        return res.status(400).send(responseJSON("SERVER_someError"));
                    }
                    else {
                        if (req.body.surveyType == "Invite Only") {
                            emails = "";
                            var len = req.body.inviteEmails.length;
                            req.body.inviteEmails.map((e, index) => {
                                if (index == (len - 1))
                                    emails += e;
                                else
                                    emails += e + ",";
                            })
                            //console.log("Emails : ", emails);
                            let sql = `CALL insertInviteList(?)`;
                            let values = [rows.insertId, surveyDetails.screated_by, emails];
                            connection.query(sql, [values], (err, results) => {
                                if (err) {
                                    console.log("SQL ERROR", err);
                                    connection.release();
                                    return res.status(400).send(responseJSON("SERVER_someError"));
                                }
                                //console.log("Rows : ", rows.insertId);
                                // 
                            })
                        }
                        res.status(200).send({ s_id: rows.insertId, surveyName: surveyDetails.sname, message: "Survey Created Successfully" });
                        connection.release();
                    }
                });
            }
        });
    } else {
        mysql.fetchObjData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            console.log("Rows : ", rows);
            res.status(200).send({ surveyName: rows[1], message: "Survey Created Successfully" });
        }, surveyDetails, insertQuery);

    }
}
// FETCH SURVEY CREATED BY LOGGED IN USER - GET: '/fetchMySurveys'
exports.fetchMySurveys = function fetchMySurveys(req, res) {

    // req will give email, use that to query database
    // console.log(req.body.email);
    // query survey table
    var sql = 'SELECT * FROM SURVEY WHERE screated_by = ' + mysql.pool.escape(req.body.email);

    if (DATABASE_POOL) {

        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(sql, function (err, rows, fields) {
                if (err) throw err;
                // console.log(rows);
                // send data to frontend
                res.json(rows);
            })
        })
    }
}

// FETCH SURVEY SHARED WITH LOGGED IN USER - GET: '/fetchSharedWithMe'
exports.fetchSharedWithMe = function fetchSharedWithMe(req, res) {
    // console.log(`Inside fetchSharedWithMe`);

    // getting the user email from req.body.email, query invites table
    var sql = 'SELECT id, sname, surl FROM SURVEY as s WHERE s.id in (SELECT s_id FROM INVITES WHERE invite_email = ' + mysql.pool.escape(req.body.email) + ')';

    if (DATABASE_POOL) {

        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(sql, function (err, rows, fields) {
                if (err) throw err;
                // send data to frontend
                res.json(rows);
            })
        })
    }
}

// FETCH VOLUNTARY SURVEY - GET: '/fetchSharedWithMe'
exports.fetchVolunteerSurvey = function fetchVolunteerSurvey(req, res) {
    // console.log(`Inside fetchVolunteerSurvey`);

    var sql = 'SELECT id, sname, surl FROM SURVEY where stype = "VOLUNTARY"';

    if (DATABASE_POOL) {

        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(sql, function (err, rows, fields) {
                if (err) throw err;
                // console.log(rows);
                // send data to frontend
                res.json(rows);
            })
        })
    }
}

function responseJSON(responseType) {
    switch (responseType) {
        case "INVALID_session":
            return { message: 'Invalid Session. Please login again!' };
        case "CREATE_successMsg":
            return { message: 'Survey Created successfully.' };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        default:
            return { message: 'Some error with database connection.' };
    }
}