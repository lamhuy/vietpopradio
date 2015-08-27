/** XHConn - Simple XMLHTTP Interface - bfults@gmail.com - 2005-04-08        **
 ** Code licensed under Creative Commons Attribution-ShareAlike License      **
 ** http://creativecommons.org/licenses/by-sa/2.0/                           **/
function XHConn()
{
  var xmlhttp, bComplete = false;
  xmlhttp = XHRFactory.getInstance();
  if (!xmlhttp) return null;
  this.connect = function(sURL, sMethod, sVars, fnDone)
  {
    if (!xmlhttp) return false;
    bComplete = false;
    sMethod = sMethod.toUpperCase();

    try {
      if (sMethod == "GET")
      {
        xmlhttp.open(sMethod, sURL+"?"+sVars, true);
        sVars = "";
      }
      else
      {
        xmlhttp.open(sMethod, sURL, true);
        xmlhttp.setRequestHeader("Method", "POST "+sURL+" HTTP/1.1");
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      }
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && !bComplete)
        {
          bComplete = true;
          if(fnDone != null) fnDone(xmlhttp);
          XHRFactory.release(xmlhttp);
        }};
      xmlhttp.send(sVars);
    }
    catch(z) { return false; }
    return true;
  };
  return this;
}


/** XHRFactory                                                                      **
 ** This class from: http://blogs.pathf.com/agileajax/2006/08/object_pooling_.html  **/
var XHRFactory = (function(){
 // static private member
 var stack = new Array();
 var poolSize = 10;
 
 var nullFunction = function() {}; // for nuking the onreadystatechange
 
 // private static methods
 
 function createXHR() {
  if (window.XMLHttpRequest) {
       return new XMLHttpRequest();
     } else if (window.ActiveXObject) {
       return new ActiveXObject('Microsoft.XMLHTTP')
     }
    }

 // cache a few for use
 for (var i = 0; i < poolSize; i++) {
  stack.push(createXHR());
 }
 
 // shared instance methods
 return ({
  release:function(xhr){
   xhr.onreadystatechange = nullFunction;
   stack.push(xhr);
  },
  getInstance:function(){
   if (stack.length < 1) {
    return createXHR();
   } else {
    return stack.pop();
   }
  },
  toString:function(){
   return "stack size = " + stack.length;
  }
 });
})();