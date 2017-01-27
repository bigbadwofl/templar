var fs = require('fs');
var fsPath = require('path');

var files = {
	getFolder: function(path, remove) {
		return fs.readdirSync('./client/js/' + path + '/').map(function(f) {
			return path + '/' + f.replace('.js', '');
		});
	},
	getFolders: function(path) {
		return fs.readdirSync(path).filter(function(file) {
			return fs.statSync(fsPath.join(path, file)).isDirectory();
		});
	},
	getPrefabs: function(socket, msg) {
		var folders = [''].concat(this.getFolders('./client/js/templar/prefabs'));

		var result = [];
		folders.forEach(function(f) {
			var r = fs.readdirSync('./client/js/templar/prefabs/' + f + '/');
			r = r
				.filter(function(rf) {
					return (rf.indexOf('.js') > -1);
				})
				.map(function(rf) {
					return ('js/templar/prefabs/' + f + '/' + rf);
				});

			result = result.concat(r);
		}, this);

		msg.callback(result);
	},
	getComponents: function(socket, msg) {
		var folders = [''].concat(this.getFolders('./client/js/templar/components'));

		var result = [];
		folders.forEach(function(f) {
			var r = fs.readdirSync('./client/js/templar/components/' + f + '/');
			r = r
				.filter(function(rf) {
					return (rf.indexOf('.js') > -1);
				})
				.map(function(rf) {
					return ('js/templar/components/' + f + '/' + rf);
				});

			result = result.concat(r);
		}, this);

		msg.callback(result);
	},
	getSpritesheets: function(socket, msg) {
		var result = this.getFolder('templar/spritesheets');

		msg.callback(result);
	},
	getMaps: function(socket, msg) {
		var result = fs.readdirSync('./client/js/templar/maps/')
			.filter(function(f) {
				return (f.indexOf('.tmx') == -1);
			})
			.map(function(f) {
				return 'templar/maps/' + f;
			});

		msg.callback(result);
	},
	getSnippets: function(socket, msg) {
		var folders = this.getFolders('./client/js/templar/snippets/');

		var result = [];
		folders.forEach(function(f) {
			var r = fs.readdirSync('./client/js/templar/snippets/' + f + '/');
			r = r
				.filter(function(rf) {
					return (rf.indexOf('.css') == -1);
				})
				.map(function(rf) {
					return ('templar/snippets/' + f + '/' + rf);
				})

			result = result.concat(r);
		}, this);

		msg.callback(result);
	},
	getAudio: function(socket, msg) {
		var result = fs.readdirSync('./client/audio//')
			.map(function(f) {
				return '../audio/' + f;
			});

		msg.callback(result);
	}
};

module.exports = files;