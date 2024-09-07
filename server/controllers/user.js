'use strict';

//The uppercase to remark it is a model
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

const crypto = require('crypto');
const mailer = require('../modules/mailer');

//Hashing password module
var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-pagination');

var jwt = require('../services/jwt');

//Files management
var fs = require('fs');
var path = require('path');


//TESTS
function testing(req, res){
   res.status(200).send({
      message: 'Test page' 
   }); 
};


//SAVE USER
function saveUser(req, res){
    var params = req.body;
    var user = new User();
    
    if(params.name && params.surname && params.nick && params.email && params.password){
        const url = req.protocol + '://' + req.get('host');

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        
        
        User.find({ $or: [ {email: (user.email).toLowerCase()}, {nick: (user.nick).toLowerCase()} ] }).exec((err, users) => {
                        if(err) return res.status(500).send({message: 'Error in the request'}); 
                        if(users && users.length >= 1){
                            return res.status(200).send({message: 'The user already exists. Try another nickname or email.'});
                        } else {
                             bcrypt.hash(params.password, null, null, (err, hash) => {
                                user.password = hash;

                                user.save((err, userStored) => {

                                    if(err) return res.status(500).send({message: 'Error saving the user'});

                                    if(userStored){
                                        res.status(200).send({user: userStored});      
                                    } else {
                                        res.status(404).send({message: 'User not saved'})
                                    }

                                });
                            });
                            
                        }
        });

    }else{
        res.status(400).send({
            message: 'The required parameters are not provided'
        });
    }
    
}


//USER LOGIN
function loginUser(req, res){
    var params = req.body;
    
    var email = params.email;
    var password = params.password;
    
    User.findOne({email: email}, (err, user) => {
       if(err) return res.status(500).send({message: 'An error has ocurred'});
        
        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
               if(check){
                   
                   
                   if(params.gettoken){
                       return res.status(200).send({
                          token: jwt.createToken(user) 
                       });
                       
                   }else{
                        user.password = undefined;
                        return res.status(200).send({user})
                   }
               } else{
                   return res.status(404).send({message: 'The password doesn´t match'});
               }
            });
        } else{
            return res.status(404).send({message: 'The user doesn´t exist'});
        }
    });
}

//GET USER INFORMATION BY ID
function getUser(req, res){
  
    var userId = req.params.id;
    console.log("userId",userId);
    
    User.findById(userId, (err, user) => {
       
        if(err) return res.status(500).send({message: 'Request error'});
        
        if(!user) return res.status(404).send({message: 'User doesn´t exists'});
        
        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user, 
                following: value.following, 
                followed: value.followed
            });
        });
             
    });
}


async function followThisUser(identity_user_id, user_id){
    
        var following = await Follow.findOne({"user": identity_user_id, "followed": user_id}).exec().then((follow) => {
                return follow;
            }).catch((err) => {
                return handleError(err);
            });
        var followed = await Follow.findOne({"user": user_id, "followed": identity_user_id}).exec().then((follow) => {
                return follow;
        }).catch((err) => {
                return handleError(err);
        });     
    
    return {
        following: following,
        followed: followed
    }
}


//LIST OF USERS PAGINATED
function getUsers(req, res){
    
    var identity_user_id = req.user.sub;
    
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    var itemsPerPage = 5;
    
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if(err) return res.status(500).send({message: 'Request error'});
        
        if(!users) return res.status(404).send({message: 'No users available'});
        
        users.forEach((user) => {
           user.password = undefined;  
        });
        
        followUserIds(identity_user_id).then((value) => {
           
            return res.status(200).send({
               users,
               users_following: value.following,
               users_follow_me: value.followed,
               total,
               pages: Math.ceil(total/itemsPerPage)
            }); 
        });
    });
    
}

async function followUserIds(user_id){
    var following = await Follow.find({"user": user_id}).select({'_id':0, '_v':0, 'user':0}).exec().then((follows) => {
        return follows;
        }).catch((err) => {
                return handleError(err);    
        });

    var followed = await Follow.find({"followed": user_id}).select({'_id':0, '_v':0, 'followed':0}).exec().then((follows) => {
        return follows;
        }).catch((err) => {
                return handleError(err);    
        });
    
    
    var following_clean = [];
    
    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });
    
    var followed_clean = [];
    
    followed.forEach((follow) => {
        followed_clean.push(follow.user);
    });

    return{
        following: following_clean,
        followed: followed_clean
    }
    
}

