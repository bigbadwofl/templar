window._ = {
	create: function(object) {
		var o = $.extend(true, {}, object);

		if ((o.init) && (arguments.length > 1)) {
			[].splice.call(arguments, 0, 1);
			o.init.apply(o, arguments);
		}

		return o;
	},
	get2dArray: function(w, h) {
		var result = [];
		for (var i = 0; i < w; i++) {
			var inner = [];
			for (var j = 0; j < h; j++) {
				inner.push(0);
			}

			result.push(inner);
		}

		return result;
	},
	wrap: function(data) {
		if (!(data instanceof Array))
			return [ data ];
		else
			return data;
	},
	randFloat: function(low, high) {
		if (!high) {
			high = low;
			low = 0;
		}

		return (low + (Math.random() * (high - low)));
	},
	randInt: function(low, high) {
		if (!high) {
			high = low;
			low = 0;
		}

		return ~~this.randFloat(low, high);
	},
	randEl: function(array) {
		return array[this.randInt(array.length)];
	}
};