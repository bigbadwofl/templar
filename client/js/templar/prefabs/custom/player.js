define([

], function(

) {
	return {
		type: 'player',
		base: 'shadowSprite',
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
				trigger: false
			},
			camera: {
				center: true
			},
			netview: {}
		}
	};
});