/*!
 *  Howler.js Audio Player Demo
 *  howlerjs.com
 *
 *  (c) 2013-2017, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

// Cache references to DOM elements.
var elms = ['track', 'timer', 'duration', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'volumeBtn', 'progress', 'bar', 'wave', 'loading', 'playlist', 'list', 'volume', 'barEmpty', 'barFull', 'sliderBtn'];
elms.forEach(function(elm) {
  window[elm] = document.getElementById(elm);
});

/**
 * Player class containing the state of our playlist and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
 */
var Player = function(playlist) {
  this.playlist = playlist;
  this.numberOfFile = playlist.length;
  this.index = Math.floor((Math.random() * this.numberOfFile) );

  // Display the title of the first track.
  track.innerHTML = playlist[this.index].title;

  // Setup the playlist display.
  playlist.forEach(function(song) {
    var div = document.createElement('div');
    div.className = 'list-song';
    div.innerHTML = song.title;
    div.onclick = function() {
      player.skipTo(playlist.indexOf(song));
    };
    list.appendChild(div);
  });
};
Player.prototype = {
  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  play: function(index) {
    var self = this;
    var sound;

    index = typeof index === 'number' ? index : self.index;
    var data = self.playlist[index];

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: ['../Music/' + data.file ],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onplay: function() {
          // Display the duration.
          duration.innerHTML = self.formatTime(Math.round(sound.duration()));

          // Start upating the progress of the track.
          requestAnimationFrame(self.step.bind(self));

          // Start the wave animation if we have already loaded
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          pauseBtn.style.display = 'block';
        },
        onload: function() {
          // Start the wave animation.
          wave.container.style.display = 'block';
          bar.style.display = 'none';
          loading.style.display = 'none';
        },
        onend: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
          self.skip('right');
        },
        onpause: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        },
        onstop: function() {
          // Stop the wave animation.
          wave.container.style.display = 'none';
          bar.style.display = 'block';
        }
      });
    }

    // Begin playing the sound.
    sound.play();

    // Update the track display.
    track.innerHTML = data.title;
    //track.innerHTML = (index + 1) + '. ' + data.title;

    // Show the pause button.
    if (sound.state() === 'loaded') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
    } else {
      loading.style.display = 'block';
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'none';
    }

    // Keep track of the index we are currently playing.
    self.index = index;
  },

  /**
   * Pause the currently playing track.
   */
  pause: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Puase the sound.
    sound.pause();

    // Show the play button.
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
  },

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip: function(direction) {
    var self = this;

    // Get the next track based on the direction of the track.
    var index = 0;
    if (direction === 'prev') {
      index = Math.floor((Math.random() * self.numberOfFile) );
      /*index = self.index - 1;
      if (index < 0) {
        index = self.playlist.length - 1;
      }*/
    } else {
    index = Math.floor((Math.random() * self.numberOfFile));
      /*index = self.index + 1;
      if (index >= self.playlist.length) {
        index = 0;
      }*/
    }

    self.skipTo(index);
  },

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo: function(index) {
    var self = this;

    // Stop the current track.
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop();
    }

    // Reset progress.
    progress.style.width = '0%';

    // Play the new track.
    self.play(index);
  },

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volume: function(val) {
    var self = this;

    // Update the global volume (affecting all Howls).
    Howler.volume(val);

    // Update the display on the slider.
    var barWidth = (val * 90) / 100;
    barFull.style.width = (barWidth * 100) + '%';
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  },

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek: function(per) {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    }
  },

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist: function() {
    var self = this;
    var display = (playlist.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      playlist.style.display = display;
    }, (display === 'block') ? 0 : 500);
    playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Toggle the volume display on/off.
   */
  toggleVolume: function() {
    var self = this;
    var display = (volume.style.display === 'block') ? 'none' : 'block';

    setTimeout(function() {
      volume.style.display = display;
    }, (display === 'block') ? 0 : 500);
    volume.className = (display === 'block') ? 'fadein' : 'fadeout';
  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
};

// Setup our new audio player class and pass it the playlist.
/*var player = new Player([
	{ 
		 title: 'Dai-Kho.mp3', 
		 file: 'Dai-Kho.mp3', 
		 howl: null 
	},
	{ 
		 title: 'Gian.mp3', 
		 file: 'folder 2/inside folder/Gian.mp3', 
		 howl: null 
	},
	{ 
		 title: 'Ngot-Ngao.mp3', 
		 file: 'folder 2/Ngot-Ngao.mp3', 
		 howl: null 
	},
	{ 
		 title: '5-00-PM.mp3', 
		 file: 'folder1/5-00-PM.mp3', 
		 howl: null 
	}
]);*/


