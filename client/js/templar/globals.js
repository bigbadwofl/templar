define([
	
], function(
	
) {
	return {
		time: 0,
		register: function(name, object) {
			this[name] = object;
		}	
	};
});