define([
	'templar/client',
	'templar/events'
], function(
	client,
	events
) {
	var snippets = {
		snippets: {},
		loading: [],
		init: function() {
			this.getSnippetNames();
		},
		getSnippetNames: function() {
			client.request({
				module: 'files',
				method: 'getSnippets',
				callback: this.onGetSnippetNames.bind(this)
			});
		},
		onGetSnippetNames: function(names) {
			var scope = this;

			names.forEach(function(n) {
				if (n.indexOf('html') > -1)
					this.loading.push(n);
			}, this);

			for (var i = 0; i < names.length; i++) {
				var path = names[i];

				var name = path
					.split('/');
				name = name[name.length - 1]
					.split('.')[0];

				if (path.indexOf('.less') > -1)
					require(['css!' + path.replace('.less', '')]);
				else
					require(['html!' + path], this.onGetSnippet.bind(this, name));
			}
		},
		onGetSnippet: function(name, snippet) {
			this.snippets[name] = snippet;

			this.loading.splice(this.loading.indexOf(name), 1);

			if (this.loading.length == 0)
				events.fire('moduleReady', 'snippets');
		},
		getSnippet: function(name) {
			return this.snippets[name];
		}
	};

	snippets.init();

	return snippets;
});