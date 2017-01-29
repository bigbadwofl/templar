define([
	'templar/canvas'
], function(
	canvas
) {
	return {
		type: 'camera',
		center: false,
		position: _.create(vector2),
		center: function(x, y) {
			canvas.setTranslation({ 
				x: x + 8, 
				y: y + 8
			}, true);
		}
	};
});