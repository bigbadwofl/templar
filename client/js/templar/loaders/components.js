define([
	'templar/client',
	'templar/events'
], function(
	client,
	events
) {
	var components = {
		components: {},
		loading: [],
		init: function() {
			this.getComponentNames();
		},
		getComponentNames: function() {
			client.request({
				module: 'files',
				method: 'getComponents',
				callback: this.onGetComponentNames.bind(this)
			});
		},
		onGetComponentNames: function(names) {
			var scope = this;

			names.forEach(function(n) {
				this.loading.push(n);
			}, this);

			names.forEach(function(n) {
				require([n], this.onGetComponent.bind(this));
			}, this);
		},
		onGetComponent: function(component) {
			this.loading.splice(this.loading.indexOf(component.type), 1);
			this.components[component.type] = component;

			if (this.loading.length == 0)
				events.fire('moduleReady', 'components');
		},
		build: function(o, type, options) {
			var c = _.create(this.components[type]);
			if (!c.options)
				c.options = {};

			c.enabled = true;

			//Global Events
			for (var e in c.globalEvents) {
				events.addListener(e, c, c.globalEvents[e]);
			}

			//Events
			for (var e in c.events) {
				c[e] = c.events[e].bind(c);
			}
			delete c.events;

			//Methods
			for (var m in c.methods) {
				c[m] = c.methods[m].bind(c);
			}
			delete c.methods;

			if (options) {
				$.extend(true, c, options);
			}

			return c;
		},
		extend: function(component, options) {
			//Global Events
			for (var e in options.globalEvents) {
				events.addListener(e, component, options.globalEvents[e]);
			}

			$.extend(true, component, options);
		}
	};


	components.init();

	return components;
});