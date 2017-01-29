define([

], function(

) {
	return {
		type: 'path',
		constraints: {
			x: [0.5, 0.5],
			y: [0.5, 0.5]
		},
		init: function() {
			var name = this.parent.renderer.spriteName.replace('path', '');

			//todo: ugly ugly...make prettier
			if (name.indexOf('TopLeft') > -1) {
				this.constraints = {
					x: [0.5, 1],
					y: [0.5, 1]
				}
			} else if (name.indexOf('TopRight') > -1) {
				this.constraints = {
					x: [0, 0.5],
					y: [0.5, 1]
				}
			} else if (name.indexOf('BottomLeft') > -1) {
				this.constraints = {
					x: [0.5, 1],
					y: [0, 0.5]
				}
			} else if (name.indexOf('BottomRight') > -1) {
				this.constraints = {
					x: [0, 0.5],
					y: [0, 0.5]
				}
			} else if (name.indexOf('HorTrigger') > -1) {
				this.constraints = {
					x: [0.15, 0.85],
					y: [0.5, 0.5]
				}
			} 
			else if (name.indexOf('Hor') > -1) {
				this.constraints = {
					x: [0, 1],
					y: [0.5, 0.5]
				}
			} else if (name.indexOf('VerTrigger') > -1) {
				this.constraints = {
					x: [0.5, 0.5],
					y: [0.15, 0.85]
				}
			}
			else if (name.indexOf('Ver') > -1) {
				this.constraints = {
					x: [0.5, 0.5],
					y: [0, 1]
				}
			} else if (name.indexOf('Left') > -1) {
				this.constraints = {
					x: [0, 0.5],
					y: [0, 1]
				}
			} else if (name.indexOf('Right') > -1) {
				this.constraints = {
					x: [0.5, 1],
					y: [0, 1]
				}
			} else if (name.indexOf('Up') > -1) {
				this.constraints = {
					x: [0, 1],
					y: [0, 0.5]
				}
			} else if (name.indexOf('Down') > -1) {
				this.constraints = {
					x: [0, 1],
					y: [0.5, 1]
				}
			} else if (name.indexOf('Mid') > -1) {
				this.constraints = {
					x: [0, 1],
					y: [0, 1]
				}
			}
		},
		onTriggerEnter: function(o) {
			if (o.name == 'player')
				o.player.onPathEnter(this.parent);
			else if (o.name == 'pacman')
				o.pacman.onPathEnter(this.parent);
		},
		onTriggerExit: function(o) {
			if (o.name == 'player')
				o.player.onPathExit(this.parent);
			else if (o.name == 'pacman')
				o.pacman.onPathExit(this.parent);
		},
		update: function() {

		},
		constrain: function(o) {
			var transform = this.parent.transform;
			var position = transform.position;
			var size = transform.size;

			var constraint = this.constraints;

			var oTransform = o.transform;

			var x = oTransform.position.x + 8;
			var y = oTransform.position.y + 8;

			var realConstraints = {
				x: [position.x + (constraint.x[0] * size.x), position.x + (constraint.x[1] * size.x)],
				y: [position.y + (constraint.y[0] * size.y), position.y + (constraint.y[1] * size.y)]
			};

			var player = o.player;
			var snap = 0.75;
			if (!player)
				snap = 0.5;
			var unsnap = 1.0 - snap;

			//constrain x
			if (x < realConstraints.x[0])
				x = (x * snap) + (realConstraints.x[0] * unsnap);
			else if (x > realConstraints.x[1])
				x = (x * snap) + (realConstraints.x[1] * unsnap);

			//constrain y
			if (y < realConstraints.y[0])
				y = (y * snap) + (realConstraints.y[0] * unsnap);
			else if (y > realConstraints.y[1])
				y = (y * snap) + (realConstraints.y[1] * unsnap);

			if (player) {
				//constrain automove
				if (constraint.x[0] == constraint.x[1])
					player.lastDelta[0] = 0;
				if (constraint.y[0] == constraint.y[1])
					player.lastDelta[1] = 0;
			}
			else {
				if (constraint.x[0] == constraint.x[1])
					o.pacman.lastDelta[0] = 0;
				if (constraint.y[0] == constraint.y[1])
					o.pacman.lastDelta[1] = 0;
			}

			oTransform.move(x - 8, y - 8);
		}
	};
});