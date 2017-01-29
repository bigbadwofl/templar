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
		type: 'win',
		base: 'ui',
		components: {
			html: {
				html: 'win',
				enabled: false,
				globalEvents: {
					onWin: function(coins, total, time, maxTime) {
						this.enabled = true;
						this.setVisible(true);

						var el = this.el;

						var complete = ~~((coins / total) * 100);
						var speed = ~~((time / (maxTime / 2)) * 100);
						if (speed > 100)
							speed = 100;

						el.find('.box.complete .inner')
							.html(complete + '% complete');

						el.find('.box.speed .inner')
							.html(speed + '% speed');

						var perfection = ~~((complete / 2) + (speed / 2));

						el.find('.box.perfection .inner')
							.html(perfection + '% perfection');
					}
				},
				update: function() {
					if (!this.enabled)
						return;

					if (keyboard.isDown('esc', true)) {
						this.enabled = false;
						globals.menu.html.setVisible(true);
						globals.hud.html.setVisible(false);
						this.el.fadeOut('slow');
						this.click();

						$('canvas:not(.temp)').fadeOut('slow');
					} else if (keyboard.isDown('r')) {
						physics.reset();
						maps.build(globals.player.player.level);
						keyboard.enabled = true;
						this.enabled = false;
						this.setVisible(false);
						this.click();
					}
					else if (keyboard.isDown(' ', true)) {
						maps.build(globals.player.player.level + 1);
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