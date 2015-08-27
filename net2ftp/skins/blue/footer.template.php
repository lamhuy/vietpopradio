<?php defined("NET2FTP") or die("Direct access to this location is not allowed."); ?>
<!-- Template /skins/blue/footer.php begin -->
	<div id="foot">
		<a href="<?php echo $net2ftp_globals["application_rootdir_url"]; ?>/help.html" class="text_white"><?php echo __("Help Guide"); ?></a> | 
		<a href="javascript:go_to_forums();" class="text_white"><?php echo __("Forums"); ?></a>| 
		<a href="<?php echo $net2ftp_globals["application_rootdir_url"]; ?>/LICENSE.txt" class="text_white"><?php echo __("License"); ?></a>
	</div>
	<div id="poweredby">
		<?php echo __("Powered by"); ?> net2ftp - a web based FTP client<br />
		
	</div>
</div>
<script type="text/javascript">
	function go_to_forums() {
		alert('<?php echo __("You are now taken to the net2ftp forums. These forums are for net2ftp related topics only - not for generic webhosting questions."); ?>');
		document.location = "http://www.net2ftp.org/forums";
	} // end function forums
</script>
<!-- Template /skins/blue/footer.php end -->
