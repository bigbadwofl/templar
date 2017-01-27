define([
	
], function(
	
) {
	return {
		mappings: {
			'37': 'left',
			'38': 'up',
			'39': 'right',
			'40': 'down',
			'27': 'esc'
		}	,
		getMapping: function(charCode) {
			return (
				this.mappings[charCode] || 
				String.fromCharCode(charCode).toLowerCase()
			);

		}
	};
});