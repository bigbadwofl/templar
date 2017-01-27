define([

], function(

) {
	return {
		type: 'lightFlickerer',

		origin: null,
		options: {
			flickerSpeed: 0.6,
			flickerChance: 25
		},
		
		methods: {
			init: function() {
				this.origin = _.create(this.parent.transform.position);
			},
			beforeUpdate: function() {
				if (_.randInt(0, 100) >= this.options.flickerChance)
					return;

				this.parent.transform.move(
					this.origin.x + _.randFloat(0, this.options.flickerSpeed * 2) - this.options.flickerSpeed,
					this.origin.y + _.randFloat(0, this.options.flickerSpeed * 2) - this.options.flickerSpeed
				);
			}
		}
	};
});