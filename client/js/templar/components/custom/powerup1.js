define([
	'templar/objects/objects',
	'templar/events'
], function(
	objects,
	events
) {
	return {
		type: 'powerup1',
		onTriggerEnter: function(o) {
			if (o.name == 'player') {
				events.fire('onPowerup');
				objects.destroy(this.parent);
			}
		}	
	};
});