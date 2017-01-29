define([

], function(

) {
	return {
		type: 'dot',
		base: 'sprite',
		components: {
			renderer: {
				spriteName: 'dot',
				layer: 'doodads'
			},
			transform: {
				size: {
					x: 16,
					y: 16
				}
			},
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
			dot: {},
			animator: {
				states: {
					flicker: [ 'dot', 'dot2', 'dot3', 'dot4' ],
					idle: [ 'dot' ]
				},
				state: 'flicker',
				speed: 8
			}
		}
	};
});