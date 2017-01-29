define([
	'templar/canvas',
	'templar/loaders/resources',
	'templar/objects/objects'
], function(
	canvas,
	resources,
	objects
) {
	return {
		type: 'renderer',
		layer: null,
		spriteName: null,
		sprite: null,
		opacity: 1,
		order: -1,
		enabled: true,
		offset: _.create(vector2, 0, 0),
		init: function() {
			if (this.spriteName != null)
				this.setSprite();

			this.reorder();
		},
		enable: function(enabled) {
			this.enabled = enabled;

			if (!this.enabled)
				objects.removeRenderer(this);
		},
		reorder: function() {
			//hack for now
			if ((this.parent.parent) || (!this.enabled))
				return;

			var transform = this.parent.transform;
			if (!transform)
				return;

			var position = transform.position;
			var size = transform.size;

			var oldOrder = this.order;
			this.order = position.y + size.y;

			if (oldOrder != this.order)
				objects.reorder(this);
		},
		setSprite: function(name) {
			if (name == this.spriteName)
				return;

			name = name || this.spriteName;
			this.spriteName = name;

			this.parent.event('onSpriteChange', name);
			
			this.sprite = resources.loadImage(name);
		},
		update: function(transform) {
			if (!this.enabled)
				return;

			var transform = this.parent.transform;
			var position = transform.position;
			var size = transform.size;

			if ((!size.x) || (!size.y))
				return;

			var x = position.x + this.offset.x;
			var y = position.y + this.offset.y;

			if (this.parent.parent) {
				var parentPosition = this.parent.parent.transform.position;
				x += parentPosition.x;
				y += parentPosition.y;
			}

			if (this.opacity != 1) {
				canvas.setAlpha(this.opacity, this.layer);
			}

			if (this.sprite != null) {
				canvas.image(
					this.sprite,
					Math.round(x),
					Math.round(y),
					size.x,
					size.y,
					this.layer
				);

				//debug
				var c = this.parent.collider;
				if (c) {
					//canvas.setStroke(255, 255, 0, 1, this.layer);
					//canvas.strokeRect(x + c.offset.x, y + c.offset.y, ~~(size.x * c.size.x), ~~(size.y * c.size.y), this.layer);
				}
			} /*else {
				//only used for shadows and the default color is already black
				//canvas.setFill(0, 0, 0, 1, this.layer);
				canvas.rect(x, y, size.x, size.y, this.layer);
			}*/

			if (this.opacity != 1) {
				canvas.setAlpha(1, this.layer);
			}
		}
	};
});