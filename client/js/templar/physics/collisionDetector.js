var collisionDetector = {
	enabled: false,
	colliders: [],
	interval: null,
	triggers: [],
	init: function() {
		this.update();
	},
	enable: function(enabled) {
		this.enabled = enabled;
	},
	onMessage: function(event) {
		var args = [].slice.call(arguments, 1);
		this[event].apply(this, args);
	},
	workComplete: function(event, data) {
		postMessage({
			event: event,
			data: data
		});
	},
	reset: function() {
		this.colliders = [];
		this.triggers = [];
	},
	registerCollider: function(collider) {
		var found = this.colliders.find(function(c) {
			return (c.id == collider.id);
		});

		if (found) {
			found.x = collider.x;
			found.y = collider.y;
			found.w = collider.w;
			found.h = collider.h;
			return;
		}

		this.colliders.push(collider);
	},
	move: function(data) {
		var o = null;
		for (var i = 0; i < this.colliders.length; i++) {
			var c = this.colliders[i];
			if (c.id == data.id) {
				o = c;
				break;
			}
		}

		if (!o)
			return;

		o.x = data.x;
		o.y = data.y;

		this.resolve(o);
	},
	resize: function(data) {
		var o = null;
		for (var i = 0; i < this.colliders.length; i++) {
			var c = this.colliders[i];
			if (c.id == data.id) {
				o = c;
				break;
			}
		}

		o.w = data.w;
		o.h = data.h;
	},
	resolve: function(c2) {
		if ((!this.enabled) || (c2.fixed))
			return;

		var colliders = this.colliders;
		var len = colliders.length;

		var c2HalfSize = {
			w: c2.x + (c2.w / 2),
			h: c2.y + (c2.h / 2)
		};

		for (var i = 0; i < len; i++) {
			var c1 = colliders[i];

			if (c1 == c2)
				continue;

			var c1HalfSize = {
				w: c1.x + (c1.w / 2),
				h: c1.y + (c1.h / 2)
			};

			var overlap = {
				x: c1HalfSize.w - c2HalfSize.w,
				y: c1HalfSize.h - c2HalfSize.h
			};

			var doesOverlap = {
				x: Math.abs(overlap.x) < Math.max(c1.w, c2.w),
				y: Math.abs(overlap.y) < Math.max(c1.h, c2.h)
			};

			if ((doesOverlap.x) && (doesOverlap.y)) {
				if (c1.trigger) {
					this.registerTrigger(c1.id, c2.id);

					this.workComplete('triggerEnter', {
						id: c1.id,
						target: c2.id
					});
				}
				if (c2.trigger) {
					this.registerTrigger(c2.id, c1.id);

					this.workComplete('triggerEnter', {
						id: c2.id,
						target: c1.id
					});
				}
				else if ((!c1.trigger) && (!c2.trigger)) {
					if ((Math.abs(overlap.x) > Math.abs(overlap.y))) {
						if (c1.x > c2.x)
							c2.x -= Math.max(c1.w, c2.w) - overlap.x;
						else
							c2.x += Math.max(c1.w, c2.w) + overlap.x;
					} else {
						if (c1.y > c2.y)
							c2.y -= Math.max(c1.h, c2.h) - overlap.y;
						else
							c2.y += Math.max(c1.h, c2.h) + overlap.y;
					}

					this.workComplete('resolve', {
						id: c2.id,
						x: c2.x,
						y: c2.y
					});
				}
			}
		}
	},
	registerTrigger: function(o, target) {
		var triggers = this.triggers;
		var len = triggers.length;
		
		for (var i = 0; i < len; i++) {
			var t = triggers[i];
			if ((t.o == o) && (t.target == target))
				return;
		}

		triggers.push({
			o: o,
			target: target
		});
	},
	removeCollider: function(o) {
		var colliders = this.colliders;
		var len = colliders.length;
		for (var i = 0; i < len; i++) {
			var c = colliders[i];

			if (c.id == o.id) {
				colliders.splice(i, 1);
				if (!c.trigger)
					return;

				var triggers = this.triggers;
				len = triggers.length;
				for (var j = 0; j < triggers.length; j++) {
					var t = triggers[j];

					if (t.o == o.id) {
						this.workComplete('triggerExit', {
							id: t.o,
							target: t.target
						});

						triggers.splice(j, 1);
						j--;
					}
				}

				return;
			}
		}
	},
	update: function() {
		var triggers = this.triggers;
		var colliders = this.colliders;

		for (var i = 0; i < triggers.length; i++) {
			var t = triggers[i];

			var c1 = colliders.find(function(c) {
				return (c.id == t.o);
			}, this);

			var c2 = colliders.find(function(c) {
				return (c.id == t.target);
			});

			if ((!c1) || (!c2)) {
				triggers.splice(i, 1);
				i--;
				continue;
			}

			var c1HalfSize = {
				w: c1.x + (c1.w / 2),
				h: c1.y + (c1.h / 2)
			};

			var c2HalfSize = {
				w: c2.x + (c2.w / 2),
				h: c2.y + (c2.h / 2)
			};

			var overlap = {
				x: c1HalfSize.w - c2HalfSize.w,
				y: c1HalfSize.h - c2HalfSize.h
			};

			var doesOverlap = {
				x: Math.abs(overlap.x) < Math.max(c1.w, c2.w),
				y: Math.abs(overlap.y) < Math.max(c1.h, c2.h)
			};

			if ((!doesOverlap.x) || (!doesOverlap.y)) {
				this.workComplete('triggerExit', {
					id: c1.id,
					target: c2.id
				});

				triggers.splice(i, 1);
				i--;
				continue;
			}
		}

		setTimeout(this.update.bind(this), 16);
	}
};

collisionDetector.init();

onmessage = function(m) {
	var tempData = JSON.parse(m.data);

	var args = [];
	var data = tempData;

	for (var d in data) {
		args.push(data[d]);
	}

	collisionDetector.onMessage.apply(collisionDetector, args);
};

if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		if (this == null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}