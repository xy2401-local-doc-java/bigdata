$(document).ready(function() {	
		
	/* make current toc item highlight and is expaned */
	$('ul.topicList li').removeClass("topic_selected");
	var curid = $("meta[name='pageid']").attr("content");
	var curTopic = $('ul.topicList li#item-' + curid);
	if (curTopic != null) {
		curTopic.addClass('topic_selected');
		if (curid.indexOf("idx-") == 0) {
			curTopic.parent().parent().show();
		}
		var parentA = curTopic.parent();
		while (true) {
			var prevA = parentA.parent("ul").prev("a");
			if (prevA.length < 1) {
				break;
			}
			var prevLI = prevA.find("li");
			prevLI.addClass("expanded");
			parentA = prevA;
		}
		var nextUL = curTopic.parent().next("ul");
		if (nextUL != null) {
			nextUL.show();
			if (!curTopic.hasClass("expanded")) {
				curTopic.addClass("expanded");
			}
		}
	}

	if (expandTOC) {
		var tocTop = $('li.toc_level1_withChild');
		tocTop.addClass("expanded");
		var nextUL = tocTop.parent().next("ul");
		if (nextUL != null) {
			nextUL.show();
		}
	}

	/* input textfield with placeholder */
	$('#SearchTerm').focus(function () {
		var input_txt = $('#SearchTerm').val();	
		if ( input_txt == "Search"){
			$('#SearchTerm').val('');
			$('#SearchTerm').removeClass('input_placeholder');			
		}
	});

	$('#SearchTerm').blur(function () {
		var input_txt = $('#SearchTerm').val();	
		if ( input_txt == '' ){
			$('#SearchTerm').val("Search");
			$('#SearchTerm').addClass('input_placeholder');			
		}
	});

	$('.btn_search').click(function() {
		submit_search();
	});

	if (disableSearch) {
		$('#search_form input').attr('disabled', 'disabled');
	}

	if (disablePDF)  {
		$('#pdf_button').attr('disabled', 'disabled').addClass('grayout').css("cursor", "auto");
	}

	if (noPDF)  {
		$('#pdf_button').css("display", "none");
	}

	$('#btn_openLayer').click(function() {
		if ( $('#SearchLayer').hasClass('hidden')  ){
			$('#SearchLayer').addClass('showed').removeClass('hidden');	
		}else{
			$('#SearchLayer').addClass('hidden').removeClass('showed');	
		}
	});

	$('#SearchLayer').click(function() {
		$(this).addClass('hidden').removeClass('showed');
	});

	$('ul.topicList li').click(function(event){
		$('ul.topicList li').removeClass("topic_selected");
		$(this).addClass("topic_selected");

		if ($(this).hasClass("lv4")) {
			return;
		}

		if ($(event.target).is("li")) {
			if ($(this).hasClass("expanded")) {
				$(this).parent().next("ul").hide();
			} else {
				$(this).parent().next("ul").show();
			}
			$(this).toggleClass("expanded");
			$(this).addClass("topic_selected");
		}
	});

	var widthSpan = $('#dummy_span');
	var btn_width = widthSpan.text("Feedback").width();
	if (btn_width + 10 > 64) {
		$('#feedback_button').css("width", btn_width + 10);
	}
	btn_width = widthSpan.text("PDF").width();
	if (btn_width + 10 > 64) {
		$('#pdf_button').css("width", btn_width + 10);
	}
	btn_width = widthSpan.text("Print View").width();
	if (btn_width + 10 > 64) {
		$('#printview_button').css("width", btn_width + 10);
	}
	widthSpan.css("display", "none");

	$('#pdf_button').click(function() {
		var pn = $("meta[name='pdfpn']").attr("content");
		var url = "../../pdf/" + pn + ".pdf";
		window.open(url);
	});

	$('#printview_button').click(function() {
		setActiveStyleSheet('print');
	});

	$('#feedback_button').click(function() {
		if (legacyFeedback) {
			gotoURL("http://www.oracle.com/goto/docfeedback");
		} else {
			call_survey();
		}
	});

	titleText = new TitleText($('#mkh_doctitle'));

	breadCrumb = new BreadCrumb();

	var baseElm = $("#BC-0");
	var backHTML = baseElm.html();
	for (var i = 0;; i++) {
		var bcID = "#BC-" + i;
		var bcElm = $(bcID);
		if (bcElm.length < 1) {
			break;
		}
		var newTxt = bcElm.text();
		baseElm.text(newTxt);
		var w = baseElm.width();
		breadCrumb.add(bcElm.get(0), w);
	}
	baseElm.html(backHTML);
	window.onresize = resizeWindow;
	resizeWindow();

        $('.btn_openNav4').click(function() {
                $('.topicPane').show(100);
                $('.grayoutLayer').show();
                $('.btn_closeNav4').show(100);
                $('.btn_openNav4').hide();
        });

        $('.btn_closeNav4').click(function() {
                $('.topicPane').hide(100);
                $('.grayoutLayer').hide();
                $('.btn_closeNav4').hide();
                $('.btn_openNav4').show();
        });

        $('.grayoutLayer').click(function() {
                $('.topicPane').hide(100);
                $('.grayoutLayer').hide();
                $('.btn_closeNav4').hide();
                $('.btn_openNav4').show();
        });

        /* mast head */
        var mimage = $("meta[name='mastheadimage']").attr("content");
        if (mimage != null && mimage.length > 0) {
                $('.headerPane').css({
                  "background": "url(" + mimage + ")",
                  "background-size": "100% 100%",
                  "background-repeat": "no-repeat"
                });
        }

        if(language_menu_enabled) {
                $('#lmenu').removeAttr('disabled');
        }

        if(language_menu_kind == 'otn') {
                sendRequest(location.protocol + '//' + libL10NInfoURL + $("meta[name='baselibrarynumber']").attr("content") + "-langs.json", langListCallback, null);
        }
        $('#lmenu').change(gotoLangPage);
});

