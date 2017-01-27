GLOBAL.files = require('./files.js');
GLOBAL.players = require('./players.js');
GLOBAL.extend = require('extend');

require('./polyfills.js');

var app = require('express')();
var server = require('http').createServer(app);
GLOBAL.io = require('socket.io')(server);

var lessMiddleware = require('less-middleware');
app.use(lessMiddleware('./client', {
	render: {
		strictMath: true
	}
}));

app.get('/', function(req, res) {
	res.sendFile('index.html', {
		'root': 'client'
	});
});

app.get(/^(.*)$/, function(req, res, next) {
	var file = req.params[0];
	res.sendFile(file, {
		'root': 'client'
	});
});

io.on('connection', function(socket) {
	socket.on('disconnect', function() {
		players.leave(socket);
	});

	socket.on('request', function(msg, callback) {
		msg.callback = callback;
		GLOBAL[msg.module][msg.method](socket, msg);
	});
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
	var message = 'Server: Ready';
	console.log(message);
});