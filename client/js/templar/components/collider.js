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
		size: _.create(vector2, 1, 1),
		offset: _.create(vector2, 0, 0),

		events: {
			onEnabled: function() {
				physics.addCollider(this.parent);
			},
			onDisabled: function() {
				physics.removeCollider(this.parent);
			}
		},

		init: function() {
			physics.addCollider(this.parent);
		},
		onMove: function() {
			physics.move(this.parent, this.offset);
		},
		onResize: function () {
			physics.resize(this.parent, this.size);
		},
		destroy: function() {
			physics.removeCollider(this.parent);
		}
	};
});