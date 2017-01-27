define([
	'templar/canvas',
	'jMigrate'
], function(
	canvas
) {
	var particleTemplate = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		ttl: 0,
		r: 0,
		g: 0,
		b: 0,
		size: 0
	};

	return {
		type: 'particles',

		particles: [],
		xOffset: [8, 0, 0],
		yOffset: [2, 3, -2],
		vX: [0.3, 0.16],
		vY: [0.2, 0.2],
		ttl: [5, 30],
		r: [230, 255],
		g: [230, 255],
		b: [100, 140],
		size: [1, 2],
		burst: [2, 0],
		ctx: null,

		init: function() {
			this.ctx = canvas.layers['particles'].ctx;

			if (!$.browser.mozilla)
				this.ctx.globalCompositeOperation = 'lighter';
		},

		createParticle: function() {
			var p = {
				x: 0,
				y: 0,
				vx: _.randFloat(this.vX[0]) - this.vX[1],
				vy: _.randFloat(this.vY[0]) - this.vY[1],
				ttl: _.randInt(this.ttl[0], this.ttl[1]),
				r: _.randInt(this.r[0], this.r[1]),
				g: _.randInt(this.g[0], this.g[1]),
				b: _.randInt(this.b[0], this.b[1]),
				size: _.randInt(this.size[0], this.size[1])
			};
			p.maxTtl = p.ttl;

			return p;
		},
		update: function() {
			var transform = this.parent.transform;
			var position = transform.position;
			var size = transform.size;
			var cPosition = canvas.position;
			var cSize = canvas.size;

			//cull
			var cull = (
				(position.x + size.x < cPosition.x) ||
				(position.x > cPosition.x + cSize.x) ||
				(position.y + size.y < cPosition.y) ||
				(position.y > cPosition.y + cSize.y)
			);
			if (cull)
				return;

			var count = this.burst[0] + _.randInt(this.burst[1]);
			
			for (var i = 0; i < count; i++) {
				var p = this.createParticle();
				p.x += position.x + this.xOffset[0] + _.randInt(this.xOffset[1]) + this.xOffset[2];
				p.y += position.y + this.yOffset[0] + _.randInt(this.yOffset[1]) + this.yOffset[2];

				this.particles.push(p);
			}

			var ctx = this.ctx;

			var fillRect = ctx.fillRect;

			for (var i = 0; i < this.particles.length; i++) {
				var p = this.particles[i];

				p.ttl--;
				if (p.ttl == 0) {
					this.particles.splice(i, 1);
					i--;
					continue;
				}

				p.x += p.vx;
				p.y += p.vy;

				var a = p.ttl / p.maxTtl

				ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + a + ')';
				fillRect.call(ctx, p.x, p.y, p.size, p.size);
			}
		}
	};
});