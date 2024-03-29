const mysql         = require('../mysql/mysql');
const DATABASE_POOL = require('../mysql/mysql');
var { authenticate }    = require('../middleware/authentication');
const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

// Dashboard survey (Created by you) - POST: '/dashboardCreatedByYou'
router.post('/dashboardCreatedByYou', function(req,res) {

    let username = req.body.username;


    let getSurveys = "SELECT *, (SELECT count(*) FROM INVITES "+
                                    "WHERE s_id = s1.id " +
                                    "GROUP BY s_id) invite_count, " +
                                "(SELECT count(*) FROM RESPONSE " +
                                    "WHERE survey_id = s1.id " +
                                    "GROUP BY survey_id) response_count " +
                    "FROM SURVEY s1 "+
                    "WHERE screated_by = ?"

    mysql.pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }

        // successful connection...
        connection.query(getSurveys, [username], function (err, rows) {
            if (err) {
                logger.error(err);        
                connection.release();
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows.length > 0) {
                
                // rows.map((row) => {
                //     surveyIds.push(row.id);
                // });
                // console.log('surveyIds');
                // console.log(surveyIds);
                res.status(200).send({survey_data: rows, message: "Surveys sent"});
            } else {
                // No matching data.
                res.status(400).send(responseJSON("NO_DATA"));
            }

            // Release the connection
            connection.release();
        });
    });
});

// Dashboard survey (Responded by you) - POST: '/dashboardResondedByYou'
router.post('/dashboardResondedByYou', function(req,res) {
    
    let username = req.body.username;

    let getSurveys = "SELECT (SELECT count(*) FROM INVITES "+
                                    "WHERE s_id = r1.survey_id " +
                                    "GROUP BY s_id) invite_count, " +
                                "(SELECT count(*) FROM RESPONSE " +
                                    "WHERE survey_id = r1.survey_id " +
                                    "GROUP BY survey_id) response_count, s1.sname, s1.stype, s1.screated_date, s1.svalidity, s1.id " +
                    "FROM RESPONSE r1 JOIN respondmedb.SURVEY s1 ON r1.survey_id = s1.id "+
                    "WHERE user_email = ?";

    mysql.pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }

        // successful connection...
        connection.query(getSurveys, [username], function (err, rows) {
            if (err) {
                logger.error(err);              
                connection.release();
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows.length > 0) {
                
                res.status(200).send({survey_data: rows, message: "Surveys sent"});
            } else {
                // No matching data.
                res.status(400).send(responseJSON("NO_DATA"));
            }

            // Release the connection
            connection.release();
        });
    });
});

// Dashboard survey (Get All user cities for filtering) - GET: '/getUserCities'
router.get('/getUserCities', function(req,res) {

    let getUserCities = "SELECT distinct(city) "+
                        "FROM USER "+
                        "WHERE city IS NOT NULL"


    mysql.pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }

        // successful connection...
        connection.query(getUserCities, function (err, rows) {
            if (err) {
                logger.error(err);                
                connection.release();
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows.length > 0) {
                
                res.status(200).send({survey_data: rows, message: "Surveys sent"});
            } else {
                // No matching data.
                res.status(400).send(responseJSON("NO_DATA"));
            }

            // Release the connection
            connection.release();
        });
    });
});

// Dashboard Survey Statistics (Response Vs No Response trend) - POST: '/surveyResponseTrend'
router.post('/surveyResponseTrend', function(req,res) {
    
    console.log('req.body');
    console.log(JSON.stringify(req.body));
    let survey_id = req.body.survey_id;

    // let getResonseTrend = "SELECT question_id, count(rd1.id) responded, ( SELECT count(id) FROM RESPONSE " +
    //                                                                     "WHERE survey_id = ? ) total " +
    //                         "FROM RESPONSE_DETAIL rd1 " +
    //                         "WHERE response_id IN ( SELECT id FROM RESPONSE "+
    //                                                     "WHERE survey_id = ? ) " +
    //                         "GROUP BY question_id " +
    //                         "ORDER BY question_id";

    let getResonseTrend = "SELECT question_id, question_text qtext, " +
                            "responded, total " +
                            "FROM QUESTION_RESPONSE_CHART qrc " +
                            "WHERE survey_id = ? "
                            "ORDER BY question_id";

    mysql.pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }

        // successful connection...
        connection.query(getResonseTrend, [survey_id, survey_id], function (err, rows) {
            if (err) {
                logger.error(err);
                connection.release();
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows.length > 0) {
                
                res.status(200).send({survey_data: rows, message: "Surveys sent"});
            } else {
                // No matching data.
                res.status(400).send(responseJSON("NO_DATA"));
            }

            // Release the connection
            connection.release();
        });
    });
});

// Dashboard Survey Statistics (Filtered Response Vs No Response trend) - POST: '/filteredResponseTrend'
router.post('/filteredResponseTrend', function(req,res) {
    
    console.log('req.body');
    console.log(JSON.stringify(req.body));
    let survey_id = req.body.survey_id;
    let filterCity = req.body.filterCity;
    let filterGender = req.body.filterGender;


    let getFilteredResonseTrend = `CALL getFilteredResponseTrend(?, ?, ?)`;

    mysql.pool.getConnection(function (err, connection) {
        if (err) {
            return res.status(400).send(responseJSON("SERVER_someError"));
        }

        // successful connection...
        connection.query(getFilteredResonseTrend, [survey_id, filterCity, filterGender], function (err, rows) {
            if (err) {
                logger.error(err);
                connection.release();
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows.length > 0) {
                
                res.status(200).send({survey_data: rows, message: "Surveys sent"});
            } else {
                // No matching data.
                res.status(400).send(responseJSON("NO_DATA"));
            }

            // Release the connection
            connection.release();
        });
    });
});