function TitleText(titleElm) {
	this.elms = new Array();
	this.workingElms = new Array();
	this.widths = new Array();
	this.workingWidths = new Array();
	this.titleString = titleElm.text();
	this.shorten = false;
	var method = 0;
	var lang = $("meta[name='language']").attr("content");
	if (lang == 'ja' || lang == 'ko' || lang == 'zh' || lang == 'zh_TW') {
		method = 1;
	}

	if (method == 0) {
		// assume words are separated by space
		var str = "";
		var words = this.titleString.split(' ');
		for (var i = 0; i < words.length; i++) {
			if (str.length > 0) {
				str += " " + (words[i]);
			} else {
				str = words[i];
			}
			this.elms.push(str);
			titleElm.text(str);
			this.widths.push(titleElm.width());
		}
	} else {
		// Asian languages
		var str = "";
		for (var i = 0; i < this.titleString.length; i++) {
			str += this.titleString.charAt(i);
			this.elms.push(str);
			titleElm.text(str);
			this.widths.push(titleElm.width());
		}
	}

	this.width = function() {
		return this.workingWidths[this.workingWidths.length - 1];
	}

	this.next = function() {
		this.shorten = true;
		this.workingElms.pop();
		this.workingWidths.pop();
		return this.width();
	}

	this.toString = function() {
		if (this.shorten) {
			return this.workingElms[this.workingElms.length - 1] + " ...";
		}
		return this.titleString;
	}

	this.reset = function() {
		this.workingElms = this.elms.slice();
		this.workingWidths = this.widths.slice();
		this.shorten = false;
	}
}

function BreadCrumb() {
	this.elms = new Array();
	this.workingElms = new Array();
	this.widths = new Array();
	this.workingWidths = new Array();

	this.replaced = false;
	this.replElm = outerHTML($('#BC-REPLACE').get(0));
	this.replWidth = $('#BC-REPLACE').width();
	this.replPos = 0;

	/*
	 * add new element with width
	 */
	this.add = function(elm, width) {
		this.elms.push(outerHTML(elm));
		this.widths.push(width);
	};

	/*
	 * get current width
	 */
	this.width = function() {
		var wid = 0;
		for (var i = 0; i < this.workingWidths.length; i++) {
			wid += this.workingWidths[i];
		}
		return wid;
	};

	/*
	 * remove next candidate element and returns reduced width
	 */
	this.next = function() {
		var start = Math.floor(this.workingElms.length / 2);
		if (this.replaced == false) {
			this.workingElms.splice(start, 1, this.replElm);
			this.workingWidths.splice(start, 1, this.replWidth);
			this.replaced = true;
			this.replPos = start;
		} else {
			if (start == this.replPos) {
				start--;
				this.replPos--;
			}
			this.workingElms.splice(start, 1);
			this.workingWidths.splice(start, 1);
		}
		return this.width();
	};

	this.toString = function() {
		var retStr = "";
		for (var i = 0; i < this.workingElms.length; i++) {
			retStr += this.workingElms[i];
		}
		return retStr;
	};

	this.reset = function() {
		this.workingElms = this.elms.slice();
		this.workingWidths = this.widths.slice();
		this.replaced = false;
	}
}

function outerHTML(elm) {
	/* for firefox < 11 */
	return $(elm).clone().wrap("<p>").parent().html();
}

var breadCrumb;

function resizeWindow() {
	titleText.reset();
	var titleSpan = $('#mkh_doctitle');
	var titleDiv = $('#mkh_div_doctitle');
	var width = titleDiv.width();
	var ttlWidth = titleText.width();
	if (width < (ttlWidth + 10)) {
		for (;;) {
			var newWidth = titleText.next();
			if (width < 100 || width >= (newWidth + 10)) {
				break;
			}
		}
	}
	titleSpan.html(titleText.toString());

	breadCrumb.reset();
	var bcDiv = $('#breadcrumbs');
	var width = bcDiv.width();
	var bcWidth = breadCrumb.width();
	if (width < bcWidth) {
		/* first get rid of the last one */
		for (;;) {
			var newWidth = breadCrumb.next();
			if (width >= newWidth) {
				break;
			}
		}
	}
	bcDiv.html(breadCrumb.toString());

	/* adaptive */
	var pageWidth = $(window).width();
	if (pageWidth > 981) {
		$('.topicPane').show();
		$('.topicPaneBlank').show();
		$('.grayoutLayer').show();
	} else {
		$('.topicPane').hide();
		$('.topicPaneBlank').hide();
		$('.grayoutLayer').hide();
		$('.btn_closeNav4').hide();
		$('.btn_openNav4').show();
	}
}

function submit_search() {
	var form = document.getElementById("search_form");
	var q = document.getElementById("q");
	var lib = $("meta[name='librarynumber']").attr("content");
	var pn = $("meta[name='partnumber']").attr("content");
	var path = "docs/cd/" + lib + "_01";

	var search_term = $("#SearchTerm").val();

	if (search_term == "") {
		alert("Search field is empty");
		return false;
	}
	if ($("#doc_scope:checked").val()) {
		path += ("/html/" + pn);
	}

    if(search_type == "local") {
        q.value = search_term;
        form.action = osearch.relprefix + "search.html";
    } else if(search_type == "otn") {
        q.value = search_term + " url:/" + path;
        form.action = "http://search.oracle.com/search/search";
    } else {
        return false;
    }

	form.method = "get";
	form.target = "_top";
	form.submit();
}

function gotoURL(url) {
	window.location.href = url;
}
