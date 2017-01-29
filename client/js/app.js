require.config({
	baseUrl: '../js/',
	waitSeconds: 100,
	map: {
		'*': {
			'image': 'plugins/image.js'
		}
	},
	paths: {
		'socket': 'https://cdn.socket.io/socket.io-1.3.5',
		'jquery': 'https://code.jquery.com/jquery-2.1.4.min',
		'jMigrate': 'https://code.jquery.com/jquery-migrate-1.2.1.min',
		'json': '../plugins/json',
		'text': '../plugins/text',
		'html': '../plugins/html',
		'css': '../plugins/css',
		'bin': '../plugins/bin',
		'audio': '../plugins/audio',
		'worker': '../plugins/worker',
		'game': 'game'
	},
	shim: {
		'socket': {
			exports: 'io'
		},
		'jquery': {
			exports: '$'
		},
		'jMigrate': {
			deps: [ 'jquery' ]
		},
		'game': {
			deps: [ 
				'jquery',
				'templar/vector2',
				'templar/network'
			]
		}
	}
});

require([
	'jquery'
], function(
	jquery
) {
	window.audioCtx = typeof window.AudioContext === 'function' ?
	                    new window.AudioContext() :
	                    new window.webkitAudioContext()

	require([ 'game' ], function(game) {
		game.init();
	});
});