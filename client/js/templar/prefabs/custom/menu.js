define([
	'templar/loaders/maps',
	'templar/globals',
	'templar/events',
	'templar/input/keyboard',
	'templar/loaders/audio'
], function(
	maps,
	globals,
	events,
	keyboard,
	audio
) {
	return {
		type: 'menu',
		base: 'ui',
		components: {
			html: {
				html: 'menu',
				enabled: true,
				afterInit: function() {
					this.el.find('.item').eq(0)
						.on('click', this.play.bind(this));

					this.el.find('.item').eq(1)
						.on('click', this.help.bind(this));
				},
				update: function() {
					if (keyboard.isDown('m', true))
						audio.mute();

					if (!this.visible)
						return;

					if (keyboard.isDown(' ', true))
						this.play();

					if (keyboard.isDown('h', true))
						this.help();
				},
				help: function() {
					events.fire('onHelp');
					this.setVisible(false);
					this.click();
				},
				play: function() {
					maps.build(1);
					globals.player.player.updateHud();

					this.setVisible(false);

					globals.hud.html.setVisible(true);
					this.click();
				},
				globalEvents: {
					gameEnd: function() {
						this.setVisible(true);
					}
				}
			},
			transform: {

			}
		}
	};
});