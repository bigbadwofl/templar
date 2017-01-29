define([
	'templar/client',
	'templar/events'
], function(
	client,
	events
) {
	var audio = {
		ctx: null,
		clips: {},
		loading: [],
		playing: [],
		isMuted: false,
		init: function() {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.ctx = new AudioContext();

			this.getAudioNames();
		},
		getAudioNames: function() {
			client.request({
				module: 'files',
				method: 'getAudio',
				callback: this.onGetAudioNames.bind(this)
			});
		},
		onGetAudioNames: function(names) {
			var scope = this;

			var paths = [];

			names.map(function(n) {
				var name = n
					.split('/');
				name = name[name.length - 1]
					.split('.')[0];

				paths.push(name);

				this.loading.push(name);

				return ('audio!' + n);
			}, this);

			for (var i = 0; i < names.length; i++) {
				names[i] = 'audio!' + names[i];
			}

			require(names, this.onGetAudio.bind(this, paths));
		},
		onGetAudio: function(names) {
			this.loading = [];
			
			for (var i = 1; i < arguments.length; i++) {
				this.clips[names[i - 1]] = arguments[i];
			}
			
			if (this.loading.length == 0)
				events.fire('moduleReady', 'audio');
		},
		play: function(name, solo, loop, volume) {
			if (this.isMuted)
				return;
			
			if (solo) {
				if (this.isPlaying(name))
					return;
			}

			var sound = this.ctx.createBufferSource();
			sound.buffer = this.clips[name];

			var gainNode = this.ctx.createGain();
			sound.connect(gainNode);
			gainNode.connect(this.ctx.destination);
			gainNode.gain.value = volume || 1;

			var playing = {
				buffer: sound,
				name: name,
				solo: solo,
				loop: loop,
				volume: volume || 1,
				gain: gainNode
			};

			this.playing.push(playing);

			sound.onended = this.onEnded.bind(this, playing);

			sound.start(0);
		},
		mute: function(muted) {
			if (muted == null)
				this.isMuted = !this.isMuted;
			else
				this.isMuted = muted;

			this.playing.forEach(function(p) {
				var vol = p.volume;
				if (this.isMuted)
					vol = 0;
				p.gain.gain.value = vol;
			}, this);
		},
		isPlaying: function(name) {
			var find = this.playing.filter(function(p) {
				return (p.name == name);
			});

			return (find.length > 0);
		},
		onEnded: function(playing) {
			for (var i = 0; i < this.playing.length; i++) {
				var p = this.playing[i];

				if (p == playing) {
					this.playing.splice(i, 1);

					if (playing.loop) {
						this.play(playing.name, playing.solo, true);
					}

					return;
				}
			}
		}
	};

	audio.init();

	return audio;
});