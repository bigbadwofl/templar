define([
	
], function(
	
) {
	return {
		type: 'flickerer',

		cd: 0,
		phase: 3,
		end: true,

		flicker: function(duration, end) {
			if (end == null)
				end = true;

			this.cd = duration;
			this.end = end;
		},
		update: function() {
			if (this.cd > 0) {
				this.cd--;
				if (this.cd == 0) {
					this.parent.renderer.enabled = this.end;
				}
				else if (this.cd % this.phase == 0)
					this.parent.renderer.enabled = !this.parent.renderer.enabled;
			}
		}
	};
});