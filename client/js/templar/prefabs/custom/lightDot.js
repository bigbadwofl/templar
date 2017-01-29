define([

], function(

) {
	return {
		type: 'lightDot',
		base: 'dot',
		components: {
			renderer: {
				spriteName: 'lightDot',
				layer: 'doodads'
			},
			animator: {
				states: {
					flicker: [ 'lightDot', 'lightDot2', 'lightDot3', 'lightDot4' ],
					idle: [ 'lightDot' ]
				},
				state: 'flicker',
				speed: 8
			}
		}
	};
});