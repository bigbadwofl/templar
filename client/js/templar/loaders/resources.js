define([

], function(

) {
	return {
		sprites: {},
		loadImage: function(name, outline) {
			var sprite = this.sprites[name];
			if (sprite)
				return sprite;

			sprite = {
				name: name,
				image: (new Image())
			};

			this.sprites[name] = sprite;

			/*if (outline)
				sprite.image.onload = this.onSprite.bind(this, sprite);*/

			sprite.image.src = '/images/' + name + '.png';

			return sprite;
		},
		loadSpritesheet: function(sheet) {
			var sprite = {
				sheet: sheet,
				image: (new Image())
			};

			sprite.image.onload = this.onSprite.bind(this, sprite);

			sprite.image.src = '/images/' + sheet.name + '.png';
		},
		onSprite: function(sprite) {
			var options = sprite.sheet.options;

			//create temporary canvas
			var canvas = $('<canvas></canvas>')
				.appendTo('body')
				.css('display', 'none');
			var ctx = canvas[0].getContext('2d');

			//resize canvas to fit sprite
			var w = sprite.image.width;
			var h = sprite.image.height;
			canvas[0].width = w;
			canvas[0].height = h;

			ctx.drawImage(sprite.image, 0, 0);	

			var map = sprite.sheet.map;
			var c = 1;
			for (var i = 0; i < map.length; i++) {
				var row = map[i];
				var y = options.pad + (i * (options.size + options.pad));

				for (var j = 0; j < row.length; j++) {
					var tempCanvas = $('<canvas class="temp"></canvas>')
						.appendTo('body')
						.css('display', 'none');
					var tempCtx = tempCanvas[0].getContext('2d');

					//resize canvas to fit sprite
					tempCanvas[0].width = options.size;
					tempCanvas[0].height = options.size;			

					var x = options.pad + (j * (options.size + options.pad));

					var newSprite = {
						name: row[j],
						image: (new Image())
					};

					this.sprites[row[j]] = newSprite;

					tempCtx.drawImage(sprite.image, x, y, options.size, options.size, 0, 0, options.size, options.size);

					//newSprite.image.src = tempCanvas[0].toDataURL();
					newSprite.image = tempCanvas[0];

					if (sprite.sheet.layerMap)
						newSprite.layer = sprite.sheet.layerMap[i][j];

					sprite.sheet.mapping['_' + c] = row[j];

					c++;
				}
			}

			canvas.remove();
		},
		/*onSprite: function(sprite) {
			//create temporary canvas
			var canvas = $('<canvas></canvas>')
				.appendTo('body')
				.css('display', 'none');
			var ctx = canvas[0].getContext('2d');

			//resize canvas to fit sprite
			var w = sprite.image.width;
			var h = sprite.image.height;
			canvas[0].width = w;
			canvas[0].height = h;

			ctx.drawImage(sprite.image, 0, 0);

			var data = ctx.getImageData(0, 0, w, h);
			var pixels = data.data;

			var newData = ctx.createImageData(w, h);
			var newPixels = newData.data;

			var c = 0;
			var index = 0;
			var prevRow = (w * 4);
			for (var i = 0; i < w; i++) {
				for (var j = 0; j < h; j++) {
					var d = pixels[c + 3];

					newPixels[c] = pixels[c];
					newPixels[c + 1] = pixels[c + 1];
					newPixels[c + 2] = pixels[c + 2];
					newPixels[c + 3] = pixels[c + 3];

					if (d != 0) {
						c += 4;
						continue;
					}

					var drawOutline = false;

					if ((i > 0) && (pixels[c + 7])) {
						index = c + 4;
						drawOutline = true;
					}
					else if ((i < w - 1) && (pixels[c - 1] > 0)) {
						index = c - 4;
						drawOutline = true;
					}
					else if ((j < h - 1) && (pixels[c + prevRow + 3])) {
						index = c + prevRow;
						drawOutline = true;
					}

					if (drawOutline) {
						var r = pixels[index];
						var g = pixels[index + 1];
						var b = pixels[index + 2];

						newPixels[c] = ~~(r * 0.15);
						newPixels[c + 1] = ~~(g * 0.15);
						newPixels[c + 2] = ~~(b * 0.15);		

						newPixels[c + 3] = 96;
					}

					c += 4;
				}
			}

			ctx.putImageData(newData, 0, 0);

			sprite.image.onload = null;
			sprite.image.src = canvas[0].toDataURL();

			canvas.remove();
		},*/
		buildVirtual: function(name, spritesheet, x, y, w, h) {
			var sprite = this.loadImage(spritesheet);

			var virtualSprite = {
				name: name,
				image: sprite.image,
				x: x,
				y: y,
				w: w,
				h: h
			};

			this.sprites[name] = virtualSprite;

			return virtualSprite;
		}
	};
});