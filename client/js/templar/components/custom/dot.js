define([
	'templar/objects/objects'
], function(
	objects
) {
	return {
		type: 'dot',
		onTriggerEnter: function(o) {
			if (o.name == 'player') {
				o.player.eatDot(this.parent);
				objects.destroy(this.parent);
			}
		}	
	};
});