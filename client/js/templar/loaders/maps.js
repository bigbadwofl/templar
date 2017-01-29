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
		buildObjects: function(map, layer, walkability, triggers) {
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

				o.addComponent('path');
				o.addComponent('collider', {
					trigger: true,
					offset: {
						x: 6,
						y: 6
					},
					size: {
						x: 0.3,
						y: 0.3
					}
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

				walkability[~~(l.x / 16)][~~((l.y - 16) / 16)] = true;

				o.addComponent('trigger', {
					affectCoordinates: l.properties.trigger.split(',').map(function(m) {
						var s = m.split('.');
						return {
							x: ~~s[0],
							y: ~~s[1]
						};
					})
				});

				triggers.push(o);
			}
		},
		build: function(level) {
			var name = 'l' + level;
			physics.enable(false);

			this.clean();
			$('canvas')
				.css('opacity', 0);

			var map = this.maps[name];
			//if ((!map) || (level > 7)) {
			if (!map) {
				$('body').css('background-color', '#271b24');
				events.fire('gameEnd');
				return;
			}

			var w = map.width;
			var h = map.height;

			var size = 16;
			var prefabArray = [];

			var walkability = _.get2dArray(w, h);
			var dotCount = 0;
			var monsterCount = 0;
			var triggers = [];

			for (var i = 0; i < map.layers.length; i++) {
				var layer = map.layers[i];

				if (layer.name == 'triggers') {
					this.buildObjects(map, layer, walkability, triggers);
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

							if (sheetName == 'walls') {
								o.addComponent('collider', {
									position: _.create(o.transform.position),
									size: _.create(o.transform.size)
								});
							}

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
						} else {
							o = objects.create(spriteName, null, null, noRender);
						}

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

						if (spriteName.indexOf('path') == 0) {
							o.addComponent('path');
							o.addComponent('collider', {
								trigger: true
							});

							walkability[x][y] = true;
						}

						if ((layerName == 'tiles') || (layerName == 'bg'))
							prefabArray.push(o);

						if (o.name == 'player') {
							globals.register('player', o);
							o.player.spawn = _.create(o.transform.position);
						}

						if (o.name.toLowerCase().indexOf('dot') > -1)
							dotCount++;

						if (o.name == 'pacman') {
							monsterCount++;
							o.pacman.spawn = _.create(o.transform.position);
						}

						globals.hud.html.dots = dotCount;

						c++;
					}
				}
			}

			//remove trigger stuff
			var removePrefabs = [];
			triggers.forEach(function(o) {
				var t = o.trigger;
				var origin = o.transform.position;

				t.affectCoordinates.forEach(function(c) {
					var match = null;
					for (var i = 0; i < prefabArray.length; i++) {
						var m = prefabArray[i];
						var pos = m.transform.position;
						var same = (
							(pos.x == (origin.x + (c.x * 16))) &&
							(pos.y == (origin.y + (c.y * 16))) &&
							(m.renderer.layer == 'tiles')
						);
						if (same) {
							match = m;
							removePrefabs.push(match);
							break;
						}
					}

					t.affects.push(match);
				});
			});

			removePrefabs.forEach(function(r) {
				for (var i = 0; i < prefabArray.length; i++) {
					if (prefabArray[i] == r) {
						prefabArray[i].addComponent('flickerer');
						prefabArray.splice(i, 1);
						i--;
					}
				}
			});

			//properties
			var properties = map.properties;
			var player = globals.player.player;
			player.level = level;
			player.time = ~~properties.time || 500;
			player.maxTime = player.time;
			player.updateHud();

			$('body').css('background-color', '#271b24');

			if (properties.female) {
				player.female = 'f';
				player.parent.animator.setState('fwalk');
				$('body').css('background-color', '#5b6ee1');
			}

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