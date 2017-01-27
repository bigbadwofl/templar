define([
	'templar/objects/objects',
	'templar/events'
], function(
	objects,
	events
) {
	var physics = {
		colliders: [],
		worker: null,
		events: [],
		init: function() {
			this.createWorker();
		},
		enable: function(enabled) {
			var msg = {
				0: 'enable',
				1: enabled
			};

			this.worker.postMessage(JSON.stringify(msg));
		},
		doWork: function(event) {
			var args = JSON.stringify(arguments);
			this.worker.postMessage(args);
		},
		onWorkComplete: function(message) {
			message = message.data;

			this[message.event].call(this, message.data);
		},
		createWorker: function() {
			require(['worker!templar/physics/collisionDetector.js'], this.onCreateWorker.bind(this));
		},
		onCreateWorker: function(worker) {
			this.worker = worker;

			this.worker.onmessage = this.onWorkComplete.bind(this);

			events.fireSticky('moduleReady', 'physics');
		},
		addCollider: function(o) {
			var transform = o.transform;
			var position = transform.position;
			var size = transform.size;

			var offset = o.collider.offset;
			var cSize = o.collider.size;

			var m = {
				id: o.id,
				x: position.x + offset.x,
				y: position.y + offset.y,
				w: size.x * cSize.x,
				h: size.y * cSize.y,
				fixed: o.collider.fixed,
				trigger: o.collider.trigger,
				name: o.renderer.spriteName
			};

			this.doWork('registerCollider', m);
		},
		reset: function() {
			this.doWork('reset', null);
		},
		removeCollider: function(o) {
			var m = {
				id: o.id
			};

			this.doWork('removeCollider', m);
		},
		move: function(o, offset) {
			var position = o.transform.position;

			this.doWork('move', {
				id: o.id,
				x: position.x + offset.x,
				y: position.y + offset.y
			});
		},
		resize: function(o, cSize) {
			var size = o.transform.size;

			this.doWork('resize', {
				id: o.id,
				w: size.x * cSize.x,
				h: size.y * cSize.y
			});
		},
		resolve: function(data) {
			var o = objects.findById(data.id);

			o.transform.move(
				data.x,
				data.y
			);
		},
		triggerEnter: function(data) {
			var o = objects.findById(data.id);
			if (!o)
				return;
			
			var target = objects.findById(data.target);

			var event = this.events.find(function(e) {
				return (
					(e.event == 'onTriggerStay') && 
					(e.args[0] == target) &&
					(e.object == o)
				);
			});

			if (!event) {
				this.events.push({
					event: 'onTriggerStay',
					object: o,
					args: [ target ]
				});

				o.event('onTriggerEnter', target);
			}
		},
		triggerExit: function(data) {
			var o = objects.findById(data.id);
			var target = objects.findById(data.target);
			if (!o)
				return;

			o.event('onTriggerExit', target);

			var events = this.events;
			var len = events.length;

			for (var i = 0; i < len; i++) {
				var e = events[i];

				if (
					(e.event == 'onTriggerStay') && 
					(e.args[0] == target) &&
					(e.object == o)
				) {
					events.splice(i, 1);
					return;
				}
			}
		},
		update: function() {
			var events = this.events;
			var len = events.length;
			for (var i = 0; i < len; i++) {
				var e = events[i];

				e.object.event.apply(e.object, [e.event].concat(e.args));
			}
		}
	};

	physics.init();

	return physics;
});