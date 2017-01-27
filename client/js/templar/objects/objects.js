define([
	'templar/objects/object',
	'templar/loaders/prefabs',
	'templar/canvas',
	'templar/globals'
], function(
	object,
	prefabs,
	canvas,
	globals
) {
	return {
		nextId: 0,
		objects: [],
		renderList: [],
		create: function(name, parent, options, noRender, global) {
			var o = _.create(object);
			o.id = this.nextId++;

			if (global)
				globals.register(name, o);

			if (name) {
				o.name = name;

				var prefab = prefabs.prefabs[name];
				if (prefab) {
					//Options
					o.options = _.create(prefab.options);

					var baseName = prefab.base;
					while (baseName) {
						var base = prefabs.prefabs[baseName];

						//Base Components
						for (var c in base.components) {
							o.addComponent(c, base.components[c]);
						}

						//Base Children
						if (base.children) {
							for (var i = 0; i < base.children.length; i++) {
								var c = base.children[i];
								this.create(c.type, o, c.components);
							}
						}

						baseName = base.base;
					}

					//Components
					for (var c in prefab.components) {
						o.addComponent(c, prefab.components[c]);
					}

					if (options) {
						for (var c in options) {
							o.addComponent(c, options[c]);
						}
					}

					//Children
					if (prefab.children) {
						for (var i = 0; i < prefab.children.length; i++) {
							var c = prefab.children[i];
							if (!c.override)
								this.create(c.type, o, c.components);
							else {
								var child = o.getChild(i);
								for (var component in c.components) {
									child.addComponent(component, c.components[component]);
								}
							}
						}
					}
				}
			}

			if (!parent)
				this.objects.push(o);
			else
				parent.addChild(o);

			if (!noRender) {
				if (o.renderer)
					this.renderList.push(o.renderer);
				if (o.particles)
					this.renderList.push(o.particles);
			}

			return o;
		},
		sort: function() {
			this.renderList.sort(function(a, b) {
				return (a.order - b.order);
			});
		},
		removeRenderer: function(renderer) {
			var r = this.renderList;
			var len = r.length;
			for (var i = 0; i < len; i++) {
				if (r[i] == renderer) {
					r.splice(i, 1);
					return;
				}
			}
		},
		destroy: function(object) {
			var objects = this.objects;
			var len = objects.length;
			for (var i = 0; i < len; i++) {
				var o = objects[i];

				if (o == object) {
					objects.splice(i, 1);
					object.destroy();
					break;
				}
			}

			var renderList = this.renderList;
			len = renderList.length;
			for (var i = 0; i < len; i++) {
				var r = renderList[i];

				if ((object.renderer) && (r == object.renderer)) {
					renderList.splice(i, 1);
					i--;
					continue;
				}
				if ((object.particles) && (r == object.particles)) {
					renderList.splice(i, 1);
					i--;
					continue;
				}
			}
		},
		reorder: function(object) {
			var order = object.order;

			if (order == null)
				return;

			var c = this.renderList.filter(function(r) {
				return (r.spriteName == 'player');
			})

			//find index in array
			var index = -1;
			var moveBack = true;
			var objects = this.renderList;
			var len = objects.length;
			for (var i = 0; i < len; i++) {
				var o = objects[i];

				if (o == object) {
					index = i;
					break;
				}
				else if (o.order > order)
					moveBack = false;
			}

			if (index == -1)
				return;

			objects.splice(index, 1);
			len--;

			if (moveBack) {
				while (true) {
					var o = objects[index];
					if ((!o) || (o.order > order)) {
						objects.splice(index, 0, object);
						break;
					}

					index++;
				}
			}
			else {
				index--;
				
				while (true) {
					var o = objects[index];
					if ((!o) || (o.order < order)) {
						index++;

						objects.splice(index, 0, object);
						break;
					}

					index--;
				}
			}

			var c2 = this.renderList.filter(function(r) {
				return (r.spriteName == 'player');
			})

			if (c2.length > c.length) {
				console.log(object);
			}
		},
		find: function(callback) {
			var objects = this.objects;
			var len = objects.length;
			for (var i = 0; i < len; i++) {
				var o = objects[i];

				if (callback(o))
					return o;
			}
		},
		findById: function(id) {
			var objects = this.objects;
			var len = objects.length;
			for (var i = 0; i < len; i++) {
				var o = objects[i];

				if (o.id == id)
					return o;
			}
		},
		update: function() {
			var objects = this.objects;
			for (var i = 0; i < objects.length; ++i) {
				var o = objects[i];
				objects[i].update();
			}
		},
		render: function() {
			canvas.clear();
			canvas.begin();

			var r = this.renderList;

			var len = r.length;
			for (var i = 0; i < len; i++) {
				var c = r[i];
				if (!c.enabled)
					continue;
				
				c.update();
			}

			canvas.end();
		}
	};
});