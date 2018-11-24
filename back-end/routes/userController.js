// User Controller - Handles Login, Registration, Logout
const bcrypt = require('bcryptjs');
const mysql = require('../mysql/mysql');
const DATABASE_POOL = require('../mysql/mysql');

// REGISTRATION - POST: '/register'
exports.registerUser = function registerUser(req, res) {

    let user = {
        "email": req.body.email,
        "password": req.body.password,
    };

    console.log("Inside registerUser");

    var sql = "INSERT INTO USER (email, password) VALUES (?)";

    if (DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err) {
                console.log("Error from first if");
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    // Store hash in database
                    user.password = hash;
                    var values = [req.body.email, user.password];
                    console.log(user.password);
                    // if you got a connection...
                    connection.query(sql, [values], function (err, rows) {

                        if (err) {
                            connection.release();
                            if (err.code === "ER_DUP_ENTRY") {
                                if (err.sqlMessage.match(/email_UNIQUE/g) == "email_UNIQUE")
                                    return res.status(400).send(responseJSON("REG_errorEmail"));
                                else if (err.sqlMessage.match(/username_UNIQUE/g) == "username_UNIQUE")
                                    return res.status(400).send(responseJSON("REG_errorUsername"));
                            } else {
                                console.log("Error from here");
                                return res.status(400).send(responseJSON("SERVER_someError"));
                            }
                        }

                        // User registered successfully.
                        res.status(200).send(responseJSON("REG_successMsg"));

                        // Release the connection
                        connection.release();
                    });
                });
            });
        });
    } else {

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                // Store hash in database
                user.password = hash;
                mysql.fetchObjData(function (err, rows) {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            if (err.sqlMessage.match(/email_UNIQUE/g) == "email_UNIQUE")
                                return res.status(400).send(responseJSON("REG_errorEmail"));
                            else if (err.sqlMessage.match(/username_UNIQUE/g) == "username_UNIQUE")
                                return res.status(400).send(responseJSON("REG_errorUsername"));
                        } else
                            return res.status(400).send(responseJSON("SERVER_someError"));
                    }
                    // User registered successfully.
                    res.status(200).send(responseJSON("REG_successMsg"));
                }, user, sql);
            });
        });
    }
}

// LOGIN - POST: '/login'
exports.loginUser = function authenticateUser(req, res) {

    let username = req.body.username;
    let password = req.body.password;

    let getUser = "SELECT * FROM USER " +
        "WHERE username = ?";
    let valuesTwo = [, req.body.password];

    if (DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(getUser, [username], function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }

                if (rows.length > 0) {
                    bcrypt.compare(password, rows[0].password, function (err, resp) {
                        if (resp) {
                            // Passwords match && User was found.
                            req.session.user = username;
                            res.status(200).send({ user: rows[0], message: "Login Successful" });
                        } else {
                            // Passwords don't match
                            res.status(401).send(responseJSON("INVALID_login"));
                        }
                    });
                }
                else // User doesn't exist.
                    res.status(400).send(responseJSON("INVALID_user"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchObjData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }

            if (rows.length > 0) {
                bcrypt.compare(password, rows[0].password, function (err, resp) {
                    if (resp) {
                        // Passwords match && User was found.
                        req.session.user = username;
                        res.status(200).send({ user: rows[0], message: "Login Successful" });
                    } else {
                        // Passwords don't match
                        res.status(401).send(responseJSON("INVALID_login"));
                    }
                });
            }
            else // User doesn't exist.
                res.status(400).send(responseJSON("INVALID_user"));
        }, [username], getUser);
    }
}

// SESSION CHECK - POST: '/authenticateUser'
exports.authenticateUser = function authenticateUser(req, res) {

    let username = req.body.sessionUsername;

    let authUser = "SELECT * FROM users " +
        "WHERE username = ?";

    if (DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(authUser, [username], function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                if (rows.length > 0) {
                    // User found.
                    res.status(200).send({ user: rows[0], message: "Authentication Successful!" });
                }
                else // User doesn't exist. Hence, invalid session.
                    res.status(401).send(responseJSON("INVALID_session"));

                // Release the connection
                connection.release();
            });
        });
    } else {
        mysql.fetchObjData(function (err, rows) {
            if (err) {
                return res.status(400).send(responseJSON("SERVER_someError"));
            }
            if (rows.length > 0) {
                // User found.
                res.status(200).send({ user: rows[0], message: "Authentication Successful!" });
            }
            else // User doesn't exist. Hence, invalid session.
                res.status(401).send(responseJSON("INVALID_session"));
        }, [username], authUser);
    }
}

// LOGOUT - POST: '/logout'
exports.logoutUser = function logoutUser(req, res) {

    if (req.session.user) {
        req.session.destroy();
        console.log("LOGGED OUT: Session Invalidated" + '\n');
        res.status(200).send(responseJSON("LOGOUT_success"));
    } else {
        console.log("LOGOUT_FAILED: Session Invalidation Failed!" + '\n');
        res.status(401).send(responseJSON("INVALID_session"));
    }

}

function responseJSON(responseType) {
    switch (responseType) {
        case "INVALID_session":
            return { message: 'Invalid Session. Please login again!' };
        case "REG_successMsg":
            return { message: 'User registered successfully.' };
        case "REG_errorUsername":
            return { message: "This username already exists, please choose another" };
        case "REG_errorEmail":
            return { message: "This email address is already in use." };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        case "INVALID_login":
            return { message: "The username and password you entered did not match our records. Please double-check and try again." };
        case "INVALID_user":
            return { message: "The username doesn't have an account. Please create an account. " };
        case "LOGOUT_success":
            return { message: 'Logout successful.' };
        case "IMG_not_found":
            return { message: 'Profile image not found.' };
        case "IMAGE_successMsg":
            return { message: 'Profile images uploaded.' };
        default:
            return { message: 'Some error with database connection.' };
    }
}