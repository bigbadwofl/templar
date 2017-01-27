define([
	
], function(
	
) {
	return {
		type: 'bobber',

		state: 0,
		stateMax: 16,
		frequency: 5,
		amplitude: 1,
		
		beforeUpdate: function() {
			this.state++;
			if (this.state == this.stateMax)
				this.state = this.stateMax;

			var offset = this.parent.renderer.offset;

			var dy = Math.sin(this.state / this.frequency) * this.amplitude;
			offset.y = -dy;
		}
	};
});