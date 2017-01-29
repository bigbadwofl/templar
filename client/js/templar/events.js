define([
	
], function(
	
) {
	return {
		events: {},
		queue: [],
		addListener: function(event, scope, method) {
			var list = this.events[event] || (this.events[event] = []);
			
			list.push({
				scope: scope,
				method: method
			});

			var queue = this.queue;
			for (var i = 0; i < queue.length; i++) {
				var q = queue[i];

				if (q.event == event) {
					var args = [ q.event ].concat(q.args);
					this.fire.apply(this, args);
					queue.splice(i, 1);
					i--;
				}
			}
		},
		destroy: function(c) {
			for (var e in this.events) {
				var list = this.events[e];

				for (var i = 0; i < list.length; i++) {
					if (c == list[i].scope) {
						list.splice(i, 1);
						i--;
					}
				}
			}
		},
		fire: function(event) {
			var list = this.events[event];
			if (!list)
				return;

			var args = arguments;
			[].splice.call(args, 0, 1);

			var len = list.length
			for (var i = 0; i < len; i++) {
				var l = list[i];
				l.method.apply(l.scope, args);
			}
		},
		fireSticky: function(event) {
			var list = this.events[event];
			if (!list) {
				this.queue.push({
					event: event,
					args: [].splice.call(arguments, 0, 1)
				});

				return;
			}

			var args = arguments;
			[].splice.call(args, 0, 1);

			var len = list.length
			for (var i = 0; i < len; i++) {
				var l = list[i];
				l.method.apply(l.scope, args);
			}
		}
	};
});