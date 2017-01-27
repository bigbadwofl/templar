define([

], function(

) {
	return {
		type: 'shadowSprite',
		children: [
			{
				type: 'sprite',
				components: {
					renderer: {
						layer: 'shadows',
						fixed: true,
						opacity: 0.8
					},
					transform: {
						position: {
							x: -0.5,
							y: 10.3
						},
						size: {
							x: 18,
							y: 10
						}
					}
				}
			}
		],
		components: {
			renderer: {
				
			},
			transform: {

			}
		}
	};
});