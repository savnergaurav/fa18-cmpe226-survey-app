const mysql = require("../mysql/mysql");
const DATABASE_POOL = require("../mysql/mysql");
const logger = require('../config/logger');

exports.submitAnswers = function submitAnswers(req, res) {
  const { userReponse } = req.body;

  console.log(userReponse);
  let survey_id = userReponse.survey_id;
  let user_email =
    userReponse.user_email.length > 0 ? userReponse.user_email : null;

  let responses = userReponse.responses;

  let responseInsert = "";
  if (userReponse.user_email.length > 0) {
    responseInsert =
      `INSERT INTO RESPONSE(response_time, survey_id, user_email) ` +
      `VALUES (NOW(), ${survey_id}, '${user_email}')`;
  } else {
    responseInsert =
      `INSERT INTO RESPONSE(response_time, survey_id, user_email) ` +
      `VALUES (NOW(), ${survey_id}, ${user_email})`;
  }

  if (DATABASE_POOL) {
    mysql.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        return res.status(400).send(responseJSON("SERVER_someError"));
      }

      let insertResponse = new Promise(function(resolve, reject) {
        // Insert Response
        connection.query(responseInsert, function(err, rows) {
          if (err) {
            console.log(err);
            return res.status(400).send(responseJSON("SERVER_someError"));
          }
          console.log(rows);

          if (rows.insertId > 0) {
            resolve(rows.insertId);
          } else {
            reject(false);
          }
        });
      });

      insertResponse
        .then(response_id => {
          for (let i = 0; i < responses.length; i++) {
            let responseText =
              responses[i].response_text === undefined
                ? null
                : responses[i].response_text;
            let optionId =
              responses[i].option_id === undefined
                ? null
                : responses[i].option_id;

            let responseDetailObj = {
              response_text: responseText,
              response_id: response_id,
              question_id: responses[i].question_id,
              option_id: optionId
            };

            let responseDetailInsertQuery = "INSERT INTO RESPONSE_DETAIL SET ?";

            connection.query(
              responseDetailInsertQuery,
              responseDetailObj,
              function(err, rows) {
                if (err) {
                  console.log(err);
                }
                console.log(rows);
              }
            );
          }
          return res.status(200).send({
            message: "Congratulations! You have submitted the survey!"
          });
        })
        .catch(responseError => {
          console.log("Response Creation Error: " + responseError);
          return res.status(400).send({
            message: "Sorry! Response couldn't be submitted!"
          });
        });
    });
  }
};

// Validate email - If invited and If valid survey and If responded
exports.validateEmail = function validateEmail(req, res) {
  let invite_email = req.body.userEmail;
  let surveyUrl = req.body.surveyUrl;

  let surveyOutdatedSql = `SELECT 
                              COUNT(id) as cnt, id as survey_id
                            FROM
                              SURVEY
                            WHERE surl = '${surveyUrl}'
                            AND svalidity >= NOW();`;

  if (DATABASE_POOL) {
    mysql.pool.getConnection(function(err, connection) {
      if (err) {
        logger.error(`validateEmail Database Connection: ${err}`);
        return res.status(400).send(responseJSON("SERVER_someError"));
      }

      let invitedEmail = function(survey_id) {
        let inviteeEmailSql = `SELECT 
                                    COUNT(s_id) as cnt
                                FROM
                                    INVITES
                                WHERE
                                    invite_email = '${invite_email}'
                                        AND s_id = ${survey_id};`;
        return new Promise(function(resolve, reject) {
          // Check if invited
          connection.query(inviteeEmailSql, function(err, rows, fields) {
            if (err) {
              logger.error(`inviteeEmailSql Error: ${err}`);
              return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows[0].cnt === 0) {
              reject(false);
            } else {
              resolve(survey_id);
            }
          });
        });
      };

      let outdatedSurvey = new Promise(function(resolve, reject) {
        // Check if survey is outdated
        connection.query(surveyOutdatedSql, function(err, rows, fields) {
          if (err) {
            logger.error(`surveyOutdatedSql Error: ${err}`);
            return res.status(400).send(responseJSON("SERVER_someError"));
          }

          if (rows[0].cnt === 0) {
            reject(false);
          } else {
            resolve(rows[0].survey_id);
          }
        });
      });

      outdatedSurvey
        .then(survey_id => {
          invitedEmail(survey_id)
            .then(survey_id => {
              let alreadyRespondedSql = `SELECT 
                                            COUNT(survey_id) as cnt
                                        FROM
                                            RESPONSE
                                        WHERE
                                        user_email = '${invite_email}'
                                        AND survey_id = ${survey_id};`;
              // Check if responded
              connection.query(alreadyRespondedSql, function(
                err,
                rows,
                fields
              ) {
                if (err) throw err;

                if (rows[0].cnt === 0) {
                  return res.status(200).send({
                    isValidEmail: true,
                    message: "Awesome! You are good to go!"
                  });
                } else {
                  return res.status(400).send({
                    isValidEmail: false,
                    message: "Oops! You have already submitted this survey!"
                  });
                }
              });
            })
            .catch(isInvalidEmail => {
              return res.status(400).send({
                isValidEmail: isInvalidEmail,
                message: "Sorry! You are not registered for this survey!"
              });
            });
        })
        .catch(isInvalidSurvey => {
          return res.status(400).send({
            isValidEmail: isInvalidSurvey,
            message: "Sorry! Survey is no longer valid!"
          });
        });
    });
  }
};

