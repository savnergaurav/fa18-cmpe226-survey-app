const mysql = require("../mysql/mysql");
const { DATABASE_POOL } = require("../mysql/mysql");
const logger = require("../config/logger");

// nodemailer for mailing service
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "no.reply.saket.relan@gmail.com",
    pass: "CMPE273@123"
  }
});

var mailHelper = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "do.not.reply.rohit@gmail.com",
    pass: "Zxcvbn~!2017"
  }
});

exports.createSurvey = function createSurvey(req, res) {

  let url = this.guid();
  let surveyType = '';
  switch(req.body.surveyType) {
      case 'Invite Only': 
          surveyType = 'invited';
          break;
      case 'General': 
          surveyType = 'general';
          break;
      case 'Volunteer': 
          surveyType = 'voluntary';
          break;            
  }
  let survey_url = `http://localhost:3000/response/${surveyType}/${url}`
  console.log('url');
  console.log(url);
  console.log("Re Body : ", req.body)
  var surveyDetails = {
      "sname": req.body.surveyName,
      "sdesc": req.body.surveyDesc,
      "stype": req.body.surveyType,
      "svalidity": new Date(req.body.validDate),
      "screated_date": new Date(),
      "surl": url,
      "screated_by": req.body.createdBy
  }
  console.log("Inside Survey Controller : ", surveyDetails);
  var insertQuery = "INSERT INTO SURVEY SET ?";
  if (DATABASE_POOL) {
      console.log("NO DATABASE POOL");
      mysql.pool.getConnection(function (err, connection) {
          if (err) {
              console.log("Error connectiong : ", err);
              logger.error(err);
              return res.status(400).send(responseJSON("SERVER_someError"));
          }
          else {
              console.log("Connected");
              connection.query(insertQuery, surveyDetails, function (err, rows) {
                  if (err) {
                      logger.error(err);
                      connection.release();
                      return res.status(400).send(responseJSON("SERVER_someError"));
                  }
                  else {
                      console.log("Inside Insert Success");
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
                          var mailOptions = {
                              // to: results.value.email,
                              from: 'youremail@gmail.com',
                              to: req.body.inviteEmails,
                              subject: 'You have been invited to respond to Survey!!!',
                              text: 'Dear User,\n \nYou are invited to respond to this survey. Please click on the below link to directly respond to the survey.' +
                              '\n\nSurvey Link: ' + survey_url
                          };

                          console.log("Mail Triggered");
                          mailHelper.sendMail(mailOptions, function (err, info) {
                              if (err) {
                                  logger.error(err);
                                  console.log(err);
                              } else {
                                  console.log('Email sent: ' + info.response);
                              }
                          });


                          let sql = `CALL insertInviteList(?)`;
                          let values = [rows.insertId, surveyDetails.screated_by, emails];
                          connection.query(sql, [values], (err, results) => {
                              if (err) {
                                  console.log("SQL ERROR", err);
                                  logger.error(err);
                                  connection.release();
                                  return res.status(400).send(responseJSON("SERVER_someError"));
                              }
                              else{
                                  console.log("SQL ERROR else");
                                  // res.status(200).send({ s_id: rows.insertId, surveyName: surveyDetails.sname, message: "Survey Created Successfully" });
                                  // connection.release();
                              }
                          })
                      }
                      console.log("NO SQL ERROR");
                      res.status(200).send({ s_id: rows.insertId, surveyName: surveyDetails.sname, message: "Survey Created Successfully" });
                      connection.release();
                  }
              });
              // res.status(200).send({ s_id: rows.insertId, surveyName: surveyDetails.sname, message: "Survey Created Successfully" });
              // connection.release();
          }
      });
  } else {
      mysql.fetchObjData(function (err, rows) {
          if (err) {
              logger.error(err);
              return res.status(400).send(responseJSON("SERVER_someError"));
          }
          console.log("Rows : ", rows);
          res.status(200).send({ surveyName: rows[1], message: "Survey Created Successfully" });
      }, surveyDetails, insertQuery);

  }
}

guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

// FETCH SURVEY CREATED BY LOGGED IN USER - GET: '/fetchMySurveys'
exports.fetchMySurveys = function fetchMySurveys(req, res) {
  // req will give email, use that to query database
  // console.log(req.body.email);
  // query survey table
  var sql =
    "SELECT id, sname, stype, surl FROM SURVEY WHERE screated_by = " +
    mysql.pool.escape(req.body.email);

  if (DATABASE_POOL) {
    mysql.pool.getConnection(function(err, connection) {
      if (err) {
        logger.error(err);
        return res.status(400).send(responseJSON("SERVER_someError"));
      }

      // if you got a connection...
      connection.query(sql, function(err, rows, fields) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }
        let mySurveys = [];
        for (let i = 0; i < rows.length; i++) {
          let surveyObjs = {
            // surveyId: rows[i].id,
            surveyName: rows[i].sname,
            surveyUrl: ""
          };

          switch (rows[i].stype) {
            case "Invite Only":
              surveyObjs.surveyUrl = `http://localhost:3000/response/invited/${rows[i].surl}`;
              break;
            case "General":
              surveyObjs.surveyUrl = `http://localhost:3000/response/general/${rows[i].surl}`;
              break;
            case "Volunteer":
              surveyObjs.surveyUrl = `http://localhost:3000/response/voluntary/${rows[i].surl}`;
              break;
          }

          mySurveys.push(surveyObjs);
        }
        return res.status(200).send({mySurveys: mySurveys});
      });
    });
  }
};

