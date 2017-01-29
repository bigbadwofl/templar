define([
	
], function(
	
) {
	return {
		type: 'animator',
		states: {
			idle: [ 'player' ],
			walk: [ 'player', 'playerMov', 'playerMov2' ]
		},
		state: 'walk',
		nextState: null,
		time: 0,
		speed: 16,
		cd: 0,
		setState: function(state) {
			if (this.state == state)
				return;

			this.nextState = state;

			this.state = state;
			this.time = 0;

			this.parent.renderer.setSprite(this.states[state][0]);
		},
		update: function() {
			if (!this.state)
				return;

			var state = this.states[this.state];

			this.cd++;
			if (this.cd == this.speed) {
				this.time++;
				this.cd = 0;

				if (this.nextState) {
					state = this.states[this.nextState];
					this.time = 0;
					this.nextState = null;
				}
				else if (this.time == state.length)
					this.time = 0;

				this.parent.renderer.setSprite(state[this.time]);
			}
		}
	};
});