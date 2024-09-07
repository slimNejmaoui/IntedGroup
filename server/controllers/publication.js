'use strict';

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var Use = require('../models/user');
var Follow = require('../models/follow');

function testing(req, res){
    res.status(200).send({message: 'Hello World from Publication Controller'});
}

function savePublication (req, res){
    var params = req.body;
    console.log("pub",params);
    
    if(!params.text) return res.status(200).send({message: 'You need to send a text into a publication'});
    
    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    
    publication.save((err, publicationStored) => {
        if (err) res.status(500).send({message: 'Error saving the publication'});
        
        if(!publicationStored) res.status(404).send({message: 'Publication not stored'});
        
        res.status(200).send({publication: publicationStored});
    }); 
}


function getPublications(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    var itemsPerPage = 4;
    
    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if (err) res.status(500).send({message: 'Error returning the follow'});
        
        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        
        follows_clean.push(req.user.sub);
        
     
        Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({message: 'Error returning the publications'});
            
            if(!publications) return res.status(404).send({message: 'No publications available'});
            
            return res.status(200).send({
                total_items: total,
                pages : Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications 
            });
        });
        
    });
}


function getPublicationsUser(req, res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    
    var user = req.user.sub;
    if(req.params.user){
        user = req.params.user;
    }
    
    var itemsPerPage = 4;

    
    Publication.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
        if (err) return res.status(500).send({message: 'Error returning the publications'});

        if(!publications) return res.status(404).send({message: 'No publications available'});

        return res.status(200).send({
            total_items: total,
            pages : Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications 
        });
    });
}



function getPublication(req, res){
    var publicationId = req.params.id;
    
    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({message: 'Error returning the publications'});
        
        if(!publication) return res.status(404).send({message: 'The publication doesn´t exist'});
        
        return res.status(200).send({publication});
    });
    
    
}


function deletePublication(req, res){
    var publicationId = req.params.id;
    
    Publication.find({'user': req.user.sub, '_id': publicationId}).remove(err => {
        if (err) return res.status(500).send({message: 'Error deleting the publications'});
        
        
        return res.status(200).send({message: 'Publication successfully deleted'});
    });
}


//Upload user image files

function uploadImage(req, res) {
    console.log('Function uploadImage called');

    const publicationId = req.params.id;

    if (req.file) { // Utilise req.file au lieu de req.files pour multer
        const file_path = path.normalize(req.file.path);
        console.log("File path:", file_path);

        const file_split = file_path.split(path.sep);
        const file_name = file_split[file_split.length - 1];
        const ext_split = file_name.split('.');
        const file_ext = ext_split[ext_split.length - 1].toLowerCase();

        console.log("File name:", file_name);
        console.log("File extension:", file_ext);

        if (['png', 'jpg', 'jpeg', 'gif'].includes(file_ext)) {
            Publication.findOne({ user: req.user.sub, _id: publicationId }).exec((err, publication) => {
                if (err) return res.status(500).send({ message: 'Request error' });

                if (publication) {
                    Publication.findByIdAndUpdate(publicationId, { file: file_name }, { new: true }, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({ message: 'Request error' });
                        if (!publicationUpdated) return res.status(404).send({ message: 'Cannot update the publication' });

                        return res.status(200).send({ publication: publicationUpdated });
                    });
                } else {
                    return removeFilesOfUploads(res, file_path, 'You don’t have permission to update the publication');
                }
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

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
              return res.status(200).send({message: message}); 
           });
}

function getImageFile(req, res) {
    console.log('Function getImageFile called');
    const imageFile = req.params.imageFile.replace(/\\/g, '/'); // Remplace les antislashes
    const filePath = path.resolve(__dirname, '..', 'uploads', 'publications', imageFile);
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


module.exports = {
    testing,
    savePublication,
    getPublications,
    getPublicationsUser,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}