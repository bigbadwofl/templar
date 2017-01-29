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
		type: 'lose',
		base: 'ui',
		components: {
			html: {
				html: 'lose',
				enabled: false,
				globalEvents: {
					playerLose: function(message) {
						this.enabled = true;
						this.setVisible(true);

						this.el.find('.heading').html(message);
					}
				},
				update: function () {
					if (!this.enabled)
						return;

					if (keyboard.isDown('esc')) {
						this.enabled = false;
						globals.menu.html.setVisible(true);
						globals.menu.html.setVisible(false);

						this.setVisible(false);

						$('canvas:not(.temp)').fadeOut('slow');
						this.click();
					}
					else if (keyboard.isDown(' ')) {
						physics.reset();
						maps.build(globals.player.player.level);
						keyboard.enabled = true;
						this.enabled = false;
						this.setVisible(false);
						this.click();
					}
				}
			}
		}
	};
});