'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const path = require('path'); // Importer le module 'path'
const cors = require('cors');  // Import du module cors
//Load the express framework
var app = express();
app.use('/uploads/users', express.static(path.join(__dirname, 'uploads', 'users')));

// app.use('/uploads', express.static('uploads'));

//Load routes from routes folder
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');
var like_routes = require('./routes/like');
var comment_routes = require('./routes/comment');

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
//The request is parsed into a JSON
app.use(bodyParser.json());

//CORS Headers Configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', like_routes);
app.use('/api', comment_routes);

var server = require('http').Server(app);
var io = require('socket.io')(server);

var messages = [];
var online = 0;

io.on('connection', function(socket){
    
    console.log("IP: " + socket.handshake.address + 
               " has connected | Time: " + socket.handshake.time);
    
    online = online + 1;
    io.sockets.emit('users', online);
    
    socket.on('add-message', function(data){
        messages.push(data); 
        io.sockets.emit('messages', messages);
    });

    socket.on('disconnection', function(data){
        online = online - 1;
        messages.push(data); 
        io.sockets.emit("users", online)
        io.sockets.emit('messages', messages);
        socket.disconnect();
        console.log("IP: " + socket.handshake.address + 
               " has disconnected | Time: " + socket.handshake.time);
    });
			
});
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,  
  }));


module.exports = server;