//Edit user data
function updateUser(req, res){
    
    var userId = req.params.id;
    var update = req.body;
    
    delete update.password;
    
    if(userId != req.user.sub){
        return res.status(500).send({message: 'You don´t have permission to update user data '});
    }
    
    User.find({ $or: [ {email: update.email}, {nick: update.nick} ] }).exec((err, users) => {
        
        var user_isset = false;
        
        users.forEach((user) => {
            if(user && user._id != userId) user_isset = true;
        });
        
        if(user_isset) return res.status(200).send({message: 'Data already in use.'});
        
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
            if(err) return res.status(500).send({message: 'Request error'});

            if(!userUpdated) return res.status(404).send({message: 'Can´t update the user'});
            
            userUpdated.password = undefined;

            return res.status(200).send({user: userUpdated});
        });  
    }); 
}



function uploadImage(req, res) {
    console.log('Function uploadImage called');

    const userId = req.params.id;

    console.log("req.file:", req.file);
    
    if (req.file) {
        const file_path = path.normalize(req.file.path);
        console.log("File path:", file_path); 

        const file_split = file_path.split(path.sep);
        const file_name = file_split[file_split.length - 1];
        const ext_split = file_name.split('.');
        const file_ext = ext_split[ext_split.length - 1].toLowerCase();

        console.log("File name:", file_name); 
        console.log("File extension:", file_ext); 
        if (userId !== req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'You don’t have permission to update user data');
        }

        if (['png', 'jpg', 'jpeg', 'gif'].includes(file_ext)) {
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Request error' });
                if (!userUpdated) return res.status(404).send({ message: 'Cannot update the user' });

                userUpdated.password = undefined; 
                return res.status(200).send({ user: userUpdated });
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Invalid file extension');
        }
    } else {
        return res.status(400).send({ message: 'No image uploaded' });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) console.error('Error deleting file:', err);
        return res.status(400).send({ message });
    });
}


function getImageFile(req, res) {
    console.log('Function getImageFile called');
    const imageFile = req.params.imageFile.replace(/\\/g, '/'); 
    console.log('Requested file path:', imageFile);

    const filePath = path.resolve(__dirname, '..', 'uploads', 'users', imageFile);
    console.log('Absolute file path:', filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', filePath);
            return res.status(404).send({ message: 'The image doesn’t exist' });
        }

        console.log('File exists, sending file...');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(err.status).end();
            }
            console.log('File sent successfully');
        });
    });
}




// function getImageFile(req, res) {
//     console.log('Function called');
//     res.send('Function getImageFile is working');
// }



// function removeFilesOfUploads(res, file_path, message){
//     fs.unlink(file_path, (err) => {
//               return res.status(200).send({message: message}); 
//            });
// }



function getCounters(req, res){
    var userId = req.user.sub;
    
    if(req.params.id){
        userId = req.params.id;
    } 
    
    getCountFollow(userId).then((value) => {
          return res.status(200).send(value); 
       });
}

async function getCountFollow(user_id){
    
    var following = await Follow.count({"user": user_id}).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);    
    });
    
    var followed = await Follow.count({"followed": user_id}).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);    
    });
    
    var publications = await Publication.count({"user": user_id}).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);    
    });
    
    return {
        following: following,
        followed: followed,
        publications: publications
    }
    
}

async function forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user)
                return res.status(400).send({ error: 'User not found.'});


            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, 
                {
                    '$set': {
                        passwordResetToken: token,
                        passwordResetExpires: now,
                } 
            }, { useFindAndModify: false });

            mailer.sendMail({
                to: email,
                from: 'anyermo@gmail.com',
                template: 'auth/forgot_password',
                context: { token },

            }, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: 'Cannot send forgotten password email' });
                }
        
                console.log(`Password recovery email sent to user with email: ${email}.`);
                return res.status(200).send({ message: 'Password recovery email sent successfully. ' });
            });


        } catch (err) {

            res.status(400).send({ error: 'Error on forgot password, try again.'})
        }
    }

    async function resetPassword(req, res) {
        const { email, token, password } = req.body;

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires');

            if (!user)
                return res.status(400).send({ error: 'User not found.'});

            if (token !== user.passwordResetToken)
                return res.status(400).send({ error: 'Token invalid.' });
            
            const now = new Date();

            if (now > user.passwordResetExpires)
                return res.status(400).send({ error: 'Token expired, generate a new one.' });

            await bcrypt.hash(password, null, null, (err, hash) => {
                user.password = hash;
            });

            await user.save();

            console.log(`Password changed for user with email: ${email}.`);
            res.status(200).send({ message: 'Password changed successfully.' });

        } catch (err) {
            res.status(400).send({ error: 'Cannot reset passsword, try again.' });
        }
    }


//Export the functions defined
module.exports = {
    testing,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters,
    forgotPassword,
    resetPassword
}