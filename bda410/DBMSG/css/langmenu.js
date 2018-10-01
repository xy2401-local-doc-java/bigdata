var langList = null;
var baseURL = null;

function setBaseURL(url) {
	baseURL = location.protocol + '//' + url;
}

function sendRequest(url, callback, postData) {
	var req = createXMLHTTPObject();
	if (!req) return;
	var method = (postData) ? "POST" : "GET";
	req.open(method,url,true);
	req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
	if (postData)
		req.setRequestHeader('Content-type',
		'application/x-www-form-urlencoded');
	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) {
			return;
		}
		callback(req);
	}
	if (req.readyState == 4) return;
	req.send(postData);
}

var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i=0;i<XMLHttpFactories.length;i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

function langListCallback(req) {
	langList = eval(req.responseText);

	if(langList == null) {
		return;
	}

	$('#lmenu').removeAttr('disabled');
	lmenuObj = document.getElementById("lmenu");
	var html = null;
	var head = null;
	var lest = null;
	for (var i = 0; i < langList.length; i++) {
		var bookPN = null;
		for (var j = 0; j < l10nmap.length; j++) {
			if (l10nmap[j].language == langList[i].language) {
				bookPN = l10nmap[j].partnumber;
				break;
			}
		}
		if (bookPN == null) {
			// skip not translated language
			continue;
		}
		if (langList[i].language == $("meta[name='langname']").attr("content")) {
			head = "<option class=\"lang_entry\" value=\"" +
				langList[i].library + ":" + bookPN + "\">" + langList[i].language + "</option>";
		} else {
			lest += "<option class=\"lang_entry\" value=\"" +
			langList[i].library + ":" + bookPN + "\">" + langList[i].language + "</option>";
		}
	}
	html += head + lest;
	lmenuObj.innerHTML = html;
}

function getLangList() {
	sendRequest(location.protocol + '//' + libL10NInfoURL, langListCallback, null);
}

function gotoLangPage() {
    if(!language_menu_enabled)
        return;
    if(language_menu_kind == 'otn') {
	    var curLibrary = $("meta[name='librarynumber']").attr("content");
	    if (curLibrary != null) {
		    var curPN = $("meta[name='partnumber']").attr("content");
		    var curSelect = $('#lmenu').val();
		    if (curSelect) {
			    var newVal = curSelect.split(":");
			    var newLib = newVal[0];
			    var newPN = newVal[1];
			    window.location.pathname = window.location.pathname.replace(curLibrary, newLib).replace(curPN, newPN);
		    }
	    }
    } else {
        // TODO this is hardcoded for -dirlayout langswitcher!
        var url = window.location.href.split('/');
        var file = url[url.length - 1];
        var shortname = url[url.length - 2];
        var lang = url[url.length - 4];
        var selected_lang = $("#lmenu").find(":selected").val();
        if(selected_lang != lang) {
            var new_location = "../../../" + selected_lang + "/html/" + shortname + "/";
            // TODO check if file exists otherwise strip file and redirect to index
            window.location = new_location + file;
        }
    }
}


var libL10NInfoURL = "docs.oracle.com/cd/E25796_01/";

// l10nm variable added here
var l10nmap = [
{"language" :  "English", "partnumber" : "E54838"},
{"language" :  "日本語", "partnumber" : "E62491"},
{"language" :  "Deutsch", "partnumber" : "E62488"},
{"language" :  "繁體中文", "partnumber" : "E62494"},
{"language" :  "Español", "partnumber" : "E62487"},
{"language" :  "Français", "partnumber" : "E62486"},
{"language" :  "简体中文", "partnumber" : "E62493"},
{"language" :  "Italiano", "partnumber" : "E62489"},
{"language" :  "Brazilian_Portuguese", "partnumber" : "E62490"},
{"language" :  "한국어", "partnumber" : "E62492"},
];
var l10nmap = [
{"language" :  "English", "partnumber" : "E88194"},
];
