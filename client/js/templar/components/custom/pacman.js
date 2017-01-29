define([
	'templar/pathfinder',
	'templar/globals',
	'templar/loaders/audio'
], function(
	pathfinder,
	globals,
	audio
) {
	return {
		type: 'pacman',
		touching: [],
		path: [],
		speed: 0.5,
		chase: true,
		draw: true,
		spawn: null,
		spawnCD: 0,
		events: {
			onTriggerEnter: function(o) {
				if ((!o) || (o.name != 'player'))
					return;

				if (this.chase) {
					o.player.takeDamage(this.parent);
					
				}
				else {
					audio.play('chew', false, false, 0.6);
					this.die();
				}
			}
		},
		globalEvents: {
			playerRespawn: function() {
				this.path = [];
				this.parent.transform.move(this.spawn.x, this.spawn.y);
			},
			playerLose: function() {

			},
			onPowerup: function() {
				this.path = [];
				this.chase = false;
			},
			onPowerdown: function() {
				this.path = [];
				this.chase = true;
			},
			onWalkabilityChange: function() {
				this.path = [];

				var canLive = this.touching.find(function(t) {
					return (t.collider.enabled);
				});

				if (!canLive)
					this.die();
			},
			onPause: function(message) {
				this.path = [];
			}
		},
		die: function() {
			this.spawnCD = 250;
			this.path = [];
			this.parent.transform.move(1000, 1000);
			this.parent.renderer.enabled = false;
		},
		beforeUpdate: function() {
			var position = this.parent.transform.position;

			if (!globals.player.player.closest)
				return;

			if (this.spawnCD > 0) {
				this.spawnCD--;
				if (this.spawnCD == 0) {
					this.parent.renderer.enabled = true;
					this.parent.transform.move(this.spawn.x, this.spawn.y);
					this.parent.flickerer.flicker(30);
				}
				else
					return;
			}

			if (this.path.length <= 1) {
				var target = globals.player.player.closest.transform.position;

				this.path = pathfinder.setPath(this.parent.transform.position, target, !this.chase);
			}

			if (this.path.length > 1) {
				var node = this.path[this.path.length - 2];

				this.move(node.x * 16, node.y * 16);

				/*if ((this.draw) && (this.path.length > 0)) {
					//this.draw = false;

					var ctx = $('#canvas')
						.css('z-index', 9999)
						[0].getContext('2d');

					ctx.clearRect(0, 0, 1000, 1000);
					ctx.strokeStyle = 'white';
					ctx.moveTo(node.x + 74, node.y + 30);
					ctx.beginPath();
					

					for (var i = this.path.length - 1; i--; i > 0) {
						var p = this.path[i];
						ctx.lineTo((p.x * 16) + 74, (p.y * 16) + 30);
					}

					
					ctx.stroke();
				}*/
			}
		},
		onMove: function(x, y, dx, dy) {
			if (dx > 0)
				this.parent.animator.setState('right');
			else if (dx < 0)
				this.parent.animator.setState('left');

			if (dy > 0)
				this.parent.animator.setState('down');
			else if (dy < 0)
				this.parent.animator.setState('up');
		},
		move: function(x, y) {
			var position = this.parent.transform.position;
			var distance = Math.sqrt(Math.abs(position.x - x, 2) + Math.abs(position.y - y, 2));
			if (distance <= this.speed) {
				this.parent.transform.move(x, y);
				this.path.splice(this.path.length - 2, 1);
				
				if (this.path.length < 1)
					this.path = [];
			} else {
				var dx = 0;
				var dy = 0;

				if (x < position.x)
					dx = -1;
				else if (x > position.x)
					dx = 1;
				if (y < position.y)
					dy = -1;
				else if (y > position.y)
					dy = 1;

				dx *= this.speed;
				dy *= this.speed;

				this.parent.transform.move(position.x + dx, position.y + dy);
			}

			if ((_.randInt(0, 100) == 0) && (this.chase))
				this.path = [];

			var ppos = globals.player.transform.position;
			var dx = Math.abs(position.x - ppos.x);
			var dy = Math.abs(position.y - ppos.y);

			if ((dx <= 32) && (dy <= 32) && (!this.chase)) {
				this.path = [];
			}
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

			if (closestPath.renderer.spriteName != this.lastBranch) {
				this.lastBranch = closestPath.renderer.spriteName;
				this.lastDelta[0] = 0;
				this.lastDelta[1] = 0;
			}

			closestPath.path.constrain(this.parent);
		}
	};
});