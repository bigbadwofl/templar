define([
	'templar/canvas'
], function(
	canvas
) {
	return {
		type: 'camera',

		center: true,
		position: _.create(vector2),
		
		doCenter: function(x, y) {
			canvas.setTranslation({ 
				x: x + 8, 
				y: y + 8
			}, true);
		}
	};
});