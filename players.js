var player = require('./player.js');

var players = {
	players: [],
	nextId: 0,
	join: function(socket, msg) {
		var player = extend(true, {}, player);
		player.socket = socket;
		player.name = msg.message.name;
		player.data = {};

		for (var i = 0; i < this.players.length; i++) {
			var p = this.players[i];

			socket.emit('response', p.data);
		}

		this.players.push(player);

		msg.callback();
	},
	leave: function(socket) {
		var players = this.players;
		var len = players.length;
		for (var i = 0; i < len; i++) {
			var p = players[i];

			if (p.socket.id == socket.id) {
				io.sockets.emit('response', {
					id: p.id,
					leave: true
				});

				players.splice(i, 1);
				return;
			}
		}
	},
	sync: function(socket, msg) {
		var data = msg.message;

		var player = this.players.find(function(p) {
			return (p.socket.id == socket.id);
		});

		if (!player)
			return;

		for (var d in data) {
			player.data[d] = data[d];
		}

		io.sockets.emit('response', msg.message);
	},
	getNetviewId: function(socket, msg) {
		var player = this.players.find(function(p) {
			return (p.socket.id == socket.id);
		});

		if (!player)
			return;

		player.id = this.nextId++;

		msg.callback(player.id);
	}
};

module.exports = players;