// Dashboard Survey Statistics (Options trend) - POST: '/surveyOptionTrend'
router.post('/surveyOptionTrend', function(req,res) {
    
    console.log('req.body');
    console.log(JSON.stringify(req.body));
    let survey_id = req.body.survey_id;

    // SINGLE Query solution
    // let query = "SELECT * from (SELECT question_id, option_id, count(id)
    // FROM respondmedb.RESPONSE_DETAIL rd1 JOIN respondmedb.QUESTION q ON (rd1.question_id = q.qid) AND q.qtype <> 'TEXT'
    // WHERE response_id IN ( SELECT id FROM respondmedb.RESPONSE
    //                 WHERE survey_id = '1' )
    // group by question_id, option_id) as T1 right join (SELECT * FROM respondmedb.`OPTION`
    // WHERE q_id IN (SELECT qid from respondmedb.QUESTION
    //                 WHERE s_id = '1')) as T2 ON T1.option_id = T2.id   

    let getOptionsTrend = "SELECT qtext, question_id, option_id, count(id) option_count " +
                        "FROM RESPONSE_DETAIL rd1 JOIN QUESTION q " +
                                                                "ON (rd1.question_id = q.qid) AND q.qtype IN ('Checkbox Question', 'Radio Question')  "+
                    "WHERE response_id IN ( SELECT id FROM RESPONSE " +
                                                "WHERE survey_id = ? ) " +
                    "group by question_id, option_id";

                    //q.qtype <> 'TEXT' && 'Date

    mysql.pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }

        // successful connection...
        connection.query(getOptionsTrend, [survey_id], function (err, rows) {
            if (err) {
                logger.error(err);               
                connection.release();
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows.length > 0) {
                
                // res.status(200).send({survey_data: rows, message: "Surveys sent"});
                let getOptionsDetails = "SELECT * FROM `OPTION` o JOIN QUESTION q " +
                                                                    "ON (o.q_id = q.qid) AND q.qtype IN ('Checkbox Question', 'Radio Question') AND s_id = ? ";

                mysql.pool.getConnection(function (err, connection2) {
                    if (err) {
                        return res.status(400).send(responseJSON("SERVER_someError"));
                    }

                    // successful connection...
                    connection2.query(getOptionsDetails, [survey_id], function (err, rows2) {
                        if (err) {
                            logger.error(err);
                            connection2.release();
                            return res.status(400).send(responseJSON("SERVER_someError"));
                        }

                        if (rows2.length > 0) {

                            let tempResult = [];
                            let found;
                            rows2.map((row) => {

                                let element = {
                                    question_id: row.q_id,
                                    option_id: row.id,
                                    option_value: row.value,
                                    question_text: row.qtext,
                                    option_count: 0
                                }
                                for (let i in rows) {
                                    if(row.id == rows[i].option_id) {
                                        element = {
                                            question_id: row.q_id,
                                            option_id: row.id,
                                            option_value: row.value,
                                            question_text: row.qtext,
                                            option_count: rows[i].option_count
                                        }
                                    }
                                }
                                tempResult.push(element);
                            });
                            res.status(200).send({survey_data: tempResult, message: "Surveys sent"});
                        } else {
                            // No matching data.
                            res.status(400).send(responseJSON("NO_DATA"));
                        }

                        // Release the connection
                        connection2.release();
                    });
                });                
            } else {
                // No matching data.
                res.status(400).send(responseJSON("NO_DATA"));
            }

            // Release the connection
            connection.release();
        });
    });
});

// Dashboard Survey Statistics (Filtered Options trend) - POST: '/filteredOptionTrend'
router.post('/filteredOptionTrend', function(req,res) {
    
    console.log('req.body');
    console.log(JSON.stringify(req.body));
    let survey_id = req.body.survey_id;
    let filterCity = req.body.filterCity;
    let filterGender = req.body.filterGender;
          
    let getFilteredOptionTrend = `CALL getFilteredOptionTrend(?, ?, ?)`;

    mysql.pool.getConnection(function (err, connection) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }

        // successful connection...
        connection.query(getFilteredOptionTrend, [survey_id, filterCity, filterGender], function (err, rows1) {
            if (err) {
                logger.error(err);
                connection.release();
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            console.log("========rows1============");

            var rows2 = rows1[0];
            if (rows2.length > 0) {

                let tempResult = [];
                rows2.map((row) => {

                    let element = {
                        question_id: row.q_id,
                        option_id: row.id,
                        option_value: row.value,
                        question_text: row.qtext,
                        option_count: 0
                    }

                    if(row.option_count !== null) {
                        element = {
                            question_id: row.q_id,
                            option_id: row.id,
                            option_value: row.value,
                            question_text: row.qtext,
                            option_count: row.option_count
                        }
                    }
                    
                    tempResult.push(element);
                });
                res.status(200).send({survey_data: tempResult, message: "Surveys sent"});
            } else {
                // No matching data.
                res.status(400).send(responseJSON("NO_DATA"));
            }

            // Release the connection
            connection.release();
        });
    });
});

function responseJSON(responseType) {
    switch (responseType) {
        case "INVALID_session":
            return { message: 'Invalid Session. Please login again!' };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        case "INVALID_login":
            return { message: "The username and password you entered did not match our records. Please double-check and try again." };
        case "NO_DATA":
            return { message: "There are no rows matching." };
        default:
            return { message: 'Some error with database connection.' };
    }
}

module.exports = router;