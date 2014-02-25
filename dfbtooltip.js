(function( $ ) {
	$.fn.dfbTooltip = function( options ) {
		var top = 'top';
		var bottom = 'bottom';
		var left = 'left';
		var right = 'right';
		var connectorClass = '';
		var currentTooltip = null;

		/*
		 * DFB-Tooltip default options
		 *
		 * sticky:			(Boolean:false) Sticky tooltip, hides when leaving the tooltip itself or clicking
		 * connector:		(String:null) Position of the connector (valid options: top,bottom,left,tight in format 'option1, option2'
		 * track:			(Boolean:false) Tooltip tracks the mouse movement (sticky ist not allowed and 'false')
		 *
		 * See: http://api.jqueryui.com/position/
		 * my:				(String:'left top') Defines which position on the element being positioned to align with the tooltip element
		 * at:				(String:'right+15 top-10') Defines which position on the tooltip element to align the positioned element against
		 * collision:		(String: 'flip') When the positioned element overflows the window in some direction, move it to an alternative position
		 */
		var defaults = {
				sticky: false,
				connector: null,
				track: false,
				my: 'left top',
				at: 'right+15 top-10',
				collision: 'flip'
		};
		if (options && options.track){
			defaults.my = 'left+20 top-15';
		}

		var settings = $.extend( {}, defaults, options );

		/*
		 * Set the position of the connector (css-class).
		 * - The first position defines on which side the connector should be placed
		 * - The second position defines the alignment of the connector on the selected side
		 */
		var position = settings.connector;
		if (position && position.length > 0 && position.indexOf(',')){
			var posFirst = getConnectorPos(position.substring(0, position.indexOf(',')).trim());
			var posSecond = getConnectorPos(position.substring(position.indexOf(',') + 1, position.length));
			connectorClass = 'connector ' + posFirst + '-' + posSecond;
		}

		if (settings.track){
			settings.sticky = false;
		}

		return this.each(function(){
			if (settings.track){
				$(this).mousemove(function(event){
					var tt = showTooltipTrack(this);
				    $(tt).position({
				    	my: settings.my,
				    	collision: settings.collision,
				    	of: event
				    });
				    $(tt).fadeIn(200);
			    });
			} else {
				$(this).mouseover(function(event){
					var tt = showTooltip(this);
				    $(tt).position({
				    	my: settings.my,
				    	at: settings.at,
				    	collision: settings.collision,
				    	of: this
				    });
				    $(tt).fadeIn(200);
			    });
			}

			if (settings.sticky){
				$(document).click(function(){
					hideTooltipActive();
			    });
			} else {
				$(this).mouseout(function(){
					hideTooltipActive();
			    });
			}
		});

	    /* private functions */
	    function showTooltip (elem){
	    	if (currentTooltip && $(currentTooltip).is(':visible')){
	    		hideTooltipActive();
	    	}
	    	currentTooltip = findTooltip(elem).clone();
	    	$(elem).parents('form').append(currentTooltip);

	    	if (settings.sticky){
				$(currentTooltip).mouseleave(function(){
					hideTooltipActive();
				});
	    	}
			return currentTooltip;
	    }
	    function showTooltipTrack (elem){
			return findTooltip(elem);
	    }

	    function findTooltip(elem){
	    	var tt = $(elem).next();
	    	if (connectorClass.length > 0){
				$(tt).addClass(connectorClass);
			}
	    	return tt;
	    }

	    function hideTooltipActive (){
	    	if (settings.track){
	    		$(currentTooltip).fadeOut(200);
	    	} else {
	    		$(currentTooltip).fadeOut(200, function(){$(this).remove()});
	    	}
	    }

	    function getConnectorPos(position){
	    	var pos = position.trim();
	    	if (contain(pos, left)){
				return left;
			} else if (contain(pos, right)){
				return right;
			} else if (contain(pos, top)){
				return top;
			} else if (contain(pos, bottom)){
				return bottom;
			}
	    	return '';
	    }

	    function contain (elem, value) {
	    	return elem.indexOf(value) != -1;
	    }
	};
}( jQuery ));