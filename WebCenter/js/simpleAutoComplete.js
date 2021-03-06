/*
	Simple AutoComplete plugin for jQuery
	Author: Mario Arrieta
	Version: 1.0.0 {10-08-2010}
 * 
 
 * $('selector').simpleAutoComplete("ajax_query.aspx.cs", {
 *	identifier: 'estado',
 *	extraParamFromInput: '#extra',
 *	extraParamFromInput2: '#extra2',
 *	attrCallBack: 'rel',
 *	autoCompleteClassName: 'autocomplete',
 *	selectedClassName: 'sel'
 * },calbackFunction);
 * 
 */

(function($) {
    $.fn.extend(
	{
	    simpleAutoComplete: function (page, options, callback) {
	        if (typeof (page) == "undefined") {
	            alert("simpleAutoComplete: You must to especific page where will process query!");
	        }

	        var classAC = 'autocomplete';
	        var selClass = 'sel';
	        var attrCB = 'rel';
	        var thisElement = $(this);

	        $(":not(div." + classAC + ")").click(function() {
	            $("div." + classAC).remove();
	        });

	        thisElement.attr("autocomplete", "off");

	        thisElement.keyup(function(ev) {
	            var getOptions = { query: thisElement.val() }
	            
	            if (typeof (options) == "object") {
	                classAC = typeof (options.autoCompleteClassName) != "undefined" ? options.autoCompleteClassName : classAC;
	                selClass = typeof (options.selectedClassName) != "undefined" ? options.selectedClassName : selClass;

	                attrCB = typeof (options.attrCallBack) != "undefined" ? options.attrCallBack : attrCB;
	                if (typeof (options.identifier) == "string")
	                    getOptions.identifier = options.identifier;

	                if (typeof (options.extraParamFromInput) != "undefined")
	                    getOptions.extraParam = $(options.extraParamFromInput).val();

	                if (typeof (options.extraParamFromInput2) != "undefined")
	                    getOptions.extraParam2 = $(options.extraParamFromInput2).val();
	            }

	            kc = ((typeof (ev.charCode) == 'undefined' || ev.charCode === 0) ? ev.keyCode : ev.charCode);
	            
	            key = String.fromCharCode(kc);
                
                
	            //console.log(kc, key, ev);

	            
	            if (kc == 27) {
	                $('div.' + classAC).remove();
	            }
	            if (kc == 13) {
	                $('div.' + classAC + ' li.' + selClass).trigger('click');
	            }
	            if (key.match(/[a-zA-Z0-9_\- ]/) || kc == 8 || kc == 46 || kc == 96) {
	                $.get(page, getOptions, function(r) {
	                    $('div.' + classAC).remove();
	                    autoCompleteList = $('<div>').addClass(classAC).html(r);
	                    if (r != '') {
	                        autoCompleteList.insertAfter(thisElement);

	                        var position = thisElement.position();
	                        var height = thisElement.height();
	                        var width = thisElement.width();

	                        $('div.' + classAC).css({
	                            'top': (height + position.top + 6) + 'px',
	                            'left': (position.left) + 'px',
	                            'margin': '0px'
	                        });

	                        $('div.' + classAC + ' ul').css({
	                            'margin-left': '0px'
	                        });

	                        $('div.' + classAC + ' li').each(function(n, el) {
	                            el = $(el);
	                            el.mouseenter(function() {
	                                $('div.' + classAC + ' li.' + selClass).removeClass(selClass);
	                                $(this).addClass(selClass);
	                            });
	                            el.click(function() {
	                                thisElement.attr('value', el.text());

	                                if (typeof (callback) == "function")
	                                    callback(el.attr(attrCB).split('_'));

	                                $('div.' + classAC).remove();
	                                thisElement.focus();
	                            });
	                        });
	                    }
	                });
	            }
	            if (kc == 38 || kc == 40) {
	                if ($('div.' + classAC + ' li.' + selClass).length == 0) {
	                    if (kc == 38) {
	                        $($('div.' + classAC + ' li')[$('div.' + classAC + ' li').length - 1]).addClass(selClass);
	                    } else {
	                        $($('div.' + classAC + ' li')[0]).addClass(selClass);
	                    }
	                }
	                else {
	                    sel = false;
	                    $('div.' + classAC + ' li').each(function(n, el) {
	                        el = $(el);
	                        if (!sel && el.hasClass(selClass)) {
	                            el.removeClass(selClass);
	                            $($('div.' + classAC + ' li')[(kc == 38 ? (n - 1) : (n + 1))]).addClass(selClass);
	                            sel = true;
	                        }
	                    });
	                }
	            }
	            if (thisElement.val() == '') {
	                $('div.' + classAC).remove();
	            }
	        });
	    }
	});
})(jQuery);
