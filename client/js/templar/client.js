define([
	'socket'
], function(
	io
) {
	var client = {
		init: function() {
			this.socket = io({
				transports: [ 'websocket' ]
			});

			this.socket.on('response', this.onResponse.bind(this));
		},
		request: function(data) {
			this.socket.emit('request', {
				module: data.module,
				method: data.method,
				message: data.message
			}, data.callback || this.onResponse.bind(this));
		},
		onResponse: function(response) {
			network.sync(response);
		}
	};

	client.init();

	return client;
});