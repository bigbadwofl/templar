define([
	'templar/globals',
	'templar/input/keyboard',
	'templar/loaders/maps',
	'templar/physics/physics'
], function(
	globals,
	keyboard,
	maps,
	physics
) {
	return {
		type: 'paused',
		base: 'ui',
		components: {
			html: {
				html: 'paused',
				enabled: false,
				globalEvents: {
					onPause: function(message) {
						this.enabled = true;
						this.setVisible(true);
						this.click();
					}
				},
				update: function() {
					if (!this.enabled)
						return;

					if (keyboard.isDown('esc')) {
						this.enabled = false;

						globals.menu.html.setVisible(true);
						globals.hud.html.setVisible(false);
						this.setVisible(false);

						$('canvas:not(.temp)').fadeOut('slow');
						this.click();
					} else if (keyboard.isDown('r')) {
						physics.reset();
						maps.build(globals.player.player.level);
						keyboard.enabled = true;
						this.enabled = false;
						this.setVisible(false);
						this.click();
					} else if (keyboard.isDown(' ')) {
						this.enabled = false;
						this.setVisible(false);
						globals.player.player.dead = false;
						globals.player.player.startTime = +globals.time;
						this.click();
					}
				}
			}
		}
	};
});