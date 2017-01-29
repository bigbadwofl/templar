define([
	'templar/loaders/snippets',
	'templar/loaders/audio'
], function(
	snippets,
	audio
) {
	return {
		type: 'html',
		html: null,
		el: null,
		visible: true,
		init: function() {
			if (this.html) {
				var snippet = snippets.getSnippet(this.html);
				if (!snippet)
					snippet = this.html;

				if (this.el)
					this.el.remove();

				this.el = $(snippet)
					.appendTo('.ui-container');
			}
		},
		setVisible: function(visible) {
			this.visible = visible;

			if (visible)
				this.el.fadeIn('fast');
			else
				this.el.fadeOut('fast');
		},
		click: function() {
			audio.play('pickup0', false, false, 0.5);
		},
		onMove: function(x, y) {
			if (!this.el)
				return;

			this.el
				.css('left', x)
				.css('top', y);
		},
		onResize: function(w, h) {
			if (!this.el)
				return;
			
			this.el
				.css('width', w)
				.css('height', h);
		},
		destroy: function() {
			if (this.el)
				this.el.remove();
		}
	};
});