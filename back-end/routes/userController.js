// User Controller - Handles Login, Registration, Logout
const bcrypt        = require('bcryptjs');
const mysql         = require('../mysql/mysql');
const DATABASE_POOL = require('../mysql/mysql');

// REGISTRATION - POST: '/register'
exports.registerUser = function registerUser(req, res) {

    let newUser = {
        "email"     : req.body.email,
        "password"  : req.body.password,
        "fname"     : req.body.fname,
        "lname"     : req.body.lname,
    };

    let insertQuery = "INSERT INTO USER SET ?";

    if (DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    // Store hash in database
                    newUser.password = hash;

                    // if you got a connection...
                    connection.query(insertQuery, newUser, function (err, rows) {
                        if (err) {
                            connection.release();
                            if (err.code === "ER_DUP_ENTRY") {
                                return res.status(400).send(responseJSON("REG_errorEmail"));
                            } else
                                return res.status(400).send(responseJSON("SERVER_someError"));
                        }

                        // User registered successfully.
                        res.status(200).send(responseJSON("REG_successMsg"));

                        // Release the connection
                        connection.release();
                    });
                });
            });
        });
    }
}

// LOGIN - POST: '/login'
exports.loginUser = function authenticateUser(req, res) {

    let email = req.body.email;
    let password = req.body.password;


    let getUser =  "SELECT email, password, fname, lname, education, addr1, addr2, state, city, zip, gender, birthdate FROM USER " +
        "WHERE email = ?";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(getUser, [email], function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }


                if (rows.length > 0) {
                    bcrypt.compare(password, rows[0].password, function (err, resp) {
                        if (resp) {

                            // Passwords match && User was found.
                            req.session.email = email;
                            res.status(200).send({user: rows[0], message: "Login Successful"});
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
    }
}

// SESSION CHECK - POST: '/authenticateUser'
exports.authenticateUser = function authenticateUser(req, res) {

    let email    = req.body.sessionEmail;

    let authUser    =   "SELECT email, fname, lname, education, addr1, addr2, state, city, zip, gender, birthdate FROM USER " +
                        "WHERE email = ?";

    if(DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));

            // if you got a connection...
            connection.query(authUser, [email], function (err, rows) {
                if (err) {
                    connection.release();
                    return res.status(400).send(responseJSON("SERVER_someError"));
                }
                if (rows.length > 0) {
                    // User found.
                    res.status(200).send({user: rows[0], message: "Authentication Successful!"});
                }
                else // User doesn't exist. Hence, invalid session.
                    res.status(401).send(responseJSON("INVALID_session"));

                // Release the connection
                connection.release();
            });
        });
    }
}

// LOGOUT - POST: '/logout'
exports.logoutUser = function logoutUser(req, res) {

    if(req.session.user) {
        req.session.destroy();
        console.log("LOGGED OUT: Session Invalidated" + '\n');
        res.status(200).send(responseJSON("LOGOUT_success"));
    } else {
        console.log("LOGOUT_FAILED: Session Invalidation Failed!" + '\n');
        res.status(401).send(responseJSON("INVALID_session"));
    }

}

// REGISTRATION - POST: '/'
exports.updateProfile = function updateProfile(req, res) {

    let newUser = {
        "email": req.body.sessionEmail,
        "city": req.body.city,
        "gender": req.body.gender,
        "state": req.body.state,
        "zip": req.body.zip,
    };

    let insertQuery = `UPDATE USER
                        SET state = ${newUser.state}, city = ${newUser.city}, zip=${newUser.zip}, gender=${newUser.gender}
                       WHERE email=${newUser.email}`;

    if (DATABASE_POOL) {
        mysql.pool.getConnection(function (err, connection) {
            if (err)
                return res.status(400).send(responseJSON("SERVER_someError"));
                    // if you got a connection...
                    connection.query(insertQuery, function (err, rows) {
                        if (err) {
                            connection.release();
                            return res.status(400).send(responseJSON("SERVER_someError"));
                        }
                        console.log("-----");
                        console.log(rows);
                        console.log("-----");
                        // User registered successfully.
                        res.status(200).send(responseJSON("REG_successMsg"));

                        // Release the connection
                        connection.release();
                    });

        });
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
        case "REG_successProfileUpdate":
            return { message: "The profile has been updated" };
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