// Fetch questions and its options as per survey
exports.fetchQuestionsAndOptions = function fetchQuestionsAndOptions(req, res) {
  let surl = req.body.surveyUrl;

  let sql = `SELECT 
                s.id as surveyId,
                s.surl as surveyUrl,
                s.sname AS surveyName,
                s.sdesc AS surveyDesc,
                q.qid AS questionId,
                q.qtype AS questionType,
                q.qtext AS questionText,
                q.qismandatory AS isMandatory,
                op.id AS optionId,
                op.value AS optionValue
             FROM
                SURVEY s
                    INNER JOIN
                QUESTION q ON s.id = q.s_id
                    LEFT JOIN
                respondmedb.OPTION op ON op.q_id = q.qid
             WHERE
                s.surl = '${surl}';`;

  if (DATABASE_POOL) {
    mysql.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        return res.status(400).send(responseJSON("SERVER_someError"));
      }

      // Fetch rows
      connection.query(sql, function(err, rows, fields) {
        if (err) {
          console.log(err);
          return res.status(400).send(responseJSON("SERVER_someError"));
        }

        let surveyQuestions = {
          surveyId: "",
          surveyUrl: "",
          surveyName: "",
          surveyDesc: "",
          questions: []
        };

        let optionsMap = new Map();
        let questionsMap = new Map();
        surveyQuestions.surveyId = rows[0].surveyId;
        surveyQuestions.surveyUrl = rows[0].surveyUrl;
        surveyQuestions.surveyName = rows[0].surveyName;
        surveyQuestions.surveyDesc = rows[0].surveyDesc;

        for (let i = 0; i < rows.length; i++) {
          let questionId = rows[i].questionId;
          if (!questionsMap.has(questionId)) {
            questionsMap.set(questionId, {
              questionId: questionId,
              questionType: rows[i].questionType,
              questionText: rows[i].questionText,
              isMandatory: rows[i].isMandatory
            });
          }

          if (optionsMap.has(questionId)) {
            optionsMap.get(questionId).push({
              optionId: rows[i].optionId,
              optionValue: rows[i].optionValue
            });
          } else {
            optionsMap.set(questionId, [
              {
                optionId: rows[i].optionId,
                optionValue: rows[i].optionValue
              }
            ]);
          }
        }

        let questionKeys = questionsMap.keys();
        for (let qKey of questionKeys) {
          let question = questionsMap.get(qKey);
          question.options = optionsMap.get(qKey);
          surveyQuestions.questions.push(question);
        }

        return res.status(200).send({
          surveyQuestions: surveyQuestions
        });
      });
    });
  }
};

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
