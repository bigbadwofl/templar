define([
	'templar/objects/objects'
], function(
	objects
) {
	return {
		optimize: function(prefabs) {
			var layers = {
				def: []
			};

			for (var i = 0; i < prefabs.length; i++) {
				var p = prefabs[i];

				var renderer = p.renderer;
				if (!renderer)
					return;

				if (renderer.fixed) {
					renderer.enable(false);

					var layerName = renderer.layer || 'def';
					var layer = layers[layerName] || (layers[layerName] = []);

					layer.push(p);
				}
			}

			for (var l in layers) {
				var list = layers[l];
				if (list.length == 0)
					continue;

				this.packLayer(l, list);
			}
		},
		packLayer: function(name, prefabs) {
			//create temporary canvas
			var canvas = $('<canvas class="temp"></canvas>')
				.appendTo('body')
				.css('display', 'none');
			var ctx = canvas[0].getContext('2d');

			//find bounds [minX, minY, maxX, maxY]
			var bounds = [9999, 9999, -9999, -9999];
			prefabs.forEach(function(p) {
				var transform = p.transform;
				var position = transform.position;
				var size = transform.size;

				if (position.x < bounds[0])
					bounds[0] = position.x;
				if (position.y < bounds[1])
					bounds[1] = position.y;
				if (position.x + size.x > bounds[2])
					bounds[2] = position.x + size.x;
				if (position.y + size.y > bounds[3])
					bounds[3] = position.y + size.y;
			});

			var size = {
				x: bounds[2] - bounds[0],
				y: bounds[3] - bounds[1]
			};
			
			//resize canvas to fit prefabs
			canvas[0].width = size.x;
			canvas[0].height = size.y;

			//draw prefabs
			prefabs.forEach(function(p) {
				var transform = p.transform;
				var position = transform.position;
				var size = transform.size;
				var sprite = p.renderer.sprite;

				if (!sprite.x)
					ctx.drawImage(sprite.image, position.x - bounds[0], position.y - bounds[1], size.x, size.y);
				else
					ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.w, sprite.h, position.x - bounds[0], position.y - bounds[1], size.x, size.y);
			});

			//grab texture
			var texture = canvas[0].toDataURL();

			//create new prefab
			var layer = objects.create('sprite', null, {
				transform: {
					position: {
						x: bounds[0],
						y: bounds[1]
					},
					size: {
						x: size.x,
						y: size.y
					}
				},
				renderer: {

				}
			});

			var renderer = layer.renderer;
			renderer.sprite = {
				image: new Image()
			};
			renderer.sprite.image.src = texture;
			renderer.layer = name;

			//clean up
			//canvas.remove();
		}
	};
});