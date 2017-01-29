define([
	'templar/pathfinder',
	'templar/events',
	'templar/loaders/audio'
], function(
	pathfinder,
	events,
	audio
) {
	return {
		type: 'trigger',
		active: true,
		affectCoordinates: null,
		affects: [],
		enabled: true,
		events: {
			onTriggerEnter: function(o) {
				if (o.name != 'player')
					return;

				if (!this.enabled)
					return;

				this.enabled = false;

				audio.play('trigger', false, false, 0.5);

				this.active = !this.affects[0].renderer.enabled;

				this.affects.forEach(function(a) {
					a.flickerer.phase = 2;
					a.flickerer.flicker(30, this.active);
					a.collider.setEnabled(this.active);
					var pos = a.transform.position;
					pathfinder.walkability[~~(pos.x / 16)][~~(pos.y / 16)] = this.active;
				}, this);

				events.fire('onWalkabilityChange');
			}
		}	
	};
});