var player = new Player([
{ 
	 title: '--- VietPopWelcomeVietnamese.mp3', 
	 file: '--- VietPopWelcomeVietnamese.mp3', 
	 howl: null 
},
{ 
	 title: '---- VietPopWelcomEnglish ---.mp3', 
	 file: '---- VietPopWelcomEnglish ---.mp3', 
	 howl: null 
},
{ 
	 title: '---- VietPopWelcomEnglish.mp3', 
	 file: '---- VietPopWelcomEnglish.mp3', 
	 howl: null 
},
{ 
	 title: '---- VietPopWelcomEnglish.wav', 
	 file: '---- VietPopWelcomEnglish.wav', 
	 howl: null 
},
{ 
	 title: '---- VietPopWelcomeVietnamese ---.mp3', 
	 file: '---- VietPopWelcomeVietnamese ---.mp3', 
	 howl: null 
},
{ 
	 title: '---- VietPopWelcomeVietnamese.mp3', 
	 file: '---- VietPopWelcomeVietnamese.mp3', 
	 howl: null 
},
{ 
	 title: 'Da Mat Em Roi - Andy Quach.mp3', 
	 file: 'Andy Quach/Da Mat Em Roi - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'Giac mo mot cuoc tinh - Andy Quach.mp3', 
	 file: 'Andy Quach/Giac mo mot cuoc tinh - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'K.O. - Andy Quach.mp3', 
	 file: 'Andy Quach/K.O. - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'Khi anh ben em - Andy Quach.mp3', 
	 file: 'Andy Quach/Khi anh ben em - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'Trai Tim Biet Yeu - Andy Quach.mp3', 
	 file: 'Andy Quach/Trai Tim Biet Yeu - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'Van yeu am tham (Huynh Nhat Tan) - Andy Quach.mp3', 
	 file: 'Andy Quach/Van yeu am tham (Huynh Nhat Tan) - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'Yeu trong chieu mua - Andy Quach.mp3', 
	 file: 'Andy Quach/Yeu trong chieu mua - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'Yeu trong chieu mua 2 - Andy Quach.mp3', 
	 file: 'Andy Quach/Yeu trong chieu mua 2 - Andy Quach.mp3', 
	 howl: null 
},
{ 
	 title: 'Bay-Giua-Ngan-Ha-Remix.mp3', 
	 file: 'April 2010/Bay-Giua-Ngan-Ha-Remix.mp3', 
	 howl: null 
},
{ 
	 title: 'Bay-Len.mp3', 
	 file: 'April 2010/Bay-Len.mp3', 
	 howl: null 
},
{ 
	 title: 'Cho-Nhau-Loi-Di-Rieng.mp3', 
	 file: 'April 2010/Cho-Nhau-Loi-Di-Rieng.mp3', 
	 howl: null 
},
{ 
	 title: 'Con-Mua-Chieu.mp3', 
	 file: 'April 2010/Con-Mua-Chieu.mp3', 
	 howl: null 
},
{ 
	 title: 'Doc-Buoc.mp3', 
	 file: 'April 2010/Doc-Buoc.mp3', 
	 howl: null 
},
{ 
	 title: 'Dong-Co-May.mp3', 
	 file: 'April 2010/Dong-Co-May.mp3', 
	 howl: null 
},
{ 
	 title: 'Hay-Yeu-Du-Mat-Nhau-Ngay-Sau.mp3', 
	 file: 'April 2010/Hay-Yeu-Du-Mat-Nhau-Ngay-Sau.mp3', 
	 howl: null 
},
{ 
	 title: 'Khat-Khao-Trong-Dem-Lanh.mp3', 
	 file: 'April 2010/Khat-Khao-Trong-Dem-Lanh.mp3', 
	 howl: null 
},
{ 
	 title: 'Lang-tham-mot-tinh-yeu.mp3', 
	 file: 'April 2010/Lang-tham-mot-tinh-yeu.mp3', 
	 howl: null 
},
{ 
	 title: 'Nu-Cuoi-Tu-Quynh.mp3', 
	 file: 'April 2010/Nu-Cuoi-Tu-Quynh.mp3', 
	 howl: null 
},
{ 
	 title: 'Sao-Bang.mp3', 
	 file: 'April 2010/Sao-Bang.mp3', 
	 howl: null 
},
{ 
	 title: 'Tinh-Dan-Do.mp3', 
	 file: 'April 2010/Tinh-Dan-Do.mp3', 
	 howl: null 
},
{ 
	 title: 'Baby-Love-Ben-Anh.mp3', 
	 file: 'Dec 2010/Baby-Love-Ben-Anh.mp3', 
	 howl: null 
},
{ 
	 title: 'Gap-Lai.mp3', 
	 file: 'Dec 2010/Gap-Lai.mp3', 
	 howl: null 
},
{ 
	 title: 'Hay-Yeu-Em-Lan-Nua.mp3', 
	 file: 'Dec 2010/Hay-Yeu-Em-Lan-Nua.mp3', 
	 howl: null 
},
{ 
	 title: 'Lam-Sao-Quen.mp3', 
	 file: 'Dec 2010/Lam-Sao-Quen.mp3', 
	 howl: null 
},
{ 
	 title: 'Loi-Lam-Ngu-Ngoc.mp3', 
	 file: 'Dec 2010/Loi-Lam-Ngu-Ngoc.mp3', 
	 howl: null 
},
{ 
	 title: 'Nhat-Ky.mp3', 
	 file: 'Dec 2010/Nhat-Ky.mp3', 
	 howl: null 
},
{ 
	 title: 'Tam-Biet.mp3', 
	 file: 'Dec 2010/Tam-Biet.mp3', 
	 howl: null 
},
{ 
	 title: 'Voi-Buoc.mp3', 
	 file: 'Dec 2010/Voi-Buoc.mp3', 
	 howl: null 
},
{ 
	 title: 'Yeu-Di.mp3', 
	 file: 'Dec 2010/Yeu-Di.mp3', 
	 howl: null 
},
{ 
	 title: 'Yeu-Lang.mp3', 
	 file: 'Dec 2010/Yeu-Lang.mp3', 
	 howl: null 
},
{ 
	 title: 'Bang Gia - Khoi My.mp3', 
	 file: 'Fall 2011/Bang Gia - Khoi My.mp3', 
	 howl: null 
},
{ 
	 title: 'Cham Vao Hoi Tho - Thuy Tien ft. V.Music.mp3', 
	 file: 'Fall 2011/Cham Vao Hoi Tho - Thuy Tien ft. V.Music.mp3', 
	 howl: null 
},
{ 
	 title: 'Dinh Menh Nao Cho Em - Tu Vi.mp3', 
	 file: 'Fall 2011/Dinh Menh Nao Cho Em - Tu Vi.mp3', 
	 howl: null 
},
{ 
	 title: 'Giang Sinh Ngot Ngao - Khong Tu Quynh ft. Ngo Kien Huy.mp3', 
	 file: 'Fall 2011/Giang Sinh Ngot Ngao - Khong Tu Quynh ft. Ngo Kien Huy.mp3', 
	 howl: null 
},
{ 
	 title: 'Go Around - Tra My Idol.mp3', 
	 file: 'Fall 2011/Go Around - Tra My Idol.mp3', 
	 howl: null 
},
{ 
	 title: 'Khong Nhu Loi Anh Noi - Bao Thy.mp3', 
	 file: 'Fall 2011/Khong Nhu Loi Anh Noi - Bao Thy.mp3', 
	 howl: null 
},
{ 
	 title: 'Lang Tham - Noo Phuoc Thinh.mp3', 
	 file: 'Fall 2011/Lang Tham - Noo Phuoc Thinh.mp3', 
	 howl: null 
},
{ 
	 title: 'Oh My Love - 365DaBand.mp3', 
	 file: 'Fall 2011/Oh My Love - 365DaBand.mp3', 
	 howl: null 
},
{ 
	 title: 'Papa - Hong Nhung.mp3', 
	 file: 'Fall 2011/Papa - Hong Nhung.mp3', 
	 howl: null 
},
{ 
	 title: 'Pho Dong (Rock) - Tinna Tinh ft. Don Nguyen.mp3', 
	 file: 'Fall 2011/Pho Dong (Rock) - Tinna Tinh ft. Don Nguyen.mp3', 
	 howl: null 
},
{ 
	 title: 'Quen Di Mot Hinh Dung - Ho Quang Hieu.mp3', 
	 file: 'Fall 2011/Quen Di Mot Hinh Dung - Ho Quang Hieu.mp3', 
	 howl: null 
},
{ 
	 title: 'Song Tron Cho Nhau - Thanh Bui.mp3', 
	 file: 'Fall 2011/Song Tron Cho Nhau - Thanh Bui.mp3', 
	 howl: null 
},
{ 
	 title: 'Tua Vao Vai Anh - Khanh Phuong.mp3', 
	 file: 'Fall 2011/Tua Vao Vai Anh - Khanh Phuong.mp3', 
	 howl: null 
},
{ 
	 title: 'Can Phong (Phuc Bo Remix) - Duong Trieu Vu.mp3', 
	 file: 'Spring 2012/Can Phong (Phuc Bo Remix) - Duong Trieu Vu.mp3', 
	 howl: null 
},
{ 
	 title: 'Con Tim Tan Vo - Ha Anh Tuan ft. Phuong Linh.mp3', 
	 file: 'Spring 2012/Con Tim Tan Vo - Ha Anh Tuan ft. Phuong Linh.mp3', 
	 howl: null 
},
{ 
	 title: 'Dung Ngoanh Lai - Luu Huong Giang ft. Suboi ft. Cuong Seven.mp3', 
	 file: 'Spring 2012/Dung Ngoanh Lai - Luu Huong Giang ft. Suboi ft. Cuong Seven.mp3', 
	 howl: null 
},
{ 
	 title: 'Giac Mo Dieu Ky - Thuy Tien.mp3', 
	 file: 'Spring 2012/Giac Mo Dieu Ky - Thuy Tien.mp3', 
	 howl: null 
},
{ 
	 title: 'Hay Ra Di Neu Em Muon - Khanh Phuong.mp3', 
	 file: 'Spring 2012/Hay Ra Di Neu Em Muon - Khanh Phuong.mp3', 
	 howl: null 
},
{ 
	 title: 'Luoi Tinh - Vinh Thuyen Kim.mp3', 
	 file: 'Spring 2012/Luoi Tinh - Vinh Thuyen Kim.mp3', 
	 howl: null 
},
{ 
	 title: 'Mai Mai Ve Sau - Ho Ngoc Ha.mp3', 
	 file: 'Spring 2012/Mai Mai Ve Sau - Ho Ngoc Ha.mp3', 
	 howl: null 
},
{ 
	 title: 'Nho - Anh Khang.mp3', 
	 file: 'Spring 2012/Nho - Anh Khang.mp3', 
	 howl: null 
},
{ 
	 title: 'Tang Em - Hoang Hai.mp3', 
	 file: 'Spring 2012/Tang Em - Hoang Hai.mp3', 
	 howl: null 
},
{ 
	 title: 'Tim Lai Thoi Gian - Hoang Hai.mp3', 
	 file: 'Spring 2012/Tim Lai Thoi Gian - Hoang Hai.mp3', 
	 howl: null 
},
{ 
	 title: 'Tim Thay - Wanbi Tuan Anh.mp3', 
	 file: 'Spring 2012/Tim Thay - Wanbi Tuan Anh.mp3', 
	 howl: null 
}
 ]);

