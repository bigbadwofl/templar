define([
	
], function(
	
) {
	return {
		type: 'pacman',
		components: {
			renderer: {
				spriteName: 'pacman',
				layer: 'mobs'
			},
			transform: {
				size: {
					x: 16,
					y: 16
				}
			},
			animator: {
				state: 'right',
				states: {
					right: [ 'pacman', 'pacmanright2', 'pacmanright3', 'pacmanright2' ],
					left: [ 'pacmanleft1', 'pacmanleft2', 'pacmanleft3', 'pacmanleft2' ],
					down: [ 'pacmandown1', 'pacmandown2', 'pacmandown3', 'pacmandown2' ],
					up: [ 'pacmanup1', 'pacmanup2', 'pacmanup3', 'pacmanup2' ]
				},
				speed: 8
			},
			pacman: {},
			collider: {
				fixed: false,
				trigger: true,
				offset: {
					x: 3,
					y: 3
				},
				size: {
					x: 0.65,
					y: 0.65
				}
			},
			flickerer: {},
			bobber: {}
		}	
	};
});