<!--

 var viewportwidth;
 var viewportheight;
 
 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 
 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }
 
// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }
 
 // older versions of IE
 
 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }

function setModal()

{
	alert(viewportwidth + ", " + viewportheight);
	var stylesheet = document.styleSheets[0];
	for (var i = 0; i < stylesheet.rules.length; i++) {
		var rule = stylesheet.rules[i];
		if (rule.selectorText == ".blocker_div") {
			rule.style.height = viewportheight;
		}
	}

}

if (window.attachEvent)
{
	window.attachEvent("onresize",setModal);
}
else
{

	window.addEventListener("resize",setModal,false); 
}
//-->

function ModalPopup() {
	var blocker_div = document.createElement("div");
	blocker_div.className = "blocker_div";

	var contents_div = document.createElement("div");
	contents_div.className = "contents_div";

	var container_div = document.createElement("div");
	container_div.className = "container_div";

	var buttons_table = document.createElement("table");
	buttons_table.className = "buttons_table";
	buttons_table.insertRow(0);
	this.show = function () {
		blocker_div.style.display = "block";
		container_div.style.display = "block";
		placeContents();
	};

	this.hide = function () {
		blocker_div.style.display = "none";
		container_div.style.display = "none";
	};

	this.addContents = function (new_contents) {
		contents_div.appendChild(new_contents);
	};

	this.addButton = function (new_button) {
		buttons_table.rows[0].insertCell(buttons_table.rows[0].cells.length).appendChild(new_button);
	};

	container_div.appendChild(contents_div);
	container_div.appendChild(buttons_table);
	function placeContents () {
		document.body.appendChild(container_div);
		var left = (blocker_div.clientWidth - container_div.clientWidth) / 2;
		var top = (blocker_div.clientHeight - container_div.clientHeight) / 2;
		container_div.style.left = left;
		container_div.style.top = top;
	}
	document.body.appendChild(container_div);
	document.body.appendChild(blocker_div);
	this.hide();
};
