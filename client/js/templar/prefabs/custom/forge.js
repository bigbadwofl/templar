define([

], function(

) {
	return {
		type: 'forge',
		base: 'shadowSprite',
		children: [
			{
				override: true,
				components: {
					renderer: {
						opacity: 1
					},
					transform: {
						position: {
							x: 0,
							y: 11
						},
						size: {
							x: 8,
							y: 8
						}
					}
				}
			},
			{
				type: 'sprite',
				components: {
					renderer: {
						spriteName: 'light',
						layer: 'lights'
					},
					transform: {
						position: {
							x: -40,
							y: -10
						},
						size: {
							x: 100,
							y: 55
						}
					},
					lightFlickerer: {}
				}
			}
		],
		components: {
			collider: {},
			renderer: {
				spriteName: 'forge',
				layer: 'doodads'
			},
			transform: {
				size: {
					x: 16,
					y: 16
				}
			},
			particles: {
				ttl: [15, 40],
				xOffset: [4, 4, 2],
				yOffset: [6, 3, 3],
				vY: [0.1, 0.2],
				g: [80, 140],
				b: [10, 80],
				burst: [1, 5]
			}
		}
	};
});