define([
	'templar/client',
	'templar/events',
	'templar/loaders/resources'
], function(
	client,
	events,
	resources
) {
	var spritesheets = {
		spritesheets: {},
		loading: [],
		init: function() {
			this.getSheetNames();
		},
		getSheetNames: function() {
			client.request({
				module: 'files',
				method: 'getSpritesheets',
				callback: this.onGetSheetNames.bind(this)
			});
		},
		onGetSheetNames: function(names) {
			var scope = this;

			names.forEach(function(n) {
				this.loading.push(n);
			}, this);

			names.forEach(function(n) {
				require([n], this.onGetSheet.bind(this));
			}, this);
		},
		onGetSheet: function(sheet) {
			if (!sheet.options) {
				sheet.options = {
					pad: 8,
					size: 64
				};
			}

			this.spritesheets[sheet.name] = sheet;
			this.loadSheet(sheet);
		},
		getMapping: function(sheet, index) {
			var mapping = this.spritesheets[sheet]
				.mapping['_' + index];

			return mapping;
		},
		loadSheet: function(sheet) {
			sheet.mapping = {};
			var options = sheet.options;

			resources.loadSpritesheet(sheet);

			this.loading.splice(this.loading.indexOf(sheet.name), 1);

			if (this.loading.length == 0)
				events.fireSticky('moduleReady', 'spritesheets');
		}
	};

	spritesheets.init();

	return spritesheets;
});