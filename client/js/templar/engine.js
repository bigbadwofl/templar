define([
	'templar/objects/objects',
	'templar/events',
	'templar/loaders/spritesheets',
	'templar/loaders/maps',
	'templar/physics/physics',
	'templar/loaders/snippets',
	'templar/globals'
], function(
	objects,
	events,
	spritesheets,
	maps,
	physics,
	snippets,
	globals
) {
	return {
		hasFocus: true,
		loading: [
			'prefabs',
			'components',
			'spritesheets',
			'maps',
			'physics',
			'snippets'
		],
		init: function(readyScope, readyMethod) {
			events.addListener('ready', readyScope, readyMethod);
			events.addListener('moduleReady', this, this.onModuleReady);

			this.update();
		},
		onModuleReady: function(moduleName) {
			this.loading.splice(this.loading.indexOf(moduleName), 1);

			if (this.loading.length == 0)
				this.onReady()
		},
		onReady: function() {
			$(window).on('focus', this.setFocus.bind(this, true));
			//$(window).on('blur', this.setFocus.bind(this, false));

			events.fire('ready');
		},
		setFocus: function(focus) {
			this.hasFocus = focus;
		},
		update: function() {
			if (!this.hasFocus) {
				setTimeout(this.update.bind(this), 16);
				return;
			}

			requestAnimationFrame(this.update.bind(this));
			globals.time++;

			physics.update();
			objects.update();
			objects.render();
		}
	};
});