<!-- iRadeo.com -->
<?php require('config.php'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
   "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
<head>
   <meta http-equiv="Content-type" content="text/html; charset=utf-8">
   <title><?php print $title; ?></title>
   
   <script type="text/javascript" src="js/soundmanager2.js"></script>
   <script type="text/javascript" src="js/excanvas.js"></script>
   <script type="text/javascript" src="js/xhconn.js"></script>
   <script type="text/javascript" src="js/mootools.js"></script>
   <script type="text/javascript" src="js/player.js"></script>
   
   <!-- redirect to vietpop radio main if detect location is not top -->
   <!-- script type="text/javascript">
   if (top.location.href != "http://www.vietpopradio.com/")
   {
   		top.location.href = "http://www.vietpopradio.com/";
   }
   
   </script -->
   
<?php if($auto_play == true) { ?>
   <script type="text/javascript">
      Player.autoPlay = true;
   </script>
<?php } ?>

   <style type="text/css" media="screen">
      @import url(css/player.css);
   </style>
</head>

<body>
   <span class="subFont"> <a href="../Troubleshoot.html">can't hear?</a></span>
   <h2>now playing</h2>

   <div id="stream-info">
      <?php if(strlen($labels['song']) > 0) { ?><span class="label" id="song-label">&nbsp;Song:&nbsp;</span><span class="info" id="song">Connecting...</span><?php } ?>
      <?php if(strlen($labels['artist']) > 0) { ?><span class="label" id="artist-label">Artist:&nbsp;</span><span class="info" id="artist">Connecting...</span><?php } ?>
      <!-- ?php if(strlen($labels['album']) > 0) { ?><span class="label" id="album-label">Album:&nbsp;</span><span class="info" id="album">Connecting...</span --> <!-- ?php } ? -->
   </div>
   <div id="message"></div>
   <span class="subFont2">www.vietpopradio.com</span>
   <div id="controls">
      <div id="button"></div><div id="button-down"></div><div id="button-disabled"></div>
      <canvas id="playpause" title="Play/Pause" width="30" height="30"></canvas>
      <canvas id="skip" title="Skip" width="30" height="30"></canvas>
      <span id="volume-control">
         <canvas id="audio-icon" width="10" height="20"></canvas>
         <span class="volume-bar volume-active" id="vol-1"></span>
         <span class="volume-bar volume-active" id="vol-2"></span>
         <span class="volume-bar volume-active" id="vol-3"></span>
         <span class="volume-bar volume-active" id="vol-4"></span>
         <span class="volume-bar volume-active" id="vol-5"></span>
         <span class="volume-bar volume-active" id="vol-6"></span>
         <span class="volume-bar volume-active" id="vol-7"></span>
         <span class="volume-bar volume-active" id="vol-8"></span>
         <span class="volume-bar volume-active" id="vol-9"></span>
         <span class="volume-bar volume-active" id="vol-10"></span>
      </span>
      <div id="song-status"><span id="play-status">Stopped</span> <span id="current-position">0:00</span> / <span id="duration">0:00</span></div>
      
   </div>
      
</body>
</html>
