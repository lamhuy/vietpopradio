// iRadeo.com

var scripts = document.getElementsByTagName('script');
var thisScript = scripts[scripts.length - 1];

var iFrameElement = document.createElement('iframe');
iFrameElement.src = thisScript.src.replace(/js\/loader.js/, '') + 'index.php';
iFrameElement.style.width = playerWidth + 'px';
iFrameElement.style.height = playerHeight + 'px';
iFrameElement.style.border = '0';
iFrameElement.id = 'mp3-streamer';
iFrameElement.setAttribute('frameBorder', '0');

thisScript.parentNode.insertBefore(iFrameElement, thisScript);