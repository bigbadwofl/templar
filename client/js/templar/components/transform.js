define([
	'templar/objects/objects'
], function(
	objects
) {
	return {
		type: 'transform',
		position: _.create(vector2),
		size: _.create(vector2),
		init: function() {
			var position = this.position;
			var size = this.size;

			if (position.x != null) {
				this.move(position.x, position.y);
				this.parent.event('onMove', position.x, position.y);
			}

			if (size.x) {
				this.resize(size.x, size.y);
				this.parent.event('onResize', size.x, size.y);
			}

			this.parent.renderer && this.parent.renderer.reorder();
		},
		move: function(x, y) {
			var position = this.position;

			if (x == null)
				x = position.x;

			if (y == null)
				y = position.y;

			var xChanged = (x != position.x);
			var yChanged = (y != position.y);

			if ((yChanged) || (xChanged)) {
				var dx = x - position.x;
				var dy = y - position.y;

				position.x = x;
				position.y = y;

				this.parent.renderer && this.parent.renderer.reorder();

				this.parent.event('onMove', x, y, dx, dy);
			}
		},
		resize: function(w, h) {
			var size = this.size;

			if (w == null)
				w = size.x;

			if (h == null)
				h = size.y;

			var wChanged = (w != size.x);
			var hChanged = (h != size.y);

			if ((wChanged) || (hChanged)) {
				size.x = w;
				size.y = h;

				this.parent.renderer && this.parent.renderer.reorder();

				this.parent.event('onResize', w, h);
			}
		}
	};
});