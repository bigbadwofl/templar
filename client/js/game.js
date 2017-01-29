define([
	'templar/engine',
	'templar/objects/objects',
	'templar/canvas',
	'templar/loaders/audio'
], function(
	engine,
	objects,
	canvas,
	audio
) {
	return {
		init: function() {
			canvas.setLayers([
				'bg',
				'tiles',
				'doodads',
				'mobs'
			]);

			engine.init(this, this.onReady);
		},
		onReady: function() {
			audio.play('ld33', false, true, 0.8);

			$('canvas')
				.css('opacity', 0);

			objects.create('menu', null, null, null, true);
			
			objects.create('hud', null, null, null, true).html.setVisible(false);
			objects.create('lose').html.setVisible(false);
			objects.create('paused').html.setVisible(false);
			objects.create('win').html.setVisible(false);
			objects.create('help').html.setVisible(false);

			setTimeout(this.hideLoader, 15);
		},
		showLoader: function() {
			$('.loader').fadeIn('slow', function() {
				
			});
		},
		hideLoader: function() {
			$('.loader').fadeOut('slow', function() {
				
			});
		}
	};
});