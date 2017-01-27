define([
	'templar/loaders/components',
	'templar/events'
], function(
	components,
	events
) {
	return {
		id: -1,
		children: [],
		components: [],
		addChild: function(child) {
			child.parent = this;
			this.children.push(child);
		},
		addComponent: function(type, options) {
			var c = this[type];
			if (!c) {
				c = components.build(this, type, options);
				c.parent = this;

				this[type] = c;
				this.components.push(c);
			}
			else {
				components.extend(c, options);
			}

			c.init && c.init();
			c.afterInit && c.afterInit();

			return c;
		},
		getChild: function(index) {
			return this.children[index];
		},
		getComponent: function(type) {
			return this.components.find(function(c) {
				return (c.type == type);
			});
		},
		setEnabled: function(enabled) {
			if (enabled)
				this.event('onEnabled');
			else
				this.event('onDisabled');

			this.enabled = enabled;
		},
		event: function() {
			var args = [].slice.call(arguments, 0);

			var event = args[0];
			args.splice(0, 1);

			var components = this.components;
			var len = components.length;
			for (var i = 0; i < len; i++) {
				var c = components[i];
				if (!c.enabled)
					continue;

				c[event] && c[event].apply(c, args);
			}
		},
		destroy: function() {
			var components = this.components;
			var len = components.length;
			for (var i = 0; i < len; i++) {
				var c = components[i];

				events.destroy(c);

				c.destroy && c.destroy();
			}
		},
		update: function() {
			var len = this.components.length;
			for (var i = 0; i < len; i++) {
				var c = this.components[i];
				if (!c.enabled)
					continue;

				if ((c.type == 'renderer') || (c.type == 'particles')) {
					continue;
				}

				c.beforeUpdate && c.beforeUpdate();
				c.update && c.update();
			}
			
			len = this.children.length;
			for (var i = 0; i < len; i++) {
				var c = this.children[i];

				c.update && c.update();
			}
		}
	};
});