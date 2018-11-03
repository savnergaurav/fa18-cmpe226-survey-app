const mysql             = require('../mysql/mysql');
const fs                = require('fs');
const imagesDirectory   = "public/profile_images/";

// PROFILE IMAGE UPLOAD - POST 'profile/save-profile-image'
exports.uploadProfImage = function uploadProfImage(req, res) {
    res.status(200).send(responseJSON("IMAGE_successMsg"));
};

// PROFILE IMAGE - GET: 'profile-image'
exports.fetchProfileImage = function fetchProfileImage(req, res) {

    let username = req.query.username;

    fs.readFile(imagesDirectory + username + '.jpg', function (err, content) {

        if (err) {
            res.status(400).send(responseJSON("IMG_not_found"));
        } else {
            // Content Type: Image.
            let base64Image = new Buffer(content, 'binary').toString('base64');
            res.status(200).send( { profileImage: base64Image });
        }
    });
};

function responseJSON(responseType) {
    switch (responseType) {
        case "IMG_not_found":
            return { message: 'Profile image not found.' };
        case "IMAGE_successMsg":
            return { message: 'Profile images uploaded.' };
        case "SERVER_someError":
            return { message: 'There is some issue in server. Please try again later.' };
        default:
            return { message: 'Some error with database connection.' };
    }
}