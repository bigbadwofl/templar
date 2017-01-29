define([

], function(

) {
	return {
		type: 'powerup1',
		base: 'sprite',
		components: {
			renderer: {
				spriteName: 'powerup1',
				layer: 'doodads'
			},
			transform: {
				size: {
					x: 16,
					y: 16
				}
			}/*,
			particles: {
				vX: [0.2, 0.1],
				vY: [0.2, 0.1],
				ttl: [10, 40],
				xOffset: [7, 0, 0],
				yOffset: [7, 0, 0],
				r: [223, 251],
				g: [113, 242],
				b: [38, 54],
				size: [1, 3]
			}*/,
			collider: {
				trigger: true,
				fixed: true,
				offset: {
					x: 6,
					y: 6
				},
				size: {
					x: 0.3,
					y: 0.3
				}
			},
			bobber: {
				enabled: false
			},
			powerup1: {},
			animator: {
				states: {
					idle: [ 'powerup1', 'powerup1anim' ]
				},
				state: 'idle',
				speed: 12
			}
		}
	};
});