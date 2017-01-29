define([

], function(

) {
	return {
		type: 'player',
		base: 'sprite',
		components: {
			renderer: {
				spriteName: 'player',
				layer: 'mobs',
				flip: true
			},
			transform: {
				position: {
					x: 96,
					y: 32
				},
				size: {
					x: 16,
					y: 16
				}
			},
			player: {},
			collider: {
				fixed: false,
				offset: {
					x: 3,
					y: 3
				},
				size: {
					x: 0.65,
					y: 0.65
				}
			},
			animator: {
				speed: 8,
				states: {
					walk: [ 'player', 'playerMov', 'playerMov2' ],
					evilwalk: [ 'playerevil', 'playerevil2', 'playerevil3', 'playerevil2' ],
					fevilwalk: [ 'fplayerevil', 'fplayerevil2', 'fplayerevil3', 'fplayerevil2' ],
					fwalk: [ 'fplayer', 'fplayerMov', 'fplayerMov2' ]
				}
			},
			flickerer: {},
			camera: {},
			bobber: {}
		}
	};
});