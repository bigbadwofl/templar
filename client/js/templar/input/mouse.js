define([
	'templar/events'
], function(
	events
) {
	var mouse = {
		init: function() {
			$('#canvas').on('mouseup', this.events.mouseUp.bind(this));
		},
		events: {
			mouseUp: function(e) {
				var button = e.button;

				events.fire('mouseUp', button);
			}
		}
	};

	mouse.init();

	return mouse;
});