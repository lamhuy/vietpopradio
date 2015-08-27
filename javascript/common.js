/***********************************************
* Dynamic Ajax Content- ? Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/
 
var bustcachevar=1 //bust potential caching of external pages after initial request? (1=yes, 0=no)
var loadedobjects=""
var rootdomain="http://"+window.location.hostname
var bustcacheparameter=""
var suggestModal;


//Ads pages and their respective containers 
var adsHash = new Array();
adsHash['left_ad.html'] = "left_ads";
adsHash['right_ad.html'] = "right_ads";
adsHash['bottom_ad.html'] = "bottom_ads";


function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function checkBrowser()
{

	BrowserDetect.init();
        if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 7)
	{
		window.location="error.html";
	}

}
function init()
{

	makeActive('home');
	//loadAds('/javascript/showLeftAd.js','left_ads');
	ajaxpage('home.html','main_content');
	suggestModal = new suggestPopUp();
	setFooter();

}


function GetXmlHttpObject()
{
	if (window.XMLHttpRequest)
  	{
  		// code for IE7+, Firefox, Chrome, Opera, Safari
  		return new XMLHttpRequest();
  	}
	if (window.ActiveXObject)
  	{
  		// code for IE6, IE5
  	return new ActiveXObject("Microsoft.XMLHTTP");
  	}
	return null;
}


function loadAds(url,containerid)
{
//javascript:loadAds('/javascript/showLeftAd.js','left_ads');
	var page_request = GetXmlHttpObject();

	page_request.onreadystatechange=function()
	{
		loadAdsPage(page_request, containerid)
		
	}
			
	page_request.open('GET',url, true)
	page_request.send(null)
	

}

function loadAdsPage(page_request, containerid)
{
    if (page_request.readyState == 4 && (page_request.status==200 || window.location.href.indexOf("http")==-1))
    {
	document.getElementById(containerid).innerHTML=page_request.responseText;
	alert(page_request.responseText);
	 loadobjs_inDiv(containerid, 'http://pagead2.googlesyndication.com/pagead/show_ads.js');
		
    }
   
}

function ajaxpage(url, containerid)
{
 
	var page_request = GetXmlHttpObject();

	page_request.onreadystatechange=function()
	{
		loadpage(page_request, containerid, url)
		
		
	}
	
	if (bustcachevar) //if bust caching of external page
		bustcacheparameter=(url.indexOf("?")!=-1)? "&"+new Date().getTime() : "?"+new Date().getTime()
		
	page_request.open('GET', url+bustcacheparameter, true)
	page_request.send(null)
}
 
function loadpage(page_request, containerid, url)
{

	if (page_request.readyState == 4 && (page_request.status==200 || window.location.href.indexOf("http")==-1))
	{
		document.getElementById(containerid).innerHTML=page_request.responseText;
		setFooter();
	//	alert(page_request.responseText);
		
	}
	
	//loading commented related code, don't need if SDK is tehre
	if(url.indexOf("home.html") != -1)
	{
		
		loadobjs(document.location.protocol + '//connect.facebook.net/en_US/all.js#appId=6842db91cc80713aa186f0bc64e9d06a&amp;xfbml=1');
		//loadobjs('fb-root');	
	}
		
}
 

function loadobjs(){ //load javascript reference
	if (!document.getElementById)
	return
	for (i=0; i<arguments.length; i++){
		var file=arguments[i]
		var fileref=""
		if (loadedobjects.indexOf(file)==-1){ //Check to see if this object has not already been added to page before proceeding
			if (file.indexOf(".js")!=-1){ //If object is a js file
			fileref=document.createElement('script')
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", file);
			}
			else if (file.indexOf(".css")!=-1){ //If object is a css file
			fileref=document.createElement("link")
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", file);
			}		
		}
		if (fileref!=""){
			
			document.getElementsByTagName("head").item(0).appendChild(fileref)
			//loadedobjects+=file+" " //Remember this object as being already added to page
		}
	}
}

function loadobjs_inDiv(divName,file)
{ //load javascript reference
	var fileref="";
	alert("hello");
	if (file.indexOf(".js")!=-1){ //If object is a js file
		fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", file);
	}
	else if (file.indexOf(".css")!=-1){ //If object is a css file
	    fileref=document.createElement("link")
	    fileref.setAttribute("rel", "stylesheet");
	    fileref.setAttribute("type", "text/css");
	    fileref.setAttribute("href", file);
	}
	
	if (fileref!=""){
		
		document.getElementById(divName).appendChild(fileref);
		
	}	
}
 

var menuItems = ["home","shopping","fans","advertise","support","about","admin"];

function makeActive(id)
{

	for (i = 0; i < menuItems.length; i++)
	{
		
		if (menuItems[i] != id)
		{

			//var e = document.getElementById(menuItems[i]);
			//alert(e);
		//	alert(menuItems[i]);
			if (navigator.appName == 'Microsoft Internet Explorer')
			{
				document.getElementById(menuItems[i]).className="inactive";
			}
			else
			{

				document.getElementById(menuItems[i]).setAttribute("class","inactive");
			}
			
		}
		else
		{
			if (navigator.appName == 'Microsoft Internet Explorer')
			{
				document.getElementById(menuItems[i]).className="active";
			}
			else
			{
				document.getElementById(menuItems[i]).setAttribute("class","active");
			}
			
		}
	}

}

var Browser = { 
       	Version: function() {   
       		var version = 999; // we assume a sane browser    
		if (navigator.appVersion.indexOf("MSIE") != -1)      // bah, IE again, lets downgrade version number 
	       		version = parseFloat(navigator.appVersion.split("MSIE")[1]); 
	
		return version; 
	}
}





function setFooter()
{
	
	if (BrowserDetect.browser == "Explorer" && Browser.Version() <= 7)
	{
	
		//var contentH = document.getElementById("content").clientHeight;
		//var headerH = document.getElementById("header").clientHeight;

		document.getElementById("footer").style.marginLeft = "-" +  document.getElementById("content").clientWidth / 3 + "px";
		document.getElementById("footer").innerHTML = "<font style='float:left;'>Việt Pop Radio - Mordern Việt Pop Internet Radio | Copyright &copy; 2010 Lam&prime;s Brothers Inc. All Rights Reserved.</style>";

	}
	else
	{	
		
		var contentH = document.body.clientHeight;
		var pos = contentH + 250;
		document.getElementById("footer").setAttribute('style','top:' + pos + 'px;');
	
	}
	
}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};


