define([
	
], function(
	
) {
	return {
		type: 'interpolator',

		lastPosition: _.create(vector2),
		v: _.create(vector2),
		speed: 0.04,

		events: {
			onSyncPosition: function(x, y) {
				var lastPosition = this.lastPosition;

				if (lastPosition.x != null) {
					var v = this.v;
					v.x = (lastPosition.x - x) * this.speed;
					v.y = (lastPosition.y - y) * this.speed;
				}

				this.lastPosition.x = x;
				this.lastPosition.y = y;
			}
		},

		update: function() {
			var v = this.v;
			if (v.x == null)
				return;

			var transform = this.parent.transform;
			var pos = transform.position;

			transform.move(pos.x - v.x, pos.y - v.y);
		}
	};
});