// iRadeo.com

soundManager.debugMode = false;
soundManager.url = 'soundmanager2.swf';

function disabledButton(e) { e = new Event(e).stop(); }
function addZero(n) { return n.toString().length < 2 ? '0' + n.toString() : n; }
function disableSelection(element) {
    element.addEvent('selectstart', function(e) { e = new Event(e).stop(); });
    element.unselectable = "on";
}

window.onerror = function() { return true; }

window.onload = function() {
   Buttons.play('playpause', 0);
   $('playpause').addEvents({'mouseup': disabledButton, 'mousedown': disabledButton});

   Buttons.skip('skip', 0);
   $('skip').addEvents({'mouseup': disabledButton, 'mousedown': disabledButton});
   
   Buttons.audio('audio-icon');
   
   disableSelection($('controls'));
   
   Player.setVolume(50);
};

soundManager.onload = function() {
   Buttons.play('playpause', 1);
   $('playpause').removeEvent('mouseup', disabledButton).removeEvent('mousedown', disabledButton).addEvents({'mouseup': Player.playPause, 'mousedown': Player.playPauseDown});

   Buttons.skip('skip', 1);
   $('skip').removeEvent('mouseup', disabledButton).removeEvent('mousedown', disabledButton).addEvents({'mouseup': Player.skip, 'mousedown': Player.skipDown});
   
   soundManager.defaultOptions.onfinish = Player.songFinish;
   
   soundManager.defaultOptions.onbeforefinishcomplete = function() {
      Player.actuallyFinished = true;
      
      Player.resetSkip();
   }
   
   soundManager.defaultOptions.whileplaying = function() {
      var pos = Math.floor(this.position / 1000);
      
      var minutes = Math.floor(pos / 60);
      var seconds = addZero(pos % 60);
      
      $('current-position').setHTML(minutes + ':' + seconds);
   };
   
   soundManager.defaultOptions.whileloading = function() {
      if((this.bytesLoaded / this.bytesTotal) > 0.35)
         Player.nextSongReady = true;
      else
         Player.nextSongReady = false;
   };
   
   setInterval(function() { Player._monitor(); }, 10000);
   
   $('volume-control').addEvents({'mousedown': Player.volumeEnable,
                                  'mouseup': Player.volumeDisable,
                                  'click': Player.volumeSlide});
   
   $('audio-icon').addEvent('click', function() { if(Player.volume > 0) { Player.setVolume(0); } else { Player.setVolume(Player.prevVolume); } });
   
   if(Player.autoPlay == true) {
      Player.playPause();
   } else
      Player.manualPlayNotice();
};

