define([
	'templar/client',
	'templar/events',
	'templar/objects/objects',
	'templar/loaders/spritesheets',
	'templar/optimizer',
	'templar/loaders/prefabs',
	'templar/physics/physics',
	'templar/globals',
	'templar/loaders/resources',
	'templar/canvas',
	'templar/pathfinder'
], function(
	client,
	events,
	objects,
	spritesheets,
	optimizer,
	prefabs,
	physics,
	globals,
	resources,
	canvas,
	pathfinder
) {
	var maps = {
		maps: {},
		loading: [],
		init: function() {
			this.getMapNames();
		},
		getMapNames: function() {
			client.request({
				module: 'files',
				method: 'getMaps',
				callback: this.onGetMapNames.bind(this)
			});
		},
		onGetMapNames: function(names) {
			var scope = this;

			names.forEach(function(n) {
				this.loading.push(n);
			}, this);

			names.forEach(function(n) {
				require(['json!' + n], this.onGetMap.bind(this, n));
			}, this);
		},
		onGetMap: function(name, map) {
			var filename = name.replace(/^.*[\\\/]/, '').replace('.json', '');

			this.maps[filename] = map;

			this.loading.splice(this.loading.indexOf(name), 1);

			if (this.loading.length == 0)
				events.fire('moduleReady', 'maps');
		},
		clean: function() {
			var oList = objects.objects;
			for (var i = 0; i < oList.length; i++) {
				var o = oList[i];
				if (o.html)
					continue;

				objects.destroy(o);
				i--;
			}
		},
		buildObjects: function(map, layer) {
			var list = layer.objects;

			for (var i = 0; i < list.length; i++) {
				var l = list[i];
				var cell = l.gid;

				//find spritesheet name
				var sheetName = map.tilesets[0].name;
				var firstgid = 0;
				for (var s = 1; s < map.tilesets.length; s++) {
					var tileset = map.tilesets[s];
					if (tileset.firstgid <= cell) {
						sheetName = tileset.name;
						firstgid = tileset.firstgid - 1;
					} else
						break;
				}

				cell -= firstgid;
				var spriteName = spritesheets.getMapping(sheetName, cell);
				var spriteLayer = resources.sprites[spriteName].layer;

				var o = objects.create('sprite', null, null);
				o.addComponent('renderer', {
					spriteName: spriteName,
					layer: spriteLayer,
					fixed: true
				});

				o.addComponent('transform', {
					position: {
						x: l.x,
						y: l.y - 16
					},
					size: {
						x: 16,
						y: 16
					}
				});
			}
		},
		build: function(name) {
			physics.enable(false);

			this.clean();
			$('canvas')
				.css('opacity', 0);

			var map = this.maps[name];

			var w = map.width;
			var h = map.height;

			var size = 16;
			var prefabArray = [];

			var walkability = _.get2dArray(w, h);
			var triggers = [];

			for (var i = 0; i < map.layers.length; i++) {
				var layer = map.layers[i];

				if (layer.name == 'triggers') {
					this.buildObjects(map, layer);
					continue;
				}

				var data = layer.data;

				var c = 0;
				for (var y = 0; y < h; y++) {
					for (var x = 0; x < w; x++) {
						var cell = data[c];
						if (cell == 0) {
							c++;
							continue;
						}

						//find spritesheet name
						var sheetName = map.tilesets[0].name;
						var firstgid = 0;
						for (var s = 1; s < map.tilesets.length; s++) {
							var tileset = map.tilesets[s];
							if (tileset.firstgid <= cell) {
								sheetName = tileset.name;
								firstgid = tileset.firstgid - 1;
							} else
								break;
						}

						cell -= firstgid;
						try {
							var spriteName = spritesheets.getMapping(sheetName, cell);
							var spriteLayer = resources.sprites[spriteName].layer;

							var isPrefab = (prefabs.getPrefab(spriteName) != null);

							var layerName = spriteLayer || sheetName;
						}
						catch (e) {
							console.log(e);
						}

						var noRender = false;
						if ((sheetName == 'tiles') || (sheetName == 'walls'))
							noRender = false;

						var o = null;
						if (!isPrefab) {
							var sprite = 'sprite';
							if (sheetName != 'tiles')
								sprite = 'sprite';

							o = objects.create(sprite, null, null, noRender);
							o.addComponent('renderer', {
								spriteName: spriteName,
								layer: layerName,
								fixed: true
							});

							var child = o.getChild(0);
							if (child) {
								child.addComponent('renderer', {
									opacity: 0.7
								});
								child.addComponent('transform', {
									position: {
										x: 0.5,
										y: 8
									},
									size: {
										x: 14,
										y: 8
									}
								});
							}
						} else
							o = objects.create(spriteName, null, null, noRender);

						var transform = o.transform;
						var tSize = transform.size;

						o.addComponent('transform', {
							position: {
								x: x * size,
								y: y * size
							}
						});

						o.addComponent('transform', {
							size: {
								x: tSize.x || size,
								y: tSize.y || size
							}
						});

						if (sheetName == 'walls')
							o.addComponent('collider');

						if ((layerName == 'tiles') || (layerName == 'bg'))
							prefabArray.push(o);

						if (o.name == 'player')
							globals.register('player', o);

						c++;
					}
				}
			}

			$('body').css('background-color', '#271b24');

			optimizer.optimize(prefabArray);

			objects.sort();

			physics.enable(true);

			pathfinder.init(walkability);

			$('canvas:not(.temp)')
				.show()
				.css('opacity', 0)
				.animate({
					opacity: 1
				}, 1000);
		}
	};

	maps.init();

	return maps;
});