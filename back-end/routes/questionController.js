const mysql         = require('../mysql/mysql');
const DATABASE_POOL = require('../mysql/mysql');

exports.createQuestion = function createQuestion(req,res){

    
    console.log("Inside Questions Controller : ", req.body);
    var insertQuery = "INSERT INTO QUESTION SET ?";
    if (DATABASE_POOL) {
        console.log("NO DATABASE POOL");
        mysql.pool.getConnection(function (err, connection) {
            if (err){
                console.log("Error connectiong : ", err);
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            else{
                console.log("Connected");
                req.body.questions.map((question,index) => {
                    var q = {
                        "qType" : question.qType,
                        "qText" : question.lab,
                        "s_id" :  req.body.surveyID
                    }
                    connection.query(insertQuery, q, function(err,rows){
                        if (err) {
                            console.log("CONNECTION ERROR : ", err);
                            connection.release();
                            return res.status(400).send(responseJSON("SERVER_someError"));
                        }else{
                            if(question.qType == "Radio Question" || question.qType == "Checkbox Question"){
                                var op = "";
                                var len = question.options.length;
                                question.options.map((o,index) => {
                                    if(index == (len -1))
                                        op += o;
                                    else    
                                        op += o + ",";
                                })
                                let sql = `CALL insertOptionsList(?)`;
                                let values = [op,rows.insertId];
                                connection.query(sql,[values],(err,results) => {
                                    if (err) {
                                        console.log("SQL ERROR",err);
                                        connection.release();
                                        return res.status(400).send(responseJSON("SERVER_someError"));
                                    }
                                    res.status(200).send({message: "Questions Created Successfully"});
                                    connection.release();
                                })
                            }
                            // res.status(200).send({message: "Questions Created Successfully"});
                            // connection.release();
                        }
                    })
                })
            }
        });
    } else {
        // mysql.fetchObjData(function (err, rows) {
        //     if (err) {
        //         return res.status(400).send(responseJSON("SERVER_someError"));
        //     }
        //     console.log("Rows : ", rows);
        //     res.status(200).send({surveyName: rows[1], message: "Survey Created Successfully"});
        // }, surveyDetails, insertQuery);

    }
}

function responseJSON(responseType) {
    switch (responseType) {
        case "INVALID_session":
            return { message: 'Invalid Session. Please login again!' };
        case "CREATE_successMsg":
            return { message: 'Question Created successfully.' };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        default:
            return { message: 'Some error with database connection.' };
    }
}