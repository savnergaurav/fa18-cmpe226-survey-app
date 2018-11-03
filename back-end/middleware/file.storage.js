const multer = require('multer');
const fs = require('fs');
var path = require('path');
var profileDirectory = "public/profile_images/";

var profileStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, profileDirectory);
    },
    filename: function (req, file, cb) {
        filename = req.session.user + path.extname(file.originalname);
        cb(null, filename);
    }
});

exports.uploadProfileImage = multer({
    storage: profileStorage
});