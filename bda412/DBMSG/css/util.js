var isUserInput = false;

function setActiveStyleSheet(title) {
	var i, a, main;
	for (i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
		}
		if (a.getAttribute("title") == title) {
			a.disabled = false;
		}
	}
}


function ClearDefault(Element) {
	if (Element.defaultValue == Element.value) {
		Element.value = ""
		Element.style.cssText = "font-weight: bold; color: #00000"
	}
}


function isNotNull(value) {
	if (value == null || trim(value).length == 0  || value == "search site" || value =="Search OPN" || isUserInput == false ) {
		alert('You did not enter a search term.  Please try again.');
		document.searchForm.keyword.value='';
		isUserInput = true;
		document.searchForm.keyword.focus();
		return false;
	}
	else if (isSplCharsExist(value)) {
		if (trim(splCharsInKeyword).length > 1 ) {
			splCharsInKeyword = 'Special characters ' + splCharsInKeyword + ' are ';
		}
		else {
			splCharsInKeyword = 'Special character ' + splCharsInKeyword + ' is ';
		}
		   
		alert ( splCharsInKeyword +"not allowed.\n");
		document.searchForm.keyword.focus();
		return false;
	}
	else {
		return true;
	}
}


function getStyle(element, styleProp) {
	if (element.currentStyle) {
		var style = element.currentStyle[styleProp];
	}
	else if (window.getComputedStyle) {
		var style = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
	}

	return style;
}

	
function positionedOffsetLeft(element) {
	var valueT = 0, valueL = 0;
	do {
		valueL += element.offsetLeft || 0;
		element = element.offsetParent;
		if (element) {
			if (element.tagName.toUpperCase() == 'BODY')
				break;
			var p = getStyle(element, 'position');
			if (p !== 'static')
				break;
		}
	} while (element);

   return valueL;
}

  
function positionedOffsetTop(element) {
	var valueT = 0, valueL = 0;
	do {
		valueT += element.offsetTop  || 0;
		element = element.offsetParent;
		if (element) {
			if (element.tagName.toUpperCase() == 'BODY')
				break;
			var p = getStyle(element, 'position');
			if (p !== 'static')
				break;
		}
	} while (element);
	
	return valueT;
}


function mvqMOv(panelID,imgID) {
	var el = document.getElementById(imgID);
	if ( typeof el != 'undefined' && el != null ) {
		var x = positionedOffsetLeft(el);
		var y = positionedOffsetTop(el);
		var imgWidth = el.width ;
		
		if(panelID=="panelDiv_search")
		{
			document.getElementById(panelID).style.left = x-5 +"px";
			document.getElementById(panelID).style.top = y - (navigator.appName!="Netscape" ? 0:7) +"px";	
		}
	}

	if (navigator.appName != "Netscape") {
		var dropdown = document.getElementById("scope");
	}
	
	var mvqPDiv = document.getElementById(panelID); 
	mvqPDiv.style.visibility = "visible";
}

function mvqMOu(panelID) {
	var mvqPDiv = document.getElementById(panelID); 
	mvqPDiv.style.visibility = "hidden";

	if (navigator.appName != "Netscape") {
		var dropdown = document.getElementById("scope");
	}
}


