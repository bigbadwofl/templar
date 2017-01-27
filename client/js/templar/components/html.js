define([
	'templar/loaders/snippets'
], function(
	snippets
) {
	return {
		type: 'html',

		html: null,
		el: null,
		
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
			if (visible) {
				this.el
					.removeClass('hidden')
					.fadeIn('fast');
			}
			else {
				this.el
					.addClass('hidden')
					.fadeOut('fast');
			}

			this.enabled = visible;
		},
		isVisible: function() {
			return (!this.el.hasClass('hidden'));
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