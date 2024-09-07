'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');

var Global = require('../global');
var secret = Global.secret;

// Middleware pour assurer l'authentification via JWT
exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'The request doesn\'t have an authentication header' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    
    try {
        var payload = jwt.decode(token, secret);
        
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'The token has expired' });
        }
        
        req.user = payload;
        
        next();
    } catch (ex) {
        return res.status(401).send({ message: 'The token is not valid' });
    }
}
