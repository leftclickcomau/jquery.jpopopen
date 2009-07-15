/*
 * jpopopen
 * 
 * Load a panel by AJAX, and open it near the link that loaded it.
 * 
 * TODO License
 */

;(function($) {
	
	$.fn.jpopopen = function(options) {
		var jpopopen = false;
		var options = $.extend({}, $.jpopopen.defaultOptions, options);
		$(this).each(function() {
			if (this.nodeName.toLowerCase() == 'a') {
				jpopopen = $.jpopopen._init($(this), $.extend({ 'url' : $(this).attr('href') }, options));
			}
		});
		return jpopopen;
	};
	
	$.jpopopen = {
		defaultOptions : {
			'panelId' : 'jpopopen_panel',
			'panelClass' : 'jpopopen_panel',
			'closeLinkClass' : 'close',
			'innerDivClass' : 'inner',
			'openPanelLinkClass' : 'panel_open',
			'close' : 'Close'
		},
		
		_init : function($$, options) {
			var create = function() {
				var popopen = $('<div id="' + options.panelId + '" class="' + options.panelClass + '"></div>');
				$(document.body).append(popopen.css({
					'display' : 'inline-block',
					'visibility' : 'hidden'
				}));
				popopen.append(popopen.inner = $('<div id="' + options.panelId + '_inner" class="' + options.innerDivClass + '"></div>'));
				popopen.append(popopen.closeLink = $('<a href="#" id="' + options.panelId + '_close" class="' + options.closeLinkClass + '">' + options.close + '</a>'));
				popopen.closeLink.click(closeHandler);
				popopen.closeLink.popopen = popopen.inner.popopen = popopen;
				popopen.css('display', 'none');
				return popopen;
			};
			
			var closeHandler = function(event) {
				$$.popopen.slideUp('normal', function() {
					$$.removeClass(options.openPanelLinkClass);
				});
				$$.unbind('click');
				$$.click(openHandler);
				$$.triggerHandler('jpopopen.close');
				return false;
			};
			
			var openHandler = function(event) {
				if (!$$.popopen) {
					$$.popopen = create();
					$$.popopen.openLink = $$;
					$$.popopen.inner.load(options.url, null, ajaxCallback);
				} else {
					$$.popopen.slideDown('normal');
					$$.addClass(options.openPanelLinkClass);
				}
				$$.unbind('click');
				$$.click(closeHandler);
				$$.triggerHandler('jpopopen.open');
				return false;
			};
			
			var ajaxCallback = function() {
				var popopenWidth = $$.popopen.width();
				$$.addClass(options.openPanelLinkClass);
				$$.popopen.css({
					'position' : 'absolute',
					// TODO Replace 9 with actual padding / border / margin size
					'left' : $$.offset()['left'] + $$.width() - popopenWidth + 9,
					'top' : $$.offset()['top'] + $$.height() + 9,
					'visibility' : 'visible'
				}).slideDown('normal');
				if ($.isFunction(options.ajaxCallback)) {
					options.ajaxCallback($$.popopen);
				}
			};
			
			$$.click(openHandler);
			return $$;
		}
	};
})(jQuery);
