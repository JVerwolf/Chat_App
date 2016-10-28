var express = require('./node_modules/express');
var http = require('http');
var socketio = require('./node_modules/socket.io');

//intialize express
app = express();

//intialize server to handle http requests
var http_server = http.Server(app);

//create new instance of socketio using our http_server
var io = socketio(http_server);

// Middleware to make files in '/public' available through API starting at '/'
app.use(express.static('public'));

// Track users currently on the site. TODO: replace with DB
var activeUsers = [];


//Socket IO handlers
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg.name + "  " + msg.text);
        io.emit('chat message', msg);
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