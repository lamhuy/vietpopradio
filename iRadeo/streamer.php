<?php
// (c) iRadeo.com

session_start();

require('config.php');

include('classes/getid3/getid3.php');
include('classes/json.php');

class Streamer {
   function Streamer($action) {
      $this->json = new JSON_obj;
      $this->id3  = new getID3;
	  
      global $mp3_dir, $updated;
	  
	
	  
      if(!isset($_SESSION['updated'])|| $_SESSION['updated'] != $updated) {
		$this->dir_parse = new DirectoryParser($mp3_dir);
         $_SESSION = array('current_song_id' => 0,
                           'current_song_filename' => '',
                           'current_artist' => '',
                           'current_album' => '',
                           'skipped' => 0,
						   'dir_parse' => $this->dir_parse,
						   'updated' => $updated);
      }
	  else{
		$this->dir_parse = $_SESSION['dir_parse'];
	  }	  
	  
	  
      switch($action) {
         case 'next_song':
            print $this->nextSong();
         break;
         
         case 'reset_skip':
            print $this->resetSkip();
         break;
      }
	  
	  
   }
   
   function nextSong() {
      global $mp3_dir, $http_path, $skip_limit;
      
      $error = '';
      
      if($_POST['skip'] && $skip_limit > -1) {
         if($_SESSION['skipped'] >= $skip_limit)
            $error = 'skip_limit_exceeded';
         else
            $_SESSION['skipped']++;
      }
      

	   if($_SESSION['current_song_id'] >= count($this->dir_parse->files))
		  {
			//getting a new shuffle list			
			$this->dir_parse = new DirectoryParser($mp3_dir);					
			$_SESSION['current_song_id'] = 0;
			$_SESSION['dir_parse'] = $this->dir_parse;
			$song = $this->dir_parse->files[$_SESSION['current_song_id']];			
		  }		  
		  else{
		    $song = $this->dir_parse->files[$_SESSION['current_song_id']];
		  }
	  
	    $_SESSION['current_song_id']++;
	  
	  $song_id3 = $this->id3->analyze($song);
	  getid3_lib::CopyTagsToComments($song_id3);
		 
	  $artist = $song_id3['comments_html']['artist'][0];
  	  $album  = $song_id3['comments_html']['album'][0];
      
      
      $song_name = $song_id3['comments_html']['title'][0];
      
      // - store current song filename into _SESSION under 'current_song_filename'
      $_SESSION['current_song_filename'] = $song;
      
      // - store song name into _SESSION under 'current_song'
      $_SESSION['current_song'] = $song_name;
      
      // - add album to _SESSION under 'current_album'
      $_SESSION['current_album'] = $album;
      
      // - add artist to _SESSION under 'current_artist'
      $_SESSION['current_artist'] = $artist;
      
      // return info, as JSON string
      $info = array('error'  => $error,
                    'title'  => $song_name,
                    'artist' => $artist,
                    'album'  => $album,
                    'filepath' => htmlentities($http_path . str_replace('\\', '/', str_replace($mp3_dir, '', $song))),
                    'duration' => $song_id3['playtime_string']);
      return $this->json->encode($info);
   }
   
   function resetSkip() {
      // This isn't the best way to do this, as a user could manually call the reset function
      // to reset the skip count, but the average user won't bother, so it is effective enough.
      
      $_SESSION['skipped'] = 0;
      
      return $this->json->encode(array('reset' => true));
   }
}

class DirectoryParser {
   var $files;
   
   function DirectoryParser($dir) {
      $this->files = array();
      
      $this->parseDir($dir);
      shuffle ($this->files);
	  //sort ($this->files);
   }
   
   function parseDir($dir) {
      global $playable;
      
      $h = opendir($dir);
      while(($file = readdir($h)) !== false) {
         if($file == '.' || $file == '..') continue;
         
         if(is_dir($dir . $file))
            $this->parseDir($dir . $file . (strpos($dir, '\\') !== false ? '\\' : '/'));
         else if(in_array(substr($file, strrpos($file, ".") + 1), $playable)) // see if the file is of a playable filetype
            $this->files[] = $dir . $file;
      }
      closedir($h);
   }
}

$s = new Streamer($_POST['action']);
?>