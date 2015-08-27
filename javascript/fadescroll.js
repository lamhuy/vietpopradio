
/***********************************************
* Fading Scroller- � Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/

var delay = 4000; //set delay between message change (in miliseconds)
var maxsteps=20; // number of steps to take to change from start color to endcolor
var stepdelay=40; // time in miliseconds of a single step
//**Note: maxsteps*stepdelay will be total time in miliseconds of fading effect
var startcolor= new Array(255,255,255); // start color (red, green, blue)
var endcolor=new Array(80,74,75); // end color (red, green, blue)

var fcontent=new Array();
begintag='<div style=" text-align:center; font: normal 14px ; padding: 5px;">'; //set opening tag, such as font declarations
fcontent[0]="We are looking for committed music administrators to manage our hot list!";
fcontent[1]="Support us by Donating securely through Paypal.";
fcontent[2]="Vi&#7879;t Pop is available on Android phones (Froyo) through your browser.";
fcontent[3]="New 2015 songs added";
closetag='</div>';



var fwidth='250px'; //set scroller width
var fheight='45px'; //set scroller height

var fadelinks=1;  //should links inside scroller content also fade like text? 0 for no, 1 for yes.

///No need to edit below this line/////////////////


var ie4=document.all&&!document.getElementById;
var DOM2=document.getElementById;
var faderdelay=0;
var index=0;


/*Rafael Raposo edited function*/
//function to change content
function changecontent(){
  if (index>=fcontent.length)
    index=0
  if (DOM2){
    document.getElementById("fscroller").style.color="rgb("+startcolor[0]+", "+startcolor[1]+", "+startcolor[2]+")"
    document.getElementById("fscroller").innerHTML=begintag+fcontent[index]+closetag
    if (fadelinks)
      linkcolorchange(1);
    colorfade(1, 15);
  }
  else if (ie4)
    document.all.fscroller.innerHTML=begintag+fcontent[index]+closetag;
  index++
}

// colorfade() partially by Marcio Galli for Netscape Communications.  ////////////
// Modified by Dynamicdrive.com

function linkcolorchange(step){
  var obj=document.getElementById("fscroller").getElementsByTagName("A");
  if (obj.length>0){
    for (i=0;i<obj.length;i++)
      obj[i].style.color=getstepcolor(step);
  }
}

/*Rafael Raposo edited function*/
var fadecounter;
function colorfade(step) {
  if(step<=maxsteps) {	
    document.getElementById("fscroller").style.color=getstepcolor(step);
    if (fadelinks)
      linkcolorchange(step);
    step++;
    fadecounter=setTimeout("colorfade("+step+")",stepdelay);
  }else{
    clearTimeout(fadecounter);
    document.getElementById("fscroller").style.color="rgb("+endcolor[0]+", "+endcolor[1]+", "+endcolor[2]+")";
    setTimeout("changecontent()", delay);
	
  }   
}

/*Rafael Raposo's new function*/
function getstepcolor(step) {
  var diff
  var newcolor=new Array(3);
  for(var i=0;i<3;i++) {
    diff = (startcolor[i]-endcolor[i]);
    if(diff > 0) {
      newcolor[i] = startcolor[i]-(Math.round((diff/maxsteps))*step);
    } else {
      newcolor[i] = startcolor[i]+(Math.round((Math.abs(diff)/maxsteps))*step);
    }
  }
  return ("rgb(" + newcolor[0] + ", " + newcolor[1] + ", " + newcolor[2] + ")");
}

if (ie4||DOM2)
  document.write('<div id="fscroller" style="border:1px solid #548B54;width:'+fwidth+';height:'+fheight+'"></div>');

if (window.addEventListener)
window.addEventListener("load", changecontent, false)
else if (window.attachEvent)
window.attachEvent("onload", changecontent)
else if (document.getElementById)
window.onload=changecontent

