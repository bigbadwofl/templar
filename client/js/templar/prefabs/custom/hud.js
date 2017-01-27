define([
	'templar/globals',
	'templar/events'
], function(
	globals,
	events
) {
	return {
		type: 'hud',
		base: 'clickHtml',
		components: {
			html: {
				html: 'hud',
				dots: 0,
				time: 0,
				maxTime: 0,
				globalEvents: {
					gameEnd: function() {
						this.setVisible(false);
					}
				},
				afterInit: function() {

				},
				setTime: function(time, maxTime) {
					this.time = time;
					this.maxTime = maxTime;

					this.el.find('.time').html('time: ' +time);
				},
				setDots: function(eaten) {
					this.el.find('.dots').html('dots: ' + (this.dots - eaten));

					if (eaten >= this.dots) {
						events.fire('onWin', eaten, this.dots, this.time, this.maxTime);
					}
				},
				setLives: function(lives) {
					this.el.find('.lives').html('lives: ' + lives);
				}
			},
			transform: {
				
			}
		}
	};
});