'use strict';

//JSON WEB TOKENS

var jwt = require('jwt-simple');
var moment = require('moment');
var Global = require('../global');
var secret = Global.secret;

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    
    return jwt.encode(payload, secret);
    
};