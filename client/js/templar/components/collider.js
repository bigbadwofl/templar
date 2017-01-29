define([
	'templar/physics/physics',
	'templar/events'
], function(
	physics,
	events
) {
	return {
		type: 'collider',

		fixed: true,
		trigger: false,
		enabled: true,

		size: _.create(vector2, 1, 1),
		offset: _.create(vector2, 0, 0),

		init: function() {
			physics.addCollider(this.parent);
		},
		onMove: function() {
			if (!this.enabled)
				return;

			physics.move(this.parent, this.offset);
		},
		onResize: function () {
			if (!this.enabled)
				return;

			physics.resize(this.parent, this.size);
		},
		destroy: function() {
			physics.removeCollider(this.parent);
		},
		setEnabled: function(enabled) {
			if (!enabled) {
				physics.removeCollider(this.parent);
				this.enabled = false;
			}
			else {
				this.enabled = true;
				physics.addCollider(this.parent);
			}
		},
		move: function(x, y) {
			this.offset.x = x;
			this.offset.y = y;

			this.onMove();
		},
		resize: function(w, h) {
			this.size.x = w;
			this.size.y = h;

			this.onResize();
		}
	};
});