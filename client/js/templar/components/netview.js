define([
	'templar/client',
	'templar/network'
], function(
	client,
	network
) {
	return {
		type: 'netview',
		id: -1,
		spriteName: '',
		init: function() {
			this.enabled = false;

			this.getId();
		},
		getId: function() {
			client.request({
				module: 'players',
				method: 'getNetviewId',
				callback: this.onGetId.bind(this)
			});
		},
		onGetId: function(id) {
			this.id = id;
			this.enabled = true;

			network.register(this.parent, this.id);

			var transform = this.parent.transform;

			this.sync({
				id: this.id,
				position: {
					x: transform.position.x,
					y: transform.position.y
				},
				size: {
					x: transform.size.x,
					y: transform.size.y
				}
			});
		},
		sync: function(syncObject) {
			if (!this.enabled)
				return;

			client.request({
				module: 'players',
				method: 'sync',
				message: syncObject
			});
		},
		onMove: function(x, y) {
			var syncObject = {
				id: this.id,
				position: {
					x: x,
					y: y
				}
			};

			this.sync(syncObject);
		},
		onResize: function(w, h) {
			var syncObject = {
				id: this.id,
				size: {
					x: w,
					y: h
				}
			};

			this.sync(syncObject);
		},
		onSpriteChange: function(spriteName) {
			var syncObject = {
				id: this.id,
				spriteName: spriteName,
				layer: this.parent.renderer.layer
			};

			this.sync(syncObject);
		}
	};
});