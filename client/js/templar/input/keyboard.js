define([
	'templar/events',
	'templar/input/keyboardMappings',
	'templar/config'
], function(
	events,
	keyboardMappings,
	config
) {
	var keyboard = {
		keys: [],
		enabled: true,
		init: function() {
			$(window).on('keydown', this.events.keyDown.bind(this));
			$(window).on('keyup', this.events.keyUp.bind(this));
		},
		reset: function() {
			this.keys = [];
		},
		isDown: function(key, noConsume) {
			var index = this.keys.indexOf(key);
			if (index > -1) {
				if (!noConsume)
					this.keys.splice(index, 1);

				return true;
			}

			return false;
		},
		getAxis: function(name) {
			var axis = config.input.axes[name];
			if (!axis)
				return 0;

			var result = 0;

			for (var i = 0; i < axis.negative.length; i++) {
				if (this.keys.indexOf(axis.negative[i]) > -1) {
					result--;
					break;
				}
			}

			for (var i = 0; i < axis.positive.length; i++) {
				if (this.keys.indexOf(axis.positive[i]) > -1) {
					result++;
					break;
				}
			}

			return result;
		},
		events: {
			keyDown: function(e) {
				if (!this.enabled)
					return;

				if (e.target != document.body)
					return;

				var key = keyboardMappings.getMapping(e.which);

				if (this.keys.indexOf(key) == -1)
					this.keys.push(key);

				events.fire('keyDown', key);
			},
			keyUp: function(e) {
				if (!this.enabled)
					return;
				
				if (e.target != document.body)
					return;

				var key = keyboardMappings.getMapping(e.which);

				var index = this.keys.indexOf(key);
				if (index > -1)
					this.keys.splice(index, 1);

				events.fire('keyUp', key);
			}
		}
	};

	keyboard.init();

	return keyboard;
});