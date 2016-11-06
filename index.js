var express = require('express');
var http = require('http');
var socketio = require('socket.io');

//intialize express
var app = express();

//intialize server to handle http requests
var http_server = http.Server(app);

//create new instance of socketio using our http_server
var io = socketio(http_server);

// Middleware to make files in '/public' available through API starting at '/'
app.use(express.static('public'));

// Track users currently on the site. Can be stored in volatile memory.
var activeUsers = [];


/**
 * Socket IO handlers:
 * recieves 'userConnect'
 * recieves 'userDisconnect'
 * emits    'updateUsers'
 */
io.on('connection', function (socket) {

    // When a new user connects, add them to 'activeUsers' and tell everyone to update thier user view
    socket.on('/io/appServer/activeUsers/create', function(msg){
        if(!(msg.user in activeUsers)){
            activeUsers.push(msg.user);
            io.emit('/io/client/activeUsers/update',{
                'users': activeUsers
            });
        }
    });

    // When a user disconnects, update Server and Client activeUsers lists.
    socket.on('/io/appServer/activeUsers/delete', function (msg) {
        // logic for removing the user from the array of active users
        if(!(msg.user in activeUsers)) {
            activeUsers.splice(index, 1);
            // emit the new list of users to all
            io.emit('/io/client/activeUsers/update', {
                'users': activeUsers
            });
        }
    });

    socket.on('/io/appServer/message/create', function (msg) {
        console.log('message: ' + msg.name + "  " + msg.text);
        io.emit('/io/client/message/create', msg);
    });


});



//serve index.html when get request at root
app.get('/', function (req, res) {
    res.sendFile('/index.html');
});

//HTTP server will listen for requests on port 3000
http_server.listen(3000, function () {
    console.log('listening on *:3000');
});