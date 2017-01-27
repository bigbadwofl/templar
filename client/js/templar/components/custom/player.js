define([
	'templar/input/keyboard',
	'templar/client'
], function(
	keyboard,
	client
) {
	return {
		type: 'player',
		options: {
			moveSpeed: 1
		},
		globalEvents: {
			keyDown: function(key) {

			}
		},
		events: {
			onMove: function(x, y) {
				this.parent.camera.doCenter(x, y);
			}
		},
		methods: {
			init: function() {
				this.enabled = false;
				
				client.request({
					module: 'players',
					method: 'join',
					message: {
						name: 'player_' + ~~(100 + Math.random() * 99),
					},
					callback: this.onConnected.bind(this)
				});
			},
			onConnected: function() {
				this.enabled = true;
			},
			beforeUpdate: function() {
				var dx = keyboard.getAxis('horizontal');
				var dy = keyboard.getAxis('vertical');

				if ((dx != 0) || (dy != 0))
					this.move(dx, dy);
			},
			move: function(x, y) {
				x *= this.options.moveSpeed;
				y *= this.options.moveSpeed;

				var transform = this.parent.transform;

				var pos = transform.position;
				transform.move(pos.x + x, pos.y + y);
			}
		}
	};
});