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
		cd: 0,

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
			var renderer = this.parent.renderer;

			this.sync({
				id: this.id,
				position: {
					x: transform.position.x,
					y: transform.position.y
				},
				size: {
					x: transform.size.x,
					y: transform.size.y
				},
				spriteName: renderer.spriteName,
				layer: renderer.layer
			});
		},
		update: function() {
			if (this.cd > 0)
				this.cd--;
		},
		sync: function(syncObject) {
			if (this.cd > 0)
				return;

			this.cd = 25;

			client.request({
				module: 'players',
				method: 'sync',
				message: syncObject
			});
		},
		onMove: function(x, y) {
			this.sync({
				id: this.id,
				position: {
					x: x,
					y: y
				}
			});
		},
		onResize: function(w, h) {
			this.sync({
				id: this.id,
				size: {
					x: w,
					y: h
				}
			});
		},
		onSpriteChange: function(spriteName, layer) {
			this.sync({
				id: this.id,
				spriteName: spriteName,
				layer: layer
			});
		}
	};
});