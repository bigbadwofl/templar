define([
	'templar/client',
	'templar/events'
], function(
	client,
	events
) {
	var prefabs = {
		prefabs: {},
		loading: [],
		init: function() {
			this.getPrefabNames();
		},
		getPrefabNames: function() {
			client.request({
				module: 'files',
				method: 'getPrefabs',
				callback: this.onGetPrefabNames.bind(this)
			});
		},
		onGetPrefabNames: function(names) {
			var scope = this;

			names.forEach(function(n) {
				this.loading.push(n);
			}, this);

			names.forEach(function(n) {
				require([n], this.onGetPrefab.bind(this));
			}, this);
		},
		onGetPrefab: function(prefab) {
			this.loading.splice(this.loading.indexOf(prefab.type), 1);
			this.prefabs[prefab.type] = prefab;

			if (this.loading.length == 0)
				events.fireSticky('moduleReady', 'prefabs');
		},
		getPrefab: function(name) {
			return this.prefabs[name];
		}
	};

	prefabs.init();

	return prefabs;
});