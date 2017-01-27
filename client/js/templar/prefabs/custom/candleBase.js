define([

], function(

) {
	return {
		type: 'candleBase',
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
							y: 12
						},
						size: {
							x: 6,
							y: 6
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
			renderer: {
				spriteName: 'candle1',
				layer: 'doodads'
			},
			transform: {
				size: {
					x: 16,
					y: 16
				}
			},
			collider: {

			},
			particles: {

			}
		}
	};
});