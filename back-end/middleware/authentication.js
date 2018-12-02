authenticate = (req, res, next) => {

    if(!req.session.email) {
        console.log("USER SESSION INVALID");
        res.status(401).send(respondAuth("invalidSession"));
    } else {
        req.body.sessionEmail = req.session.email;
        next();
    }
};

function respondAuth(responseType) {
    switch (responseType) {
        case "invalidSession":
            return { message: "Session timed out. Please login again!" };
        default:
            return { message: 'There is some issue in server. Please try again later.' };
    }
}

module.exports = {
    authenticate
};