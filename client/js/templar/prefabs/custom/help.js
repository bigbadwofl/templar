define([
	'templar/input/keyboard',
	'templar/globals'
], function(
	keyboard,
	globals
) {
	return {
		type: 'help',
		base: 'ui',
		components: {
			html: {
				html: 'help',
				globalEvents: {
					onHelp: function() {
						this.setVisible(true);
					}
				},
				update: function() {
					if (!this.visible)
						return;

					if (keyboard.isDown('esc')) {
						this.setVisible(false);
						globals.menu.html.setVisible(true);
						this.click();
					}
				}
			},
			transform: {

			}
		}
	};
});