define([
	'templar/input/keyboard',
	'templar/client',
	'templar/loaders/audio',
	'templar/globals',
	'templar/events'
], function(
	keyboard,
	client,
	audio,
	globals,
	events
) {
	return {
		type: 'player',
		level: null,
		touching: [],
		closest: null,
		lastDelta: [0, 0],
		startTime: null,
		eaten: 0,
		lives: 3,
		spawn: null,
		elapsed: 0,
		dead: false,
		hasPower: 0,
		nextSound: 0,
		female: '',
		options: {
			moveSpeed: 1
		},
		globalEvents: {
			onPowerup: function() {
				this.parent.flickerer.flicker(10);
				this.parent.animator.setState(this.female + 'evilwalk');
				this.hasPower = 500;
				audio.play('powerup', false, false, 0.6);
			},
			onWin: function() {
				this.dead = true;
				this.closest = null;
				this.lastDelta[0] = 0;
				this.lastDelta[1] = 0;
				audio.play('win', false, false, 0.5);
			},
			playerDie: function() {
				keyboard.reset();
				

				this.lastDelta = [0, 0];
				this.closest = null;
				this.startTime = null;
				this.updateHud();

				if (this.lives <= 0) {
					this.dead = true;
					events.fire('playerLose', 'you died');
					this.lives = 3;
					audio.play('lose', false, false, 0.7);
					return;
				}
				else {
					audio.play('dmg', false, false, 0.7);
				}

				events.fire('playerRespawn');

				this.parent.transform.move(this.spawn.x, this.spawn.y);
				this.parent.flickerer.flicker(30);
			}
		},
		events: {
			onMove: function(x, y, dx, dy) {
				this.parent.camera.center(this.parent.transform.position.x, this.parent.transform.position.y);
			}
		},
		methods: {
			updateHud: function() {
				if ((this.closest) && (!this.dead)) {
					var time = globals.time;
					var elapsed = time - this.startTime;

					this.time -= (elapsed / 6.35);
					this.startTime = time;
				}

				globals.hud.html.setTime(~~this.time, this.maxTime);
				globals.hud.html.setLives(this.lives);
				globals.hud.html.setDots(this.eaten);

				if (this.time <= 0) {
					this.dead = true;
					this.closest = null;

					events.fire('playerLose', 'time\'s up');
				}
			},
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
			update: function() {
				if (this.dead)
					return;

				if (this.closest) {
					if (!this.startTime)
						this.startTime = globals.time;

					this.updateHud();
				}
			},
			beforeUpdate: function() {
				if (this.dead)
					return;

				if (this.hasPower > 0) {
					this.hasPower--;

					if (this.hasPower == 70)
						this.parent.flickerer.flicker(70);
					
					if (this.hasPower == 0) {
						events.fire('onPowerdown');
						this.parent.animator.setState(this.female + 'walk');
					}
				}

				if (keyboard.isDown('esc', true)) {
					this.dead = true;
					this.closest = null;
					events.fire('onPause');
					this.lastDelta[0] = 0;
					this.lastDelta[1] = 0;
				}

				var lastDelta = this.lastDelta;
				var dx = keyboard.getAxis('horizontal');
				var dy = keyboard.getAxis('vertical');

				if ((dx != 0) || (dy != 0)) {
					if (dx)  {
						lastDelta[0] = dx;
						lastDelta[1] /= 1.5;
					}
					if (dy) {
						lastDelta[1] = dy;
						lastDelta[0] /= 1.5;
					}
				}

				if (keyboard.isDown(' ', true)) {
					lastDelta[0] = 0;
					lastDelta[1] = 0;
				}

				if ((lastDelta[0] != 0) || (lastDelta[1] != 0)) {
					this.move(lastDelta[0], lastDelta[1]);
					this.constrainPath();
				}
			},
			move: function(x, y) {
				x *= this.options.moveSpeed;
				y *= this.options.moveSpeed;

				var transform = this.parent.transform;

				var pos = transform.position;
				transform.move(pos.x + x, pos.y + y);
			},
			eatDot: function(dot) {
				this.eaten++;
				this.updateHud();
				audio.play('pickup0', false, false, 0.5);
			},
			onPathEnter: function(path) {
				this.touching.push(path);
			},
			onPathExit: function(path) {
				for (var i = 0; i < this.touching.length; i++) {
					if (this.touching[i] == path) {
						this.touching.splice(i, 1);
						return;
					}
				}
			},
			constrainPath: function() {
				var touching = this.touching;

				if (touching.length == 0)
					return;

				var closestPath = touching[0];
				if (touching.length > 1) {
					var closestDistance = 99999;

					var len = touching.length;

					var pos = this.parent.transform.position;

					for (var i = 0; i < len; i++) {
						var t = touching[i];
						var tTransform = t.transform.position;

						var distance = Math.abs(pos.x - tTransform.x, 2) + Math.abs(pos.y - tTransform.y, 2);
						if (distance < closestDistance) {
							closestDistance = distance;
							closestPath = t;
						}
					}
				}

				closestPath.path.constrain(this.parent);
				this.closest = closestPath;
			},
			takeDamage: function(source) {
				this.lives--;
				events.fire('playerDie');
			}
		}
	};
});