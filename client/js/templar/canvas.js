define([
	'templar/loaders/resources'
], function(
	resources
) {
	var canvas = {
		position: _.create(vector2),
		size: _.create(vector2),
		layers: {

		},
		init: function() {
			var el = $('#canvas');

			var w = ~~($('body').width() / 4);
			var h = ~~($('body').height() / 4);

			this.size.x = el[0].width = w;
			this.size.y = el[0].height = h;
			//el.remove();
		},
		setLayers: function(layers) {
			var count = 0;
			layers.forEach(function(l) {
				var canvas = $('<canvas class="layerCanvas"></canvas>')
					.appendTo('body')
					.attr('layer', l)
					.css('z-index', count);

				canvas[0].width = this.size.x;
				canvas[0].height = this.size.y;

				this.layers[l] = {
					canvas: canvas,
					ctx: canvas[0].getContext('2d')
				};

				count++;
			}, this);
		},
		setTranslation: function(position, center) {
			var x = position.x;
			var y = position.y;

			if (center) {
				x -= (this.size.x / 2);
				y -= (this.size.y / 2);
			}

			this.position.x = Math.round(x);
			this.position.y = Math.round(y);
		},
		begin: function() {
			for (var l in this.layers) {
				var ctx = this.layers[l].ctx;

				ctx.save();
				ctx.translate(-this.position.x, -this.position.y);
			}
		},
		end: function() {
			for (var l in this.layers) {
				var ctx = this.layers[l].ctx;

				ctx.restore();
			}
		},
		clear: function() {
			for (var l in this.layers) {
				var ctx = this.layers[l].ctx;

				ctx.save();

				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, this.size.x, this.size.y);

				ctx.restore();
			}
		},
		setAlpha: function(alpha, layer) {
			var ctx = this.layers[layer].ctx;

			ctx.globalAlpha = alpha;
		},
		setBlendMode: function(mode, layer) {
			var ctx = this.layers[layer].ctx;

			ctx.globalCompositeOperation = mode;
		},
		setFill: function(r, g, b, a, layer) {
			var ctx = this.layers[layer].ctx;

			if (arguments.length == 1) {
				ctx.fillStyle = r;
			} else if (arguments.length == 3) {
				ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
			} else {
				ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
			}
		},
		setStroke: function(r, g, b, a, layer) {
			var ctx = this.layers[layer].ctx;

			if (arguments.length == 1) {
				ctx.fillStyle = r;
			} else if (arguments.length == 3) {
				ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
			} else {
				ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
			}
		},
		rect: function(x, y, w, h, layer) {
			this.layers[layer].ctx.fillRect(x, y, w, h);
		},
		strokeRect: function(x, y, w, h, layer) {
			this.layers[layer].ctx.strokeRect(x, y, w, h);
		},
		image: function(sprite, x, y, w, h, layer) {
			var ctx = this.layers[layer].ctx;

			var position = this.position;
			var size = this.size;

			var cull = (
				(x + w < position.x) ||
				(y + h < position.y) ||
				(x > position.x + size.x) ||
				(y > position.y + size.y)
			);
			if (cull)
				return;

			var resize = false;

			var sw = sprite.w || sprite.image.width;
			var sh = sprite.h || sprite.image.height;

			if (x + w > position.x + size.x) {
				resize = true;

				if (sw != w) {
					var wDelta = w / sw;
					var min = (x + w) - (size.x + position.x);
					w -= min;
					sw -= (min / wDelta);
				} else {
					var min = (x + w) - (size.x + position.x);
					w -= min;
					sw -= min;
				}

				if (w <= 0)
					return;
			}
			if (y + h > position.y + size.y) {
				resize = true;

				if (sh != h) {
					var hDelta = h / sh;
					var min = (y + h) - (size.y + position.y);
					h -= min;
					sh -= (min / hDelta);
				} else {
					var min = (y + h) - (size.y + position.y);
					h -= min;
					sh -= min;
				}

				if (h <= 0)
					return;
			}

			if (!resize) {
				if (sprite.x)
					ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, w, h);
				else
					ctx.drawImage(sprite.image, x, y, w, h);
			} else {
				if (sprite.x)
					ctx.drawImage(sprite.image, sprite.x, sprite.y, w, h, x, y, w, h);
				else
					ctx.drawImage(sprite.image, 0, 0, sw, sh, x, y, w, h);
			}
		}
	};

	canvas.init();

	return canvas;
});