// Bind our player controls.
playBtn.addEventListener('click', function() {
  player.play();
});
pauseBtn.addEventListener('click', function() {
  player.pause();
});
prevBtn.addEventListener('click', function() {
  player.skip('prev');
});
nextBtn.addEventListener('click', function() {
  player.skip('next');
});
waveform.addEventListener('click', function(event) {
  player.seek(event.clientX / window.innerWidth);
});
/*playlistBtn.addEventListener('click', function() {
  player.togglePlaylist();
});*/
playlist.addEventListener('click', function() {
  player.togglePlaylist();
});
volumeBtn.addEventListener('click', function() {
  player.toggleVolume();
});
volume.addEventListener('click', function() {
  player.toggleVolume();
});

// Setup the event listeners to enable dragging of volume slider.
barEmpty.addEventListener('click', function(event) {
  var per = event.layerX / parseFloat(barEmpty.scrollWidth);
  player.volume(per);
});
sliderBtn.addEventListener('mousedown', function() {
  window.sliderDown = true;
});
sliderBtn.addEventListener('touchstart', function() {
  window.sliderDown = true;
});
volume.addEventListener('mouseup', function() {
  window.sliderDown = false;
});
volume.addEventListener('touchend', function() {
  window.sliderDown = false;
});

var move = function(event) {
  if (window.sliderDown) {
    var x = event.clientX || event.touches[0].clientX;
    var startX = window.innerWidth * 0.05;
    var layerX = x - startX;
    var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
    player.volume(per);
  }
};

volume.addEventListener('mousemove', move);
volume.addEventListener('touchmove', move);

// Setup the "waveform" animation.
var wave = new SiriWave({
    container: waveform,
    width: window.innerWidth,
    height: window.innerHeight * 0.3,
    cover: true,
    speed: 0.03,
    amplitude: 0.7,
    frequency: 2
});
wave.start();

// Update the height of the wave animation.
// These are basically some hacks to get SiriWave.js to do what we want.
var resize = function() {
  var height = window.innerHeight * 0.3;
  var width = window.innerWidth;
  wave.height = height;
  wave.height_2 = height / 2;
  wave.MAX = wave.height_2 - 4;
  wave.width = width;
  wave.width_2 = width / 2;
  wave.width_4 = width / 4;
  wave.canvas.height = height;
  wave.canvas.width = width;
  wave.container.style.margin = -(height / 2) + 'px auto';

  // Update the position of the slider.
  var sound = player.playlist[player.index].howl;  
  if (sound) {
    var vol = sound.volume();    
    var barWidth = (vol * 0.9);
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  }
};
window.addEventListener('resize', resize);
resize();