// FETCH SURVEY SHARED WITH LOGGED IN USER - GET: '/fetchSharedWithMe'
exports.fetchSharedWithMe = function fetchSharedWithMe(req, res) {
  // console.log(`Inside fetchSharedWithMe`);

  // getting the user email from req.body.email, query invites table
  var sql =
    "SELECT id, sname, stype, surl FROM SURVEY as s WHERE s.id in (SELECT s_id FROM INVITES WHERE invite_email = " +
    mysql.pool.escape(req.body.email) +
    ")";

  if (DATABASE_POOL) {
    mysql.pool.getConnection(function(err, connection) {
    if (err) {
        logger.error(err);
        return res.status(400).send(responseJSON("SERVER_someError"));
    }

      // if you got a connection...
      connection.query(sql, function(err, rows, fields) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }
        let sharedWithMe = [];
        for (let i = 0; i < rows.length; i++) {
          let surveyObjs = {
            // surveyId: rows[i].id,
            surveyName: rows[i].sname,
            surveyUrl: ""
          };

          switch (rows[i].stype) {
            case "Invite Only":
              surveyObjs.surveyUrl = `http://localhost:3000/response/invited/${rows[i].surl}`;
              break;
            case "General":
              surveyObjs.surveyUrl = `http://localhost:3000/response/general/${rows[i].surl}`;
              break;
            case "Volunteer":
              surveyObjs.surveyUrl = `http://localhost:3000/response/voluntary/${rows[i].surl}`;
              break;
          }

          sharedWithMe.push(surveyObjs);
        }
        return res.status(200).send({sharedWithMe: sharedWithMe});
      });
    });
  }
};

// FETCH VOLUNTARY SURVEY - GET: '/fetchSharedWithMe'
exports.fetchVolunteerSurvey = function fetchVolunteerSurvey(req, res) {
  // console.log(`Inside fetchVolunteerSurvey`);

  var sql = 'SELECT id, sname, stype, surl FROM SURVEY where stype = "Volunteer"';

  if (DATABASE_POOL) {
    mysql.pool.getConnection(function(err, connection) {
      if (err) return res.status(400).send(responseJSON("SERVER_someError"));

      // if you got a connection...
      connection.query(sql, function(err, rows, fields) {
        if (err) {
            logger.error(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
        }
        let voluntarySurveys = [];
        for (let i = 0; i < rows.length; i++) {
          let surveyObjs = {
            surveyId: rows[i].id,
            surveyName: rows[i].sname,
            surveyUrl: ""
          };

          switch (rows[i].stype) {
            case "Invite Only":
              surveyObjs.surveyUrl = `http://localhost:3000/response/invited/${rows[i].surl}`;
              break;
            case "General":
              surveyObjs.surveyUrl = `http://localhost:3000/response/general/${rows[i].surl}`;
              break;
            case "Volunteer":
              surveyObjs.surveyUrl = `http://localhost:3000/response/voluntary/${rows[i].surl}`;
              break;
          }

          voluntarySurveys.push(surveyObjs);
        }
        return res.status(200).send({voluntarySurveys: voluntarySurveys});
      });
    });
  }
};

exports.sendVolunteerInvite = function sendVolunteerInvite(req,res){
    var sql = 'INSERT INTO INVITES SET ?';
    var values = [req.body.surveyID, req.body.email,req.body.email];

    if (DATABASE_POOL) {

        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(sql,[values], function (err, rows, fields) {
                if (err) throw err;
                // console.log(rows);
                // send data to frontend
                else{
                    var mailOptions = {
                        // to: results.value.email,
                        from: 'youremail@gmail.com',
                        to: req.body.email,
                        subject: 'You have been invited to respond to Survey!!!',
                        text: 'Dear User,\n \nYou are invited to respond to this survey. Please click on the below link to directly respond to the survey.' +
                        '\n\nSurvey Link: ' + req.body.survey_url
                    };
                    mailHelper.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            logger.error(err);
                            console.log(err);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            })
        })
    }
}
function responseJSON(responseType) {
  switch (responseType) {
    case "INVALID_session":
      return { message: "Invalid Session. Please login again!" };
    case "CREATE_successMsg":
      return { message: "Survey Created successfully." };
    case "SERVER_someError":
      return {
        message: "There is some issue in server. Please try again later."
      };
    default:
      return { message: "Some error with database connection." };
  }
}
