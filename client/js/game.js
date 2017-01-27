define([
	'templar/engine',
	'templar/objects/objects',
	'templar/loaders/maps',
	'templar/canvas'
], function(
	engine,
	objects,
	maps,
	canvas
) {
	return {
		init: function() {
			canvas.setLayers([
				'tiles',
				'shadows',
				'doodads',
				'mobs',
				'walls',
				'lights',
				'particles'
			]);

			engine.init(this, this.onReady);
		},
		onReady: function() {
			$('canvas')
				.css('opacity', 0);

			//objects.create('hud', null, null, null, true).html.setVisible(false);

			maps.build('test');

			setTimeout(this.hideLoader, 15);
		},
		hideLoader: function() {
			$('.loader').fadeOut('slow');
		}
	};
});