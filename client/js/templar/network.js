define([
	'templar/objects/objects',
], function(
	objects
) {
	window.network = {
		objects: {},
		register: function(object, id) {
			this.objects[id] = object;
		},
		sync: function(data) {
			if (data.leave) {
				this.destroy(data.id);
				return;
			}

			var o = this.objects[data.id];
			if (!o) {
				o = objects.create('sprite');
				this.objects[data.id] = o;
				o.renderer.enabled = false;
			}

			if (o.netview)
				return;

			if ((data.position) || (data.size)) {
				var transform = o.transform;

				if (data.position) {
					transform.move(
						data.position.x,
						data.position.y
					);
				}

				if (data.size) {
					transform.resize(
						data.size.x,
						data.size.y
					);
				}
			}

			if (data.spriteName) {
				var renderer = o.renderer;
				renderer.layer = data.layer;
				renderer.spriteName = data.spriteName;
				renderer.setSprite();
				renderer.enabled = true;
			}
		},
		destroy: function(id) {
			var o = this.objects[id];
			if (!o)
				return;

			delete this.objects[id];

			objects.destroy(o);
		}
	};

	return window.network;
});