var Player = {
   autoPlay: false,
   status: 0,
   actuallyFinished: false,
   currentSong: {},
   currentSongID: '',
   nextSong: {},
   nextSongID: '',
   nextSongReady: true,
   volume: 100,
   prevVolume: 0,
   waitingForLoad: false,
            
   play: function()  {
      if(Player.currentSongID.length == 0)
         return Player.preloadNext(true);
      
      soundManager.togglePause(Player.currentSongID);
   },
   
   songFinish: function() {
      if(Player.nextSongReady) {
         var oldSongID = Player.currentSongID;
   
         Player.currentSong   = Player.nextSong;
         Player.currentSongID = Player.nextSongID;
   
         soundManager.play(Player.currentSongID);
                  
         soundManager.setVolume(Player.currentSongID, Player.volume);            
         
         $('song').setHTML(Player.currentSong.title);
         $('artist').setHTML(Player.currentSong.artist);
         $('album').setHTML(Player.currentSong.album);
         
         $('duration').setHTML(Player.currentSong.duration);
         
         if(oldSongID) soundManager.destroySound(oldSongID);
         
         Player.preloadNext(false, !Player.actuallyFinished ? 'skip=true' : null);
                     
         Player.actuallyFinished = false;
         $('play-status').setHTML(Player.status == 1 ? 'Playing' : 'Paused');
         if(Player.status == 0) {
            soundManager.togglePause(Player.currentSongID);
            $('current-position').setHTML('0:00');
         }
      } else {
         $('play-status').setHTML('Connecting...');
         Player._isReadyTimer = setInterval(Player._isReady, 50);
      }
   },
   
   preloadNext: function(play, extopts) {
      var xhConn = new XHConn();
      
      xhConn.connect('streamer.php', 'POST', 'action=next_song' + (extopts ? '&' + extopts : ''), function(xh) {
         var song = Json.evaluate(xh.responseText);
         
         switch(song.error) {
            case 'skip_limit_exceeded':
               Buttons.skip('skip', 0);
               $('skip').removeEvent('mouseup', Player.skip).removeEvent('mousedown', Player.skipDown).addEvents({'mouseup': disabledButton, 'mousedown': Player.skipDisabled});
            break;
         }
         
         Player.nextSong = song;

         Player.nextSongID = (song.title + song.artist + song.album).replace(/[^A-Za-z]/g, '');
         soundManager.createSound(Player.nextSongID, song.filepath);
         
         if(play)
            soundManager.defaultOptions.onfinish();
      });
   },
   
   playPause: function(e) {
      if(Player.status == 0) {
         Buttons.pause('playpause', 1);
         Player.status = 1;
         $('play-status').setHTML('Playing');
         
         Player.play();
      } else {
         Buttons.play('playpause', 1);
         Player.status = 0;
         $('play-status').setHTML('Paused');

         Player.play();
      }
   },
   
   playPauseDown: function(e) {
      if(Player.status == 0)
         Buttons.play('playpause', 2);
      else
         Buttons.pause('playpause', 2);
   },
   
   skip: function(e) {
      Player.songFinish();
      
      Buttons.skip('skip', 1);
   },
   
   skipDown: function(e) {
      Buttons.skip('skip', 2);
   },
   
   resetSkip: function(onComplete) {
      var xhConn = new XHConn();
      
      xhConn.connect('streamer.php', 'POST', 'action=reset_skip', function(xh) {
         Buttons.skip('skip', 1);
         $('skip').removeEvent('mouseup', disabledButton).removeEvent('mousedown', Player.skipDisabled).addEvents({'mouseup': Player.skip, 'mousedown': Player.skipDown});
         
         if(typeof onComplete == 'function') onComplete();
      });
   },
   
   displayMessage: function(msg) {
      var loc = $('stream-info').getPosition();
      
      $('message').setHTML(msg).setStyles({display: 'block', opacity: 0});
      
      var streamInfoSize = $('stream-info').getSize();
      var messageSize = $('message').getSize();
      
      var pos = {x: (((streamInfoSize.size.x - messageSize.size.x) / 2) + loc.x) + 'px',
                 y: (((streamInfoSize.size.y - messageSize.size.y) / 2) + loc.y) + 'px'}
      
      $('message').setStyles({left: pos.x,
                                    top: pos.y});

      var fadeIn = new Fx.Style('message', 'opacity', {duration: 500});
      fadeIn.start(0, 1);
      
      setTimeout(function() {
         var fadeIn = new Fx.Style('message', 'opacity', {duration: 500, onComplete: function() { $('message').setStyle('display', 'none'); }});
         fadeIn.start(1, 0);
      }, 2500);
   },
   
   skipDisabled: function() {
      Player.displayMessage("We're sorry. You have already used allowed skips this listening hour. You will earn more skips as you listen.");
   },
   
   manualPlayNotice: function() {
      Player.displayMessage("Please select the Play button below to start streaming.");
   },
   
   volumeEnable: function(e) {
      $('volume-control').addEvent('mousemove', Player.volumeSlide);
   },
   
   volumeDisable: function(e) {
      $('volume-control').removeEvent('mousemove', Player.volumeSlide);
   },
   
   volumeSlide: function(e) {
      e = new Event(e);
      
      var audioIconWidth = $('audio-icon').getSize().size.x;
      var mouseX = e.client.x - this.getPosition().x - audioIconWidth;
      
      if(mouseX < -1) return;
      
      var percent = Math.ceil((mouseX / ($('volume-control').getSize().size.x - audioIconWidth)) * 10);
      
      Player.setVolume(percent * 10);
   },
   
   setVolume: function(vol) {
      Player.prevVolume = Player.volume;
      
      var percent = vol / 10;
      
      if(percent >= 0 && percent <= 10) {
         for(var i=1; i<=percent; i++)
            $('vol-' + i).addClass('volume-active');
         
         for(var j=percent+1; j<=10; j++)
            $('vol-' + j).removeClass('volume-active');
      }
      
      Player.volume = vol;
      if(Player.currentSongID) soundManager.setVolume(Player.currentSongID, Player.volume);            
   },
   
   _monitor: function() {
      if(Player.status == 1) {
         if(Player._lastPos == soundManager.getSoundById(Player.currentSongID).position) {
            Player.songFinish();
            Player._lastPos = -1;
         } else
            Player._lastPos = soundManager.getSoundById(Player.currentSongID).position;
      }
   },
   
   _isReady: function() {
      if($('play-status').innerHTML == 'Connecting...' && Player.nextSongReady) {
         Player.songFinish();
         clearInterval(Player._isReadyTimer)
      }
   }
}

var Buttons = {   
   play: function(id, status) {
      var ctx = $(id).getContext('2d');
      $(id).setProperties({width: 30, height: 30});

      var colors = this._colors(status);
      
      this._circle(ctx, colors.bg);

      ctx.beginPath();
      ctx.fillStyle = colors.fg;
      ctx.moveTo(12, 6);
      ctx.lineTo(22, 15);
      ctx.lineTo(12, 24);
      ctx.fill();
   },
   
   pause: function(id, status) {
      var ctx = $(id).getContext('2d');
      
      var colors = this._colors(status);
      
      this._circle(ctx, colors.bg);
      
      ctx.fillStyle = colors.fg;
      ctx.fillRect(9, 8, 5, 14);
      ctx.fillRect(16, 8, 5, 14);
   },
   
   skip: function(id, status) {
      var ctx = $(id).getContext('2d');

      var colors = this._colors(status);
      
      this._circle(ctx, colors.bg);

      ctx.fillStyle = colors.fg;

      ctx.beginPath();
      ctx.moveTo(8, 10);
      ctx.lineTo(14, 15);
      ctx.lineTo(8, 20);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(14, 10);
      ctx.lineTo(20, 15);
      ctx.lineTo(14, 20);
      ctx.fill();
      
      ctx.fillRect(20, 10, 2, 10);
   },
   
   audio: function(id) {
      var ctx = $(id).getContext('2d');

      ctx.fillStyle = this._colors(1).bg;
      
      ctx.fillRect(0, 6, 4, 8);

      ctx.beginPath();
      ctx.moveTo(-1, 10);
      ctx.lineTo(10, 0);
      ctx.lineTo(10, 20);
      ctx.fill();
   },
   
   _colors: function(status) {
      switch(status) {
         case 0:
            return {bg: $('button-disabled').getStyle('background-color'), fg: $('button-disabled').getStyle('color')};
         case 1:
            return {bg: $('button').getStyle('background-color'), fg: $('button').getStyle('color')};
         case 2:
            return {bg: $('button-down').getStyle('background-color'), fg: $('button-down').getStyle('color')};
      }
   },
   
   _circle: function(ctx, color) {
      ctx.clearRect(0, 0, 30, 30);
      
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(15, 15, 15, 0, Math.PI * 2, false);
      ctx.fill();
   }
}