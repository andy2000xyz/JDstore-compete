// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require bootstrap/alert
//= require bootstrap-sprockets
//= require bootstrap/dropdown
//= require_tree .


// Camera slideshow v1.3.3 - a jQuery slideshow with many effects, transitions, easy to customize, using canvas and mobile ready, based on jQuery 1.4+
// Copyright (c) 2012 by Manuel Masia - www.pixedelic.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
;(function($){$.fn.camera = function(opts, callback) {

	var defaults = {
		alignment			: 'center', //topLeft, topCenter, topRight, centerLeft, center, centerRight, bottomLeft, bottomCenter, bottomRight

		autoAdvance			: true,	//true, false

		mobileAutoAdvance	: true, //true, false. Auto-advancing for mobile devices

		barDirection		: 'leftToRight',	//'leftToRight', 'rightToLeft', 'topToBottom', 'bottomToTop'

		barPosition			: 'bottom',	//'bottom', 'left', 'top', 'right'

		cols				: 6,

		easing				: 'easeInOutExpo',	//for the complete list http://jqueryui.com/demos/effect/easing.html

		mobileEasing		: '',	//leave empty if you want to display the same easing on mobile devices and on desktop etc.

		fx					: 'random',	//'random','simpleFade', 'curtainTopLeft', 'curtainTopRight', 'curtainBottomLeft', 'curtainBottomRight', 'curtainSliceLeft', 'curtainSliceRight', 'blindCurtainTopLeft', 'blindCurtainTopRight', 'blindCurtainBottomLeft', 'blindCurtainBottomRight', 'blindCurtainSliceBottom', 'blindCurtainSliceTop', 'stampede', 'mosaic', 'mosaicReverse', 'mosaicRandom', 'mosaicSpiral', 'mosaicSpiralReverse', 'topLeftBottomRight', 'bottomRightTopLeft', 'bottomLeftTopRight', 'bottomLeftTopRight'
										//you can also use more than one effect, just separate them with commas: 'simpleFade, scrollRight, scrollBottom'

		mobileFx			: '',	//leave empty if you want to display the same effect on mobile devices and on desktop etc.

		gridDifference		: 250,	//to make the grid blocks slower than the slices, this value must be smaller than transPeriod

		height				: '50%',	//here you can type pixels (for instance '300px'), a percentage (relative to the width of the slideshow, for instance '50%') or 'auto'

		imagePath			: 'images/',	//he path to the image folder (it serves for the blank.gif, when you want to display videos)

		hover				: true,	//true, false. Puase on state hover. Not available for mobile devices

		loader				: 'pie',	//pie, bar, none (even if you choose "pie", old browsers like IE8- can't display it... they will display always a loading bar)

		loaderColor			: '#eeeeee',

		loaderBgColor		: '#222222',

		loaderOpacity		: .8,	//0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1

		loaderPadding		: 2,	//how many empty pixels you want to display between the loader and its background

		loaderStroke		: 7,	//the thickness both of the pie loader and of the bar loader. Remember: for the pie, the loader thickness must be less than a half of the pie diameter

		minHeight			: '200px',	//you can also leave it blank

		navigation			: true,	//true or false, to display or not the navigation buttons

		navigationHover		: true,	//if true the navigation button (prev, next and play/stop buttons) will be visible on hover state only, if false they will be visible always

		mobileNavHover		: true,	//same as above, but only for mobile devices

		opacityOnGrid		: false,	//true, false. Decide to apply a fade effect to blocks and slices: if your slideshow is fullscreen or simply big, I recommend to set it false to have a smoother effect

		overlayer			: true,	//a layer on the images to prevent the users grab them simply by clicking the right button of their mouse (.camera_overlayer)

		pagination			: true,

		playPause			: true,	//true or false, to display or not the play/pause buttons

		pauseOnClick		: true,	//true, false. It stops the slideshow when you click the sliders.

		pieDiameter			: 38,

		piePosition			: 'rightTop',	//'rightTop', 'leftTop', 'leftBottom', 'rightBottom'

		portrait			: false, //true, false. Select true if you don't want that your images are cropped

		rows				: 4,

		slicedCols			: 12,	//if 0 the same value of cols

		slicedRows			: 8,	//if 0 the same value of rows

		slideOn				: 'random',	//next, prev, random: decide if the transition effect will be applied to the current (prev) or the next slide

		thumbnails			: false,

		time				: 7000,	//milliseconds between the end of the sliding effect and the start of the nex one

		transPeriod			: 1500,	//lenght of the sliding effect in milliseconds

////////callbacks

		onEndTransition		: function() {  },	//this callback is invoked when the transition effect ends

		onLoaded			: function() {  },	//this callback is invoked when the image on a slide has completely loaded

		onStartLoading		: function() {  },	//this callback is invoked when the image on a slide start loading

		onStartTransition	: function() {  }	//this callback is invoked when the transition effect starts

    };


	function isMobile() {
		if( navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPod/i)
			){
				return true;
		}
	}

	var opts = $.extend({}, defaults, opts);

	var wrap = $(this).addClass('camera_wrap');

	wrap.wrapInner(
        '<div class="camera_src" />'
		).wrapInner(
	    '<div class="camera_fakehover" />'
		);

	var fakeHover = $('.camera_fakehover',wrap);

	fakeHover.append(
		'<div class="camera_target"></div>'
		);
	if(opts.overlayer == true){
		fakeHover.append(
			'<div class="camera_overlayer"></div>'
			)
	}
		fakeHover.append(
        '<div class="camera_target_content"></div>'
		);

	var loader;

	if(opts.loader=='pie' && $.browser.msie && $.browser.version < 9){
		loader = 'bar';
	} else {
		loader = opts.loader;
	}

	if(loader == 'pie'){
		fakeHover.append(
			'<div class="camera_pie"></div>'
			)
	} else if (loader == 'bar') {
		fakeHover.append(
			'<div class="camera_bar"></div>'
			)
	} else {
		fakeHover.append(
			'<div class="camera_bar" style="display:none"></div>'
			)
	}

	if(opts.playPause==true){
		fakeHover.append(
        '<div class="camera_commands"></div>'
		)
	}

	if(opts.navigation==true){
		fakeHover.append(
			'<div class="camera_prev"><span></span></div>'
			).append(
			'<div class="camera_next"><span></span></div>'
			);
	}

	if(opts.thumbnails==true){
		wrap.append(
			'<div class="camera_thumbs_cont" />'
			);
	}

	if(opts.thumbnails==true && opts.pagination!=true){
		$('.camera_thumbs_cont',wrap).wrap(
			'<div />'
			).wrap(
				'<div class="camera_thumbs" />'
			).wrap(
				'<div />'
			).wrap(
				'<div class="camera_command_wrap" />'
			);
	}

	if(opts.pagination==true){
		wrap.append(
			'<div class="camera_pag"></div>'
			);
	}

	wrap.append(
		'<div class="camera_loader"></div>'
		);

	$('.camera_caption',wrap).each(function(){
		$(this).wrapInner('<div />');
	});


	var pieID = 'pie_'+wrap.index(),
		elem = $('.camera_src',wrap),
		target = $('.camera_target',wrap),
		content = $('.camera_target_content',wrap),
		pieContainer = $('.camera_pie',wrap),
		barContainer = $('.camera_bar',wrap),
		prevNav = $('.camera_prev',wrap),
		nextNav = $('.camera_next',wrap),
		commands = $('.camera_commands',wrap),
		pagination = $('.camera_pag',wrap),
		thumbs = $('.camera_thumbs_cont',wrap);


	var w,
		h;


	var allImg = new Array();
	$('> div', elem).each( function() {
		allImg.push($(this).attr('data-src'));
	});

	var allLinks = new Array();
	$('> div', elem).each( function() {
		if($(this).attr('data-link')){
			allLinks.push($(this).attr('data-link'));
		} else {
			allLinks.push('');
		}
	});

	var allTargets = new Array();
	$('> div', elem).each( function() {
		if($(this).attr('data-target')){
			allTargets.push($(this).attr('data-target'));
		} else {
			allTargets.push('');
		}
	});

	var allPor = new Array();
	$('> div', elem).each( function() {
		if($(this).attr('data-portrait')){
			allPor.push($(this).attr('data-portrait'));
		} else {
			allPor.push('');
		}
	});

	var allAlign= new Array();
	$('> div', elem).each( function() {
		if($(this).attr('data-alignment')){
			allAlign.push($(this).attr('data-alignment'));
		} else {
			allAlign.push('');
		}
	});


	var allThumbs = new Array();
	$('> div', elem).each( function() {
		if($(this).attr('data-thumb')){
			allThumbs.push($(this).attr('data-thumb'));
		} else {
			allThumbs.push('');
		}
	});

	var amountSlide = allImg.length;

	$(content).append('<div class="cameraContents" />');
	var loopMove;
	for (loopMove=0;loopMove<amountSlide;loopMove++)
	{
		$('.cameraContents',content).append('<div class="cameraContent" />');
		if(allLinks[loopMove]!=''){
			//only for Wordpress plugin
			var dataBox = $('> div ',elem).eq(loopMove).attr('data-box');
			if(typeof dataBox !== 'undefined' && dataBox !== false && dataBox != '') {
				dataBox = 'data-box="'+$('> div ',elem).eq(loopMove).attr('data-box')+'"';
			} else {
				dataBox = '';
			}
			//
			$('.camera_target_content .cameraContent:eq('+loopMove+')',wrap).append('<a class="camera_link" href="'+allLinks[loopMove]+'" '+dataBox+' target="'+allTargets[loopMove]+'"></a>');
		}

	}
	$('.camera_caption',wrap).each(function(){
		var ind = $(this).parent().index(),
			cont = wrap.find('.cameraContent').eq(ind);
		$(this).appendTo(cont);
	});

	target.append('<div class="cameraCont" />');
	var cameraCont = $('.cameraCont',wrap);



	var loop;
	for (loop=0;loop<amountSlide;loop++)
	{
		cameraCont.append('<div class="cameraSlide cameraSlide_'+loop+'" />');
		var div = $('> div:eq('+loop+')',elem);
		target.find('.cameraSlide_'+loop).clone(div);
	}


	function thumbnailVisible() {
		var wTh = $(thumbs).width();
		$('li', thumbs).removeClass('camera_visThumb');
		$('li', thumbs).each(function(){
			var pos = $(this).position(),
				ulW = $('ul', thumbs).outerWidth(),
				offUl = $('ul', thumbs).offset().left,
				offDiv = $('> div',thumbs).offset().left,
				ulLeft = offDiv-offUl;
				if(ulLeft>0){
					$('.camera_prevThumbs',camera_thumbs_wrap).removeClass('hideNav');
				} else {
					$('.camera_prevThumbs',camera_thumbs_wrap).addClass('hideNav');
				}
				if((ulW-ulLeft)>wTh){
					$('.camera_nextThumbs',camera_thumbs_wrap).removeClass('hideNav');
				} else {
					$('.camera_nextThumbs',camera_thumbs_wrap).addClass('hideNav');
				}
				var left = pos.left,
					right = pos.left+($(this).width());
				if(right-ulLeft<=wTh && left-ulLeft>=0){
					$(this).addClass('camera_visThumb');
				}
		});
	}

	$(window).bind('load resize pageshow',function(){
		thumbnailPos();
		thumbnailVisible();
	});


	cameraCont.append('<div class="cameraSlide cameraSlide_'+loop+'" />');


	var started;

	wrap.show();
	var w = target.width();
	var h = target.height();

	var setPause;

	$(window).bind('resize pageshow',function(){
		if(started == true) {
			resizeImage();
		}
		$('ul', thumbs).animate({'margin-top':0},0,thumbnailPos);
		if(!elem.hasClass('paused')){
			elem.addClass('paused');
			if($('.camera_stop',camera_thumbs_wrap).length){
				$('.camera_stop',camera_thumbs_wrap).hide()
				$('.camera_play',camera_thumbs_wrap).show();
				if(loader!='none'){
					$('#'+pieID).hide();
				}
			} else {
				if(loader!='none'){
					$('#'+pieID).hide();
				}
			}
			clearTimeout(setPause);
			setPause = setTimeout(function(){
				elem.removeClass('paused');
				if($('.camera_play',camera_thumbs_wrap).length){
					$('.camera_play',camera_thumbs_wrap).hide();
					$('.camera_stop',camera_thumbs_wrap).show();
					if(loader!='none'){
						$('#'+pieID).fadeIn();
					}
				} else {
					if(loader!='none'){
						$('#'+pieID).fadeIn();
					}
				}
			},1500);
		}
	});

	function resizeImage(){
		var res;
		function resizeImageWork(){
			w = wrap.width();
			if(opts.height.indexOf('%')!=-1) {
				var startH = Math.round(w / (100/parseFloat(opts.height)));
				if(opts.minHeight != '' && startH < parseFloat(opts.minHeight)){
					h = parseFloat(opts.minHeight);
				} else {
					h = startH;
				}
				wrap.css({height:h});
			} else if (opts.height=='auto') {
				h = wrap.height();
			} else {
				h = parseFloat(opts.height);
				wrap.css({height:h});
			}
			$('.camerarelative',target).css({'width':w,'height':h});
			$('.imgLoaded',target).each(function(){
				var t = $(this),
					wT = t.attr('width'),
					hT = t.attr('height'),
					imgLoadIn = t.index(),
					mTop,
					mLeft,
					alignment = t.attr('data-alignment'),
					portrait =  t.attr('data-portrait');

					if(typeof alignment === 'undefined' || alignment === false || alignment === ''){
						alignment = opts.alignment;
					}

					if(typeof portrait === 'undefined' || portrait === false || portrait === ''){
						portrait = opts.portrait;
					}

					if(portrait==false||portrait=='false'){
						if((wT/hT)<(w/h)) {
							var r = w / wT;
							var d = (Math.abs(h - (hT*r)))*0.5;
							switch(alignment){
								case 'topLeft':
									mTop = 0;
									break;
								case 'topCenter':
									mTop = 0;
									break;
								case 'topRight':
									mTop = 0;
									break;
								case 'centerLeft':
									mTop = '-'+d+'px';
									break;
								case 'center':
									mTop = '-'+d+'px';
									break;
								case 'centerRight':
									mTop = '-'+d+'px';
									break;
								case 'bottomLeft':
									mTop = '-'+d*2+'px';
									break;
								case 'bottomCenter':
									mTop = '-'+d*2+'px';
									break;
								case 'bottomRight':
									mTop = '-'+d*2+'px';
									break;
							}
							t.css({
								'height' : hT*r,
								'margin-left' : 0,
								'margin-top' : mTop,
								'position' : 'absolute',
								'visibility' : 'visible',
								'width' : w
							});
						}
						else {
							var r = h / hT;
							var d = (Math.abs(w - (wT*r)))*0.5;
							switch(alignment){
								case 'topLeft':
									mLeft = 0;
									break;
								case 'topCenter':
									mLeft = '-'+d+'px';
									break;
								case 'topRight':
									mLeft = '-'+d*2+'px';
									break;
								case 'centerLeft':
									mLeft = 0;
									break;
								case 'center':
									mLeft = '-'+d+'px';
									break;
								case 'centerRight':
									mLeft = '-'+d*2+'px';
									break;
								case 'bottomLeft':
									mLeft = 0;
									break;
								case 'bottomCenter':
									mLeft = '-'+d+'px';
									break;
								case 'bottomRight':
									mLeft = '-'+d*2+'px';
									break;
							}
							t.css({
								'height' : h,
								'margin-left' : mLeft,
								'margin-top' : 0,
								'position' : 'absolute',
								'visibility' : 'visible',
								'width' : wT*r
							});
						}
					} else {
						if((wT/hT)<(w/h)) {
							var r = h / hT;
							var d = (Math.abs(w - (wT*r)))*0.5;
							switch(alignment){
								case 'topLeft':
									mLeft = 0;
									break;
								case 'topCenter':
									mLeft = d+'px';
									break;
								case 'topRight':
									mLeft = d*2+'px';
									break;
								case 'centerLeft':
									mLeft = 0;
									break;
								case 'center':
									mLeft = d+'px';
									break;
								case 'centerRight':
									mLeft = d*2+'px';
									break;
								case 'bottomLeft':
									mLeft = 0;
									break;
								case 'bottomCenter':
									mLeft = d+'px';
									break;
								case 'bottomRight':
									mLeft = d*2+'px';
									break;
							}
							t.css({
								'height' : h,
								'margin-left' : mLeft,
								'margin-top' : 0,
								'position' : 'absolute',
								'visibility' : 'visible',
								'width' : wT*r
							});
						}
						else {
							var r = w / wT;
							var d = (Math.abs(h - (hT*r)))*0.5;
							switch(alignment){
								case 'topLeft':
									mTop = 0;
									break;
								case 'topCenter':
									mTop = 0;
									break;
								case 'topRight':
									mTop = 0;
									break;
								case 'centerLeft':
									mTop = d+'px';
									break;
								case 'center':
									mTop = d+'px';
									break;
								case 'centerRight':
									mTop = d+'px';
									break;
								case 'bottomLeft':
									mTop = d*2+'px';
									break;
								case 'bottomCenter':
									mTop = d*2+'px';
									break;
								case 'bottomRight':
									mTop = d*2+'px';
									break;
							}
							t.css({
								'height' : hT*r,
								'margin-left' : 0,
								'margin-top' : mTop,
								'position' : 'absolute',
								'visibility' : 'visible',
								'width' : w
							});
						}
					}
			});
		}
		if (started == true) {
			clearTimeout(res);
			res = setTimeout(resizeImageWork,200);
		} else {
			resizeImageWork();
		}

		started = true;
	}


	var u,
		setT;

	var clickEv,
		autoAdv,
		navHover,
		commands,
		pagination;

	var videoHover,
		videoPresent;

	if(isMobile() && opts.mobileAutoAdvance!=''){
		autoAdv = opts.mobileAutoAdvance;
	} else {
		autoAdv = opts.autoAdvance;
	}

	if(autoAdv==false){
		elem.addClass('paused');
	}

	if(isMobile() && opts.mobileNavHover!=''){
		navHover = opts.mobileNavHover;
	} else {
		navHover = opts.navigationHover;
	}

	if(elem.length!=0){

		var selector = $('.cameraSlide',target);
		selector.wrapInner('<div class="camerarelative" />');

		var navSlide;

		var barDirection = opts.barDirection;

		var camera_thumbs_wrap = wrap;


		$('iframe',fakeHover).each(function(){
			var t = $(this);
			var src = t.attr('src');
			t.attr('data-src',src);
			var divInd = t.parent().index('.camera_src > div');
			$('.camera_target_content .cameraContent:eq('+divInd+')',wrap).append(t);
		});
		function imgFake() {
				$('iframe',fakeHover).each(function(){
					$('.camera_caption',fakeHover).show();
					var t = $(this);
					var cloneSrc = t.attr('data-src');
					t.attr('src',cloneSrc);
					var imgFakeUrl = opts.imagePath+'blank.gif';
					var imgFake = new Image();
					imgFake.src = imgFakeUrl;
					if(opts.height.indexOf('%')!=-1) {
						var startH = Math.round(w / (100/parseFloat(opts.height)));
						if(opts.minHeight != '' && startH < parseFloat(opts.minHeight)){
							h = parseFloat(opts.minHeight);
						} else {
							h = startH;
						}
					} else if (opts.height=='auto') {
						h = wrap.height();
					} else {
						h = parseFloat(opts.height);
					}
					t.after($(imgFake).attr({'class':'imgFake','width':w,'height':h}));
					var clone = t.clone();
					t.remove();
					$(imgFake).bind('click',function(){
						if($(this).css('position')=='absolute') {
							$(this).remove();
							if(cloneSrc.indexOf('vimeo') != -1 || cloneSrc.indexOf('youtube') != -1) {
								if(cloneSrc.indexOf('?') != -1){
									autoplay = '&autoplay=1';
								} else {
									autoplay = '?autoplay=1';
								}
							} else if(cloneSrc.indexOf('dailymotion') != -1) {
								if(cloneSrc.indexOf('?') != -1){
									autoplay = '&autoPlay=1';
								} else {
									autoplay = '?autoPlay=1';
								}
							}
							clone.attr('src',cloneSrc+autoplay);
							videoPresent = true;
						} else {
							$(this).css({position:'absolute',top:0,left:0,zIndex:10}).after(clone);
							clone.css({position:'absolute',top:0,left:0,zIndex:9});
						}
					});
				});
		}

		imgFake();


		if(opts.hover==true){
			if(!isMobile()){
				fakeHover.hover(function(){
					elem.addClass('hovered');
				},function(){
					elem.removeClass('hovered');
				});
			}
		}

		if(navHover==true){
			$(prevNav,wrap).animate({opacity:0},0);
			$(nextNav,wrap).animate({opacity:0},0);
			$(commands,wrap).animate({opacity:0},0);
			if(isMobile()){
				fakeHover.live('vmouseover',function(){
					$(prevNav,wrap).animate({opacity:1},200);
					$(nextNav,wrap).animate({opacity:1},200);
					$(commands,wrap).animate({opacity:1},200);
				});
				fakeHover.live('vmouseout',function(){
					$(prevNav,wrap).delay(500).animate({opacity:0},200);
					$(nextNav,wrap).delay(500).animate({opacity:0},200);
					$(commands,wrap).delay(500).animate({opacity:0},200);
				});
			} else {
				fakeHover.hover(function(){
					$(prevNav,wrap).animate({opacity:1},200);
					$(nextNav,wrap).animate({opacity:1},200);
					$(commands,wrap).animate({opacity:1},200);
				},function(){
					$(prevNav,wrap).animate({opacity:0},200);
					$(nextNav,wrap).animate({opacity:0},200);
					$(commands,wrap).animate({opacity:0},200);
				});
			}
		}


		$('.camera_stop',camera_thumbs_wrap).live('click',function(){
			autoAdv = false;
			elem.addClass('paused');
			if($('.camera_stop',camera_thumbs_wrap).length){
				$('.camera_stop',camera_thumbs_wrap).hide()
				$('.camera_play',camera_thumbs_wrap).show();
				if(loader!='none'){
					$('#'+pieID).hide();
				}
			} else {
				if(loader!='none'){
					$('#'+pieID).hide();
				}
			}
		});

		$('.camera_play',camera_thumbs_wrap).live('click',function(){
			autoAdv = true;
			elem.removeClass('paused');
			if($('.camera_play',camera_thumbs_wrap).length){
				$('.camera_play',camera_thumbs_wrap).hide();
				$('.camera_stop',camera_thumbs_wrap).show();
				if(loader!='none'){
					$('#'+pieID).show();
				}
			} else {
				if(loader!='none'){
					$('#'+pieID).show();
				}
			}
		});

		if(opts.pauseOnClick==true){
			$('.camera_target_content',fakeHover).mouseup(function(){
				autoAdv = false;
				elem.addClass('paused');
				$('.camera_stop',camera_thumbs_wrap).hide()
				$('.camera_play',camera_thumbs_wrap).show();
				$('#'+pieID).hide();
			});
		}
		$('.cameraContent, .imgFake',fakeHover).hover(function(){
			videoHover = true;
		},function(){
			videoHover = false;
		});

		$('.cameraContent, .imgFake',fakeHover).bind('click',function(){
			if(videoPresent == true && videoHover == true) {
				autoAdv = false;
				$('.camera_caption',fakeHover).hide();
				elem.addClass('paused');
				$('.camera_stop',camera_thumbs_wrap).hide()
				$('.camera_play',camera_thumbs_wrap).show();
				$('#'+pieID).hide();
			}
		});


	}


		function shuffle(arr) {
			for(
			  var j, x, i = arr.length; i;
			  j = parseInt(Math.random() * i),
			  x = arr[--i], arr[i] = arr[j], arr[j] = x
			);
			return arr;
		}

		function isInteger(s) {
			return Math.ceil(s) == Math.floor(s);
		}

		if (loader != 'pie') {
			barContainer.append('<span class="camera_bar_cont" />');
			$('.camera_bar_cont',barContainer)
				.animate({opacity:opts.loaderOpacity},0)
				.css({'position':'absolute', 'left':0, 'right':0, 'top':0, 'bottom':0, 'background-color':opts.loaderBgColor})
				.append('<span id="'+pieID+'" />');
			$('#'+pieID).animate({opacity:0},0);
			var canvas = $('#'+pieID);
			canvas.css({'position':'absolute', 'background-color':opts.loaderColor});
			switch(opts.barPosition){
				case 'left':
					barContainer.css({right:'auto',width:opts.loaderStroke});
					break;
				case 'right':
					barContainer.css({left:'auto',width:opts.loaderStroke});
					break;
				case 'top':
					barContainer.css({bottom:'auto',height:opts.loaderStroke});
					break;
				case 'bottom':
					barContainer.css({top:'auto',height:opts.loaderStroke});
					break;
			}
			switch(barDirection){
				case 'leftToRight':
					canvas.css({'left':0, 'right':0, 'top':opts.loaderPadding, 'bottom':opts.loaderPadding});
					break;
				case 'rightToLeft':
					canvas.css({'left':0, 'right':0, 'top':opts.loaderPadding, 'bottom':opts.loaderPadding});
					break;
				case 'topToBottom':
					canvas.css({'left':opts.loaderPadding, 'right':opts.loaderPadding, 'top':0, 'bottom':0});
					break;
				case 'bottomToTop':
					canvas.css({'left':opts.loaderPadding, 'right':opts.loaderPadding, 'top':0, 'bottom':0});
					break;
			}
		} else {
			pieContainer.append('<canvas id="'+pieID+'"></canvas>');
			var G_vmlCanvasManager;
			var canvas = document.getElementById(pieID);
			canvas.setAttribute("width", opts.pieDiameter);
			canvas.setAttribute("height", opts.pieDiameter);
			var piePosition;
			switch(opts.piePosition){
				case 'leftTop' :
					piePosition = 'left:0; top:0;';
					break;
				case 'rightTop' :
					piePosition = 'right:0; top:0;';
					break;
				case 'leftBottom' :
					piePosition = 'left:0; bottom:0;';
					break;
				case 'rightBottom' :
					piePosition = 'right:0; bottom:0;';
					break;
			}
			canvas.setAttribute("style", "position:absolute; z-index:1002; "+piePosition);
			var rad;
			var radNew;

			if (canvas && canvas.getContext) {
				var ctx = canvas.getContext("2d");
				ctx.rotate(Math.PI*(3/2));
				ctx.translate(-opts.pieDiameter,0);
			}

		}
		if(loader=='none' || autoAdv==false) {
			$('#'+pieID).hide();
			$('.camera_canvas_wrap',camera_thumbs_wrap).hide();
		}

		if($(pagination).length) {
			$(pagination).append('<ul class="camera_pag_ul" />');
			var li;
			for (li = 0; li < amountSlide; li++){
				$('.camera_pag_ul',wrap).append('<li class="pag_nav_'+li+'" style="position:relative; z-index:1002"><span><span>'+li+'</span></span></li>');
			}
			$('.camera_pag_ul li',wrap).hover(function(){
				$(this).addClass('camera_hover');
				if($('.camera_thumb',this).length){
					var wTh = $('.camera_thumb',this).outerWidth(),
					hTh = $('.camera_thumb',this).outerHeight(),
					wTt = $(this).outerWidth();
					$('.camera_thumb',this).show().css({'top':'-'+hTh+'px','left':'-'+(wTh-wTt)/2+'px'}).animate({'opacity':1,'margin-top':'-3px'},200);
					$('.thumb_arrow',this).show().animate({'opacity':1,'margin-top':'-3px'},200);
				}
			},function(){
				$(this).removeClass('camera_hover');
				$('.camera_thumb',this).animate({'margin-top':'-20px','opacity':0},200,function(){
					$(this).css({marginTop:'5px'}).hide();
				});
				$('.thumb_arrow',this).animate({'margin-top':'-20px','opacity':0},200,function(){
					$(this).css({marginTop:'5px'}).hide();
				});
			});
		}



		if($(thumbs).length) {
			var thumbUrl;
			if(!$(pagination).length) {
				$(thumbs).append('<div />');
				$(thumbs).before('<div class="camera_prevThumbs hideNav"><div></div></div>').before('<div class="camera_nextThumbs hideNav"><div></div></div>');
				$('> div',thumbs).append('<ul />');
				$.each(allThumbs, function(i, val) {
					if($('> div', elem).eq(i).attr('data-thumb')!='') {
						var thumbUrl = $('> div', elem).eq(i).attr('data-thumb'),
							newImg = new Image();
						newImg.src = thumbUrl;
						$('ul',thumbs).append('<li class="pix_thumb pix_thumb_'+i+'" />');
						$('li.pix_thumb_'+i,thumbs).append($(newImg).attr('class','camera_thumb'));
					}
				});
			} else {
				$.each(allThumbs, function(i, val) {
					if($('> div', elem).eq(i).attr('data-thumb')!='') {
						var thumbUrl = $('> div', elem).eq(i).attr('data-thumb'),
							newImg = new Image();
						newImg.src = thumbUrl;
						$('li.pag_nav_'+i,pagination).append($(newImg).attr('class','camera_thumb').css({'position':'absolute'}).animate({opacity:0},0));
						$('li.pag_nav_'+i+' > img',pagination).after('<div class="thumb_arrow" />');
						$('li.pag_nav_'+i+' > .thumb_arrow',pagination).animate({opacity:0},0);
					}
				});
				wrap.css({marginBottom:$(pagination).outerHeight()});
			}
		} else if(!$(thumbs).length && $(pagination).length) {
			wrap.css({marginBottom:$(pagination).outerHeight()});
		}


		var firstPos = true;

		function thumbnailPos() {
			if($(thumbs).length && !$(pagination).length) {
				var wTh = $(thumbs).outerWidth(),
					owTh = $('ul > li',thumbs).outerWidth(),
					pos = $('li.cameracurrent', thumbs).length ? $('li.cameracurrent', thumbs).position() : '',
					ulW = ($('ul > li', thumbs).length * $('ul > li', thumbs).outerWidth()),
					offUl = $('ul', thumbs).offset().left,
					offDiv = $('> div', thumbs).offset().left,
					ulLeft;

					if(offUl<0){
						ulLeft = '-'+ (offDiv-offUl);
					} else {
						ulLeft = offDiv-offUl;
					}



				if(firstPos == true) {
					$('ul', thumbs).width($('ul > li', thumbs).length * $('ul > li', thumbs).outerWidth());
					if($(thumbs).length && !$(pagination).lenght) {
						wrap.css({marginBottom:$(thumbs).outerHeight()});
					}
					thumbnailVisible();
					/*I repeat this two lines because of a problem with iPhones*/
					$('ul', thumbs).width($('ul > li', thumbs).length * $('ul > li', thumbs).outerWidth());
					if($(thumbs).length && !$(pagination).lenght) {
						wrap.css({marginBottom:$(thumbs).outerHeight()});
					}
					/*...*/
				}
				firstPos = false;

					var left = $('li.cameracurrent', thumbs).length ? pos.left : '',
						right = $('li.cameracurrent', thumbs).length ? pos.left+($('li.cameracurrent', thumbs).outerWidth()) : '';
					if(left<$('li.cameracurrent', thumbs).outerWidth()) {
						left = 0;
					}
					if(right-ulLeft>wTh){
						if((left+wTh)<ulW){
							$('ul', thumbs).animate({'margin-left':'-'+(left)+'px'},500,thumbnailVisible);
						} else {
							$('ul', thumbs).animate({'margin-left':'-'+($('ul', thumbs).outerWidth()-wTh)+'px'},500,thumbnailVisible);
						}
					} else if(left-ulLeft<0) {
						$('ul', thumbs).animate({'margin-left':'-'+(left)+'px'},500,thumbnailVisible);
					} else {
						$('ul', thumbs).css({'margin-left':'auto', 'margin-right':'auto'});
						setTimeout(thumbnailVisible,100);
					}

			}
		}

		if($(commands).length) {
			$(commands).append('<div class="camera_play"></div>').append('<div class="camera_stop"></div>');
			if(autoAdv==true){
				$('.camera_play',camera_thumbs_wrap).hide();
				$('.camera_stop',camera_thumbs_wrap).show();
			} else {
				$('.camera_stop',camera_thumbs_wrap).hide();
				$('.camera_play',camera_thumbs_wrap).show();
			}

		}


		function canvasLoader() {
			rad = 0;
			var barWidth = $('.camera_bar_cont',camera_thumbs_wrap).width(),
				barHeight = $('.camera_bar_cont',camera_thumbs_wrap).height();

			if (loader != 'pie') {
				switch(barDirection){
					case 'leftToRight':
						$('#'+pieID).css({'right':barWidth});
						break;
					case 'rightToLeft':
						$('#'+pieID).css({'left':barWidth});
						break;
					case 'topToBottom':
						$('#'+pieID).css({'bottom':barHeight});
						break;
					case 'bottomToTop':
						$('#'+pieID).css({'top':barHeight});
						break;
				}
			} else {
				ctx.clearRect(0,0,opts.pieDiameter,opts.pieDiameter);
			}
		}


		canvasLoader();


		$('.moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom',fakeHover).each(function(){
			$(this).css('visibility','hidden');
		});

		opts.onStartLoading.call(this);

		nextSlide();


	/*************************** FUNCTION nextSlide() ***************************/

	function nextSlide(navSlide){
		elem.addClass('camerasliding');

		videoPresent = false;
		var vis = parseFloat($('div.cameraSlide.cameracurrent',target).index());

		if(navSlide>0){
			var slideI = navSlide-1;
		} else if (vis == amountSlide-1) {
			var slideI = 0;
		} else {
			var slideI = vis+1;
		}


		var slide = $('.cameraSlide:eq('+slideI+')',target);
		var slideNext = $('.cameraSlide:eq('+(slideI+1)+')',target).addClass('cameranext');
		if( vis != slideI+1 ) {
			slideNext.hide();
		}
		$('.cameraContent',fakeHover).fadeOut(600);
		$('.camera_caption',fakeHover).show();

		$('.camerarelative',slide).append($('> div ',elem).eq(slideI).find('> div.camera_effected'));

		$('.camera_target_content .cameraContent:eq('+slideI+')',wrap).append($('> div ',elem).eq(slideI).find('> div'));

		if(!$('.imgLoaded',slide).length){
			var imgUrl = allImg[slideI];
			var imgLoaded = new Image();
			imgLoaded.src = imgUrl +"?"+ new Date().getTime();
			slide.css('visibility','hidden');
			slide.prepend($(imgLoaded).attr('class','imgLoaded').css('visibility','hidden'));
			var wT, hT;
			if (!$(imgLoaded).get(0).complete || wT == '0' || hT == '0' || typeof wT === 'undefined' || wT === false || typeof hT === 'undefined' || hT === false) {
				$('.camera_loader',wrap).delay(500).fadeIn(400);
				imgLoaded.onload = function() {
					wT = imgLoaded.naturalWidth;
					hT = imgLoaded.naturalHeight;
					$(imgLoaded).attr('data-alignment',allAlign[slideI]).attr('data-portrait',allPor[slideI]);
					$(imgLoaded).attr('width',wT);
					$(imgLoaded).attr('height',hT);
					target.find('.cameraSlide_'+slideI).hide().css('visibility','visible');
					resizeImage();
					nextSlide(slideI+1);
				};
			}
		} else {
			if( allImg.length > (slideI+1) && !$('.imgLoaded',slideNext).length ){
				var imgUrl2 = allImg[(slideI+1)];
				var imgLoaded2 = new Image();
				imgLoaded2.src = imgUrl2 +"?"+ new Date().getTime();
				slideNext.prepend($(imgLoaded2).attr('class','imgLoaded').css('visibility','hidden'));
				imgLoaded2.onload = function() {
					wT = imgLoaded2.naturalWidth;
					hT = imgLoaded2.naturalHeight;
					$(imgLoaded2).attr('data-alignment',allAlign[slideI+1]).attr('data-portrait',allPor[slideI+1]);
					$(imgLoaded2).attr('width',wT);
					$(imgLoaded2).attr('height',hT);
					resizeImage();
				};
			}
			opts.onLoaded.call(this);
			if($('.camera_loader',wrap).is(':visible')){
				$('.camera_loader',wrap).fadeOut(400);
			} else {
				$('.camera_loader',wrap).css({'visibility':'hidden'});
				$('.camera_loader',wrap).fadeOut(400,function(){
					$('.camera_loader',wrap).css({'visibility':'visible'});
				});
			}
			var rows = opts.rows,
				cols = opts.cols,
				couples = 1,
				difference = 0,
				dataSlideOn,
				time,
				transPeriod,
				fx,
				easing,
				randomFx = new Array('simpleFade','curtainTopLeft','curtainTopRight','curtainBottomLeft','curtainBottomRight','curtainSliceLeft','curtainSliceRight','blindCurtainTopLeft','blindCurtainTopRight','blindCurtainBottomLeft','blindCurtainBottomRight','blindCurtainSliceBottom','blindCurtainSliceTop','stampede','mosaic','mosaicReverse','mosaicRandom','mosaicSpiral','mosaicSpiralReverse','topLeftBottomRight','bottomRightTopLeft','bottomLeftTopRight','topRightBottomLeft','scrollLeft','scrollRight','scrollTop','scrollBottom','scrollHorz');
				marginLeft = 0,
				marginTop = 0,
				opacityOnGrid = 0;

				if(opts.opacityOnGrid==true){
					opacityOnGrid = 0;
				} else {
					opacityOnGrid = 1;
				}



			var dataFx = $(' > div',elem).eq(slideI).attr('data-fx');

			if(isMobile()&&opts.mobileFx!=''&&opts.mobileFx!='default'){
				fx = opts.mobileFx;
			} else {
				if(typeof dataFx !== 'undefined' && dataFx!== false && dataFx!== 'default'){
					fx = dataFx;
				} else {
					fx = opts.fx;
				}
			}

			if(fx=='random') {
				fx = shuffle(randomFx);
				fx = fx[0];
			} else {
				fx = fx;
				if(fx.indexOf(',')>0){
					fx = fx.replace(/ /g,'');
					fx = fx.split(',');
					fx = shuffle(fx);
					fx = fx[0];
				}
			}

			dataEasing = $(' > div',elem).eq(slideI).attr('data-easing');
			mobileEasing = $(' > div',elem).eq(slideI).attr('data-mobileEasing');

			if(isMobile()&&opts.mobileEasing!=''&&opts.mobileEasing!='default'){
				if(typeof mobileEasing !== 'undefined' && mobileEasing!== false && mobileEasing!== 'default') {
					easing = mobileEasing;
				} else {
					easing = opts.mobileEasing;
				}
			} else {
				if(typeof dataEasing !== 'undefined' && dataEasing!== false && dataEasing!== 'default') {
					easing = dataEasing;
				} else {
					easing = opts.easing;
				}
			}

			dataSlideOn = $(' > div',elem).eq(slideI).attr('data-slideOn');
			if(typeof dataSlideOn !== 'undefined' && dataSlideOn!== false){
				slideOn = dataSlideOn;
			} else {
				if(opts.slideOn=='random'){
					var slideOn = new Array('next','prev');
					slideOn = shuffle(slideOn);
					slideOn = slideOn[0];
				} else {
					slideOn = opts.slideOn;
				}
			}

			var dataTime = $(' > div',elem).eq(slideI).attr('data-time');
			if(typeof dataTime !== 'undefined' && dataTime!== false && dataTime!== ''){
				time = parseFloat(dataTime);
			} else {
				time = opts.time;
			}

			var dataTransPeriod = $(' > div',elem).eq(slideI).attr('data-transPeriod');
			if(typeof dataTransPeriod !== 'undefined' && dataTransPeriod!== false && dataTransPeriod!== ''){
				transPeriod = parseFloat(dataTransPeriod);
			} else {
				transPeriod = opts.transPeriod;
			}

			if(!$(elem).hasClass('camerastarted')){
				fx = 'simpleFade';
				slideOn = 'next';
				easing = '';
				transPeriod = 400;
				$(elem).addClass('camerastarted')
			}

			switch(fx){
				case 'simpleFade':
					cols = 1;
					rows = 1;
						break;
				case 'curtainTopLeft':
					if(opts.slicedCols == 0) {
						cols = opts.cols;
					} else {
						cols = opts.slicedCols;
					}
					rows = 1;
						break;
				case 'curtainTopRight':
					if(opts.slicedCols == 0) {
						cols = opts.cols;
					} else {
						cols = opts.slicedCols;
					}
					rows = 1;
						break;
				case 'curtainBottomLeft':
					if(opts.slicedCols == 0) {
						cols = opts.cols;
					} else {
						cols = opts.slicedCols;
					}
					rows = 1;
						break;
				case 'curtainBottomRight':
					if(opts.slicedCols == 0) {
						cols = opts.cols;
					} else {
						cols = opts.slicedCols;
					}
					rows = 1;
						break;
				case 'curtainSliceLeft':
					if(opts.slicedCols == 0) {
						cols = opts.cols;
					} else {
						cols = opts.slicedCols;
					}
					rows = 1;
						break;
				case 'curtainSliceRight':
					if(opts.slicedCols == 0) {
						cols = opts.cols;
					} else {
						cols = opts.slicedCols;
					}
					rows = 1;
						break;
				case 'blindCurtainTopLeft':
					if(opts.slicedRows == 0) {
						rows = opts.rows;
					} else {
						rows = opts.slicedRows;
					}
					cols = 1;
						break;
				case 'blindCurtainTopRight':
					if(opts.slicedRows == 0) {
						rows = opts.rows;
					} else {
						rows = opts.slicedRows;
					}
					cols = 1;
						break;
				case 'blindCurtainBottomLeft':
					if(opts.slicedRows == 0) {
						rows = opts.rows;
					} else {
						rows = opts.slicedRows;
					}
					cols = 1;
						break;
				case 'blindCurtainBottomRight':
					if(opts.slicedRows == 0) {
						rows = opts.rows;
					} else {
						rows = opts.slicedRows;
					}
					cols = 1;
						break;
				case 'blindCurtainSliceTop':
					if(opts.slicedRows == 0) {
						rows = opts.rows;
					} else {
						rows = opts.slicedRows;
					}
					cols = 1;
						break;
				case 'blindCurtainSliceBottom':
					if(opts.slicedRows == 0) {
						rows = opts.rows;
					} else {
						rows = opts.slicedRows;
					}
					cols = 1;
						break;
				case 'stampede':
					difference = '-'+transPeriod;
						break;
				case 'mosaic':
					difference = opts.gridDifference;
						break;
				case 'mosaicReverse':
					difference = opts.gridDifference;
						break;
				case 'mosaicRandom':
						break;
				case 'mosaicSpiral':
					difference = opts.gridDifference;
					couples = 1.7;
						break;
				case 'mosaicSpiralReverse':
					difference = opts.gridDifference;
					couples = 1.7;
						break;
				case 'topLeftBottomRight':
					difference = opts.gridDifference;
					couples = 6;
						break;
				case 'bottomRightTopLeft':
					difference = opts.gridDifference;
					couples = 6;
						break;
				case 'bottomLeftTopRight':
					difference = opts.gridDifference;
					couples = 6;
						break;
				case 'topRightBottomLeft':
					difference = opts.gridDifference;
					couples = 6;
						break;
				case 'scrollLeft':
					cols = 1;
					rows = 1;
						break;
				case 'scrollRight':
					cols = 1;
					rows = 1;
						break;
				case 'scrollTop':
					cols = 1;
					rows = 1;
						break;
				case 'scrollBottom':
					cols = 1;
					rows = 1;
						break;
				case 'scrollHorz':
					cols = 1;
					rows = 1;
						break;
			}

			var cycle = 0;
			var blocks = rows*cols;
			var leftScrap = w-(Math.floor(w/cols)*cols);
			var topScrap = h-(Math.floor(h/rows)*rows);
			var addLeft;
			var addTop;
			var tAppW = 0;
			var tAppH = 0;
			var arr = new Array();
			var delay = new Array();
			var order = new Array();
			while(cycle < blocks){
				arr.push(cycle);
				delay.push(cycle);
				cameraCont.append('<div class="cameraappended" style="display:none; overflow:hidden; position:absolute; z-index:1000" />');
				var tApp = $('.cameraappended:eq('+cycle+')',target);
				if(fx=='scrollLeft' || fx=='scrollRight' || fx=='scrollTop' || fx=='scrollBottom' || fx=='scrollHorz'){
					selector.eq(slideI).clone().show().appendTo(tApp);
				} else {
					if(slideOn=='next'){
						selector.eq(slideI).clone().show().appendTo(tApp);
					} else {
						selector.eq(vis).clone().show().appendTo(tApp);
					}
				}

				if(cycle%cols<leftScrap){
					addLeft = 1;
				} else {
					addLeft = 0;
				}
				if(cycle%cols==0){
					tAppW = 0;
				}
				if(Math.floor(cycle/cols)<topScrap){
					addTop = 1;
				} else {
					addTop = 0;
				}
				tApp.css({
					'height': Math.floor((h/rows)+addTop+1),
					'left': tAppW,
					'top': tAppH,
					'width': Math.floor((w/cols)+addLeft+1)
				});
				$('> .cameraSlide', tApp).css({
					'height': h,
					'margin-left': '-'+tAppW+'px',
					'margin-top': '-'+tAppH+'px',
					'width': w
				});
				tAppW = tAppW+tApp.width()-1;
				if(cycle%cols==cols-1){
					tAppH = tAppH + tApp.height() - 1;
				}
				cycle++;
			}



			switch(fx){
				case 'curtainTopLeft':
						break;
				case 'curtainBottomLeft':
						break;
				case 'curtainSliceLeft':
						break;
				case 'curtainTopRight':
					arr = arr.reverse();
						break;
				case 'curtainBottomRight':
					arr = arr.reverse();
						break;
				case 'curtainSliceRight':
					arr = arr.reverse();
						break;
				case 'blindCurtainTopLeft':
						break;
				case 'blindCurtainBottomLeft':
					arr = arr.reverse();
						break;
				case 'blindCurtainSliceTop':
						break;
				case 'blindCurtainTopRight':
						break;
				case 'blindCurtainBottomRight':
					arr = arr.reverse();
						break;
				case 'blindCurtainSliceBottom':
					arr = arr.reverse();
						break;
				case 'stampede':
					arr = shuffle(arr);
						break;
				case 'mosaic':
						break;
				case 'mosaicReverse':
					arr = arr.reverse();
						break;
				case 'mosaicRandom':
					arr = shuffle(arr);
						break;
				case 'mosaicSpiral':
					var rows2 = rows/2, x, y, z, n=0;
						for (z = 0; z < rows2; z++){
							y = z;
							for (x = z; x < cols - z - 1; x++) {
								order[n++] = y * cols + x;
							}
							x = cols - z - 1;
							for (y = z; y < rows - z - 1; y++) {
								order[n++] = y * cols + x;
							}
							y = rows - z - 1;
							for (x = cols - z - 1; x > z; x--) {
								order[n++] = y * cols + x;
							}
							x = z;
							for (y = rows - z - 1; y > z; y--) {
								order[n++] = y * cols + x;
							}
						}

						arr = order;

						break;
				case 'mosaicSpiralReverse':
					var rows2 = rows/2, x, y, z, n=blocks-1;
						for (z = 0; z < rows2; z++){
							y = z;
							for (x = z; x < cols - z - 1; x++) {
								order[n--] = y * cols + x;
							}
							x = cols - z - 1;
							for (y = z; y < rows - z - 1; y++) {
								order[n--] = y * cols + x;
							}
							y = rows - z - 1;
							for (x = cols - z - 1; x > z; x--) {
								order[n--] = y * cols + x;
							}
							x = z;
							for (y = rows - z - 1; y > z; y--) {
								order[n--] = y * cols + x;
							}
						}

						arr = order;

						break;
				case 'topLeftBottomRight':
					for (var y = 0; y < rows; y++)
					for (var x = 0; x < cols; x++) {
						order.push(x + y);
					}
						delay = order;
						break;
				case 'bottomRightTopLeft':
					for (var y = 0; y < rows; y++)
					for (var x = 0; x < cols; x++) {
						order.push(x + y);
					}
						delay = order.reverse();
						break;
				case 'bottomLeftTopRight':
					for (var y = rows; y > 0; y--)
					for (var x = 0; x < cols; x++) {
						order.push(x + y);
					}
						delay = order;
						break;
				case 'topRightBottomLeft':
					for (var y = 0; y < rows; y++)
					for (var x = cols; x > 0; x--) {
						order.push(x + y);
					}
						delay = order;
						break;
			}



			$.each(arr, function(index, value) {

				if(value%cols<leftScrap){
					addLeft = 1;
				} else {
					addLeft = 0;
				}
				if(value%cols==0){
					tAppW = 0;
				}
				if(Math.floor(value/cols)<topScrap){
					addTop = 1;
				} else {
					addTop = 0;
				}

				switch(fx){
					case 'simpleFade':
						height = h;
						width = w;
						opacityOnGrid = 0;
							break;
					case 'curtainTopLeft':
						height = 0,
						width = Math.floor((w/cols)+addLeft+1),
						marginTop = '-'+Math.floor((h/rows)+addTop+1)+'px';
							break;
					case 'curtainTopRight':
						height = 0,
						width = Math.floor((w/cols)+addLeft+1),
						marginTop = '-'+Math.floor((h/rows)+addTop+1)+'px';
							break;
					case 'curtainBottomLeft':
						height = 0,
						width = Math.floor((w/cols)+addLeft+1),
						marginTop = Math.floor((h/rows)+addTop+1)+'px';
							break;
					case 'curtainBottomRight':
						height = 0,
						width = Math.floor((w/cols)+addLeft+1),
						marginTop = Math.floor((h/rows)+addTop+1)+'px';
							break;
					case 'curtainSliceLeft':
						height = 0,
						width = Math.floor((w/cols)+addLeft+1);
						if(value%2==0){
							marginTop = Math.floor((h/rows)+addTop+1)+'px';
						} else {
							marginTop = '-'+Math.floor((h/rows)+addTop+1)+'px';
						}
							break;
					case 'curtainSliceRight':
						height = 0,
						width = Math.floor((w/cols)+addLeft+1);
						if(value%2==0){
							marginTop = Math.floor((h/rows)+addTop+1)+'px';
						} else {
							marginTop = '-'+Math.floor((h/rows)+addTop+1)+'px';
						}
							break;
					case 'blindCurtainTopLeft':
						height = Math.floor((h/rows)+addTop+1),
						width = 0,
						marginLeft = '-'+Math.floor((w/cols)+addLeft+1)+'px';
							break;
					case 'blindCurtainTopRight':
						height = Math.floor((h/rows)+addTop+1),
						width = 0,
						marginLeft = Math.floor((w/cols)+addLeft+1)+'px';
							break;
					case 'blindCurtainBottomLeft':
						height = Math.floor((h/rows)+addTop+1),
						width = 0,
						marginLeft = '-'+Math.floor((w/cols)+addLeft+1)+'px';
							break;
					case 'blindCurtainBottomRight':
						height = Math.floor((h/rows)+addTop+1),
						width = 0,
						marginLeft = Math.floor((w/cols)+addLeft+1)+'px';
							break;
					case 'blindCurtainSliceBottom':
						height = Math.floor((h/rows)+addTop+1),
						width = 0;
						if(value%2==0){
							marginLeft = '-'+Math.floor((w/cols)+addLeft+1)+'px';
						} else {
							marginLeft = Math.floor((w/cols)+addLeft+1)+'px';
						}
							break;
					case 'blindCurtainSliceTop':
						height = Math.floor((h/rows)+addTop+1),
						width = 0;
						if(value%2==0){
							marginLeft = '-'+Math.floor((w/cols)+addLeft+1)+'px';
						} else {
							marginLeft = Math.floor((w/cols)+addLeft+1)+'px';
						}
							break;
					case 'stampede':
						height = 0;
						width = 0;
						marginLeft = (w*0.2)*(((index)%cols)-(cols-(Math.floor(cols/2))))+'px';
						marginTop = (h*0.2)*((Math.floor(index/cols)+1)-(rows-(Math.floor(rows/2))))+'px';
							break;
					case 'mosaic':
						height = 0;
						width = 0;
							break;
					case 'mosaicReverse':
						height = 0;
						width = 0;
						marginLeft = Math.floor((w/cols)+addLeft+1)+'px';
						marginTop = Math.floor((h/rows)+addTop+1)+'px';
							break;
					case 'mosaicRandom':
						height = 0;
						width = 0;
						marginLeft = Math.floor((w/cols)+addLeft+1)*0.5+'px';
						marginTop = Math.floor((h/rows)+addTop+1)*0.5+'px';
							break;
					case 'mosaicSpiral':
						height = 0;
						width = 0;
						marginLeft = Math.floor((w/cols)+addLeft+1)*0.5+'px';
						marginTop = Math.floor((h/rows)+addTop+1)*0.5+'px';
							break;
					case 'mosaicSpiralReverse':
						height = 0;
						width = 0;
						marginLeft = Math.floor((w/cols)+addLeft+1)*0.5+'px';
						marginTop = Math.floor((h/rows)+addTop+1)*0.5+'px';
							break;
					case 'topLeftBottomRight':
						height = 0;
						width = 0;
							break;
					case 'bottomRightTopLeft':
						height = 0;
						width = 0;
						marginLeft = Math.floor((w/cols)+addLeft+1)+'px';
						marginTop = Math.floor((h/rows)+addTop+1)+'px';
							break;
					case 'bottomLeftTopRight':
						height = 0;
						width = 0;
						marginLeft = 0;
						marginTop = Math.floor((h/rows)+addTop+1)+'px';
							break;
					case 'topRightBottomLeft':
						height = 0;
						width = 0;
						marginLeft = Math.floor((w/cols)+addLeft+1)+'px';
						marginTop = 0;
							break;
					case 'scrollRight':
						height = h;
						width = w;
						marginLeft = -w;
							break;
					case 'scrollLeft':
						height = h;
						width = w;
						marginLeft = w;
							break;
					case 'scrollTop':
						height = h;
						width = w;
						marginTop = h;
							break;
					case 'scrollBottom':
						height = h;
						width = w;
						marginTop = -h;
							break;
					case 'scrollHorz':
						height = h;
						width = w;
						if(vis==0 && slideI==amountSlide-1) {
							marginLeft = -w;
						} else if(vis<slideI  || (vis==amountSlide-1 && slideI==0)) {
							marginLeft = w;
						} else {
							marginLeft = -w;
						}
							break;
					}


				var tApp = $('.cameraappended:eq('+value+')',target);

				if(typeof u !== 'undefined'){
					clearInterval(u);
					clearTimeout(setT);
					setT = setTimeout(canvasLoader,transPeriod+difference);
				}


				if($(pagination).length){
					$('.camera_pag li',wrap).removeClass('cameracurrent');
					$('.camera_pag li',wrap).eq(slideI).addClass('cameracurrent');
				}

				if($(thumbs).length){
					$('li', thumbs).removeClass('cameracurrent');
					$('li', thumbs).eq(slideI).addClass('cameracurrent');
					$('li', thumbs).not('.cameracurrent').find('img').animate({opacity:.5},0);
					$('li.cameracurrent img', thumbs).animate({opacity:1},0);
					$('li', thumbs).hover(function(){
						$('img',this).stop(true,false).animate({opacity:1},150);
					},function(){
						if(!$(this).hasClass('cameracurrent')){
							$('img',this).stop(true,false).animate({opacity:.5},150);
						}
					});
				}


				var easedTime = parseFloat(transPeriod)+parseFloat(difference);

				function cameraeased() {

					$(this).addClass('cameraeased');
					if($('.cameraeased',target).length>=0){
						$(thumbs).css({visibility:'visible'});
					}
					if($('.cameraeased',target).length==blocks){

						thumbnailPos();

						$('.moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom',fakeHover).each(function(){
							$(this).css('visibility','hidden');
						});

						selector.eq(slideI).show().css('z-index','999').removeClass('cameranext').addClass('cameracurrent');
						selector.eq(vis).css('z-index','1').removeClass('cameracurrent');
						$('.cameraContent',fakeHover).eq(slideI).addClass('cameracurrent');
						if (vis >= 0) {
							$('.cameraContent',fakeHover).eq(vis).removeClass('cameracurrent');
						}

						opts.onEndTransition.call(this);

						if($('> div', elem).eq(slideI).attr('data-video')!='hide' && $('.cameraContent.cameracurrent .imgFake',fakeHover).length ){
							$('.cameraContent.cameracurrent .imgFake',fakeHover).click();
						}


						var lMoveIn = selector.eq(slideI).find('.fadeIn').length;
						var lMoveInContent = $('.cameraContent',fakeHover).eq(slideI).find('.moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom').length;

						if (lMoveIn!=0){
							$('.cameraSlide.cameracurrent .fadeIn',fakeHover).each(function(){
								if($(this).attr('data-easing')!=''){
									var easeMove = $(this).attr('data-easing');
								} else {
									var easeMove = easing;
								}
								var t = $(this);
								if(typeof t.attr('data-outerWidth') === 'undefined' || t.attr('data-outerWidth') === false || t.attr('data-outerWidth') === '') {
									var wMoveIn = t.outerWidth();
									t.attr('data-outerWidth',wMoveIn);
								} else {
									var wMoveIn = t.attr('data-outerWidth');
								}
								if(typeof t.attr('data-outerHeight') === 'undefined' || t.attr('data-outerHeight') === false || t.attr('data-outerHeight') === '') {
									var hMoveIn = t.outerHeight();
									t.attr('data-outerHeight',hMoveIn);
								} else {
									var hMoveIn = t.attr('data-outerHeight');
								}
								//t.css('width',wMoveIn);
								var pos = t.position();
								var left = pos.left;
								var top = pos.top;
								var tClass = t.attr('class');
								var ind = t.index();
								var hRel = t.parents('.camerarelative').outerHeight();
								var wRel = t.parents('.camerarelative').outerWidth();
								if(tClass.indexOf("fadeIn") != -1) {
									t.animate({opacity:0},0).css('visibility','visible').delay((time/lMoveIn)*(0.1*(ind-1))).animate({opacity:1},(time/lMoveIn)*0.15,easeMove);
								} else {
									t.css('visibility','visible');
								}
							});
						}

						$('.cameraContent.cameracurrent',fakeHover).show();
						if (lMoveInContent!=0){

							$('.cameraContent.cameracurrent .moveFromLeft, .cameraContent.cameracurrent .moveFromRight, .cameraContent.cameracurrent .moveFromTop, .cameraContent.cameracurrent .moveFromBottom, .cameraContent.cameracurrent .fadeIn, .cameraContent.cameracurrent .fadeFromLeft, .cameraContent.cameracurrent .fadeFromRight, .cameraContent.cameracurrent .fadeFromTop, .cameraContent.cameracurrent .fadeFromBottom',fakeHover).each(function(){
								if($(this).attr('data-easing')!=''){
									var easeMove = $(this).attr('data-easing');
								} else {
									var easeMove = easing;
								}
								var t = $(this);
								var pos = t.position();
								var left = pos.left;
								var top = pos.top;
								var tClass = t.attr('class');
								var ind = t.index();
								var thisH = t.outerHeight();
								if(tClass.indexOf("moveFromLeft") != -1) {
									t.css({'left':'-'+(w)+'px','right':'auto'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left},(time/lMoveInContent)*0.15,easeMove);
								} else if(tClass.indexOf("moveFromRight") != -1) {
									t.css({'left':w+'px','right':'auto'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left},(time/lMoveInContent)*0.15,easeMove);
								} else if(tClass.indexOf("moveFromTop") != -1) {
									t.css({'top':'-'+h+'px','bottom':'auto'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'top':pos.top},(time/lMoveInContent)*0.15,easeMove,function(){
										t.css({top:'auto',bottom:0});
									});
								} else if(tClass.indexOf("moveFromBottom") != -1) {
									t.css({'top':h+'px','bottom':'auto'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'top':pos.top},(time/lMoveInContent)*0.15,easeMove);
								} else if(tClass.indexOf("fadeFromLeft") != -1) {
									t.animate({opacity:0},0).css({'left':'-'+(w)+'px','right':'auto'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left,opacity:1},(time/lMoveInContent)*0.15,easeMove);
								} else if(tClass.indexOf("fadeFromRight") != -1) {
									t.animate({opacity:0},0).css({'left':(w)+'px','right':'auto'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'left':pos.left,opacity:1},(time/lMoveInContent)*0.15,easeMove);
								} else if(tClass.indexOf("fadeFromTop") != -1) {
									t.animate({opacity:0},0).css({'top':'-'+(h)+'px','bottom':'auto'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'top':pos.top,opacity:1},(time/lMoveInContent)*0.15,easeMove,function(){
										t.css({top:'auto',bottom:0});
									});
								} else if(tClass.indexOf("fadeFromBottom") != -1) {
									t.animate({opacity:0},0).css({'bottom':'-'+thisH+'px'});
									t.css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({'bottom':'0',opacity:1},(time/lMoveInContent)*0.15,easeMove);
								} else if(tClass.indexOf("fadeIn") != -1) {
									t.animate({opacity:0},0).css('visibility','visible').delay((time/lMoveInContent)*(0.1*(ind-1))).animate({opacity:1},(time/lMoveInContent)*0.15,easeMove);
								} else {
									t.css('visibility','visible');
								}
							});
						}


						$('.cameraappended',target).remove();
						elem.removeClass('camerasliding');
							selector.eq(vis).hide();
							var barWidth = $('.camera_bar_cont',camera_thumbs_wrap).width(),
								barHeight = $('.camera_bar_cont',camera_thumbs_wrap).height(),
								radSum;
							if (loader != 'pie') {
								radSum = 0.05;
							} else {
								radSum = 0.005;
							}
							$('#'+pieID).animate({opacity:opts.loaderOpacity},200);
							u = setInterval(
								function(){
									if(elem.hasClass('stopped')){
										clearInterval(u);
									}
									if (loader != 'pie') {
										if(rad<=1.002 && !elem.hasClass('stopped') && !elem.hasClass('paused') && !elem.hasClass('hovered')){
											rad = (rad+radSum);
										} else if (rad<=1 && (elem.hasClass('stopped') || elem.hasClass('paused') || elem.hasClass('stopped') || elem.hasClass('hovered'))){
											rad = rad;
										} else {
											if(!elem.hasClass('stopped') && !elem.hasClass('paused') && !elem.hasClass('hovered')) {
												clearInterval(u);
												imgFake();
												$('#'+pieID).animate({opacity:0},200,function(){
													clearTimeout(setT);
													setT = setTimeout(canvasLoader,easedTime);
													nextSlide();
													opts.onStartLoading.call(this);
												});
											}
										}
										switch(barDirection){
											case 'leftToRight':
												$('#'+pieID).animate({'right':barWidth-(barWidth*rad)},(time*radSum),'linear');
												break;
											case 'rightToLeft':
												$('#'+pieID).animate({'left':barWidth-(barWidth*rad)},(time*radSum),'linear');
												break;
											case 'topToBottom':
												$('#'+pieID).animate({'bottom':barHeight-(barHeight*rad)},(time*radSum),'linear');
												break;
											case 'bottomToTop':
												$('#'+pieID).animate({'bottom':barHeight-(barHeight*rad)},(time*radSum),'linear');
												break;
										}

									} else {
										radNew = rad;
										ctx.clearRect(0,0,opts.pieDiameter,opts.pieDiameter);
										ctx.globalCompositeOperation = 'destination-over';
										ctx.beginPath();
										ctx.arc((opts.pieDiameter)/2, (opts.pieDiameter)/2, (opts.pieDiameter)/2-opts.loaderStroke,0,Math.PI*2,false);
										ctx.lineWidth = opts.loaderStroke;
										ctx.strokeStyle = opts.loaderBgColor;
										ctx.stroke();
										ctx.closePath();
										ctx.globalCompositeOperation = 'source-over';
										ctx.beginPath();
										ctx.arc((opts.pieDiameter)/2, (opts.pieDiameter)/2, (opts.pieDiameter)/2-opts.loaderStroke,0,Math.PI*2*radNew,false);
										ctx.lineWidth = opts.loaderStroke-(opts.loaderPadding*2);
										ctx.strokeStyle = opts.loaderColor;
										ctx.stroke();
										ctx.closePath();

										if(rad<=1.002 && !elem.hasClass('stopped') && !elem.hasClass('paused') && !elem.hasClass('hovered')){
											rad = (rad+radSum);
										} else if (rad<=1 && (elem.hasClass('stopped') || elem.hasClass('paused') || elem.hasClass('hovered'))){
											rad = rad;
										} else {
											if(!elem.hasClass('stopped') && !elem.hasClass('paused') && !elem.hasClass('hovered')) {
												clearInterval(u);
												imgFake();
												$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},200,function(){
													clearTimeout(setT);
													setT = setTimeout(canvasLoader,easedTime);
													nextSlide();
													opts.onStartLoading.call(this);
												});
											}
										}
									}
								},time*radSum
							);
						}

				}



				if(fx=='scrollLeft' || fx=='scrollRight' || fx=='scrollTop' || fx=='scrollBottom' || fx=='scrollHorz'){
					opts.onStartTransition.call(this);
					easedTime = 0;
					tApp.delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).css({
							'display' : 'block',
							'height': height,
							'margin-left': marginLeft,
							'margin-top': marginTop,
							'width': width
						}).animate({
							'height': Math.floor((h/rows)+addTop+1),
							'margin-top' : 0,
							'margin-left' : 0,
							'width' : Math.floor((w/cols)+addLeft+1)
						},(transPeriod-difference),easing,cameraeased);
					selector.eq(vis).delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).animate({
							'margin-left': marginLeft*(-1),
							'margin-top': marginTop*(-1)
						},(transPeriod-difference),easing,function(){
							$(this).css({'margin-top' : 0,'margin-left' : 0});
						});
				} else {
					opts.onStartTransition.call(this);
					easedTime = parseFloat(transPeriod)+parseFloat(difference);
					if(slideOn=='next'){
						tApp.delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).css({
								'display' : 'block',
								'height': height,
								'margin-left': marginLeft,
								'margin-top': marginTop,
								'width': width,
								'opacity' : opacityOnGrid
							}).animate({
								'height': Math.floor((h/rows)+addTop+1),
								'margin-top' : 0,
								'margin-left' : 0,
								'opacity' : 1,
								'width' : Math.floor((w/cols)+addLeft+1)
							},(transPeriod-difference),easing,cameraeased);
					} else {
						selector.eq(slideI).show().css('z-index','999').addClass('cameracurrent');
						selector.eq(vis).css('z-index','1').removeClass('cameracurrent');
						$('.cameraContent',fakeHover).eq(slideI).addClass('cameracurrent');
						$('.cameraContent',fakeHover).eq(vis).removeClass('cameracurrent');
						tApp.delay((((transPeriod+difference)/blocks)*delay[index]*couples)*0.5).css({
								'display' : 'block',
								'height': Math.floor((h/rows)+addTop+1),
								'margin-top' : 0,
								'margin-left' : 0,
								'opacity' : 1,
								'width' : Math.floor((w/cols)+addLeft+1)
							}).animate({
								'height': height,
								'margin-left': marginLeft,
								'margin-top': marginTop,
								'width': width,
								'opacity' : opacityOnGrid
							},(transPeriod-difference),easing,cameraeased);
					}
				}





			});




		}
	}


				if($(prevNav).length){
					$(prevNav).click(function(){
						if(!elem.hasClass('camerasliding')){
							var idNum = parseFloat($('.cameraSlide.cameracurrent',target).index());
							clearInterval(u);
							imgFake();
							$('#'+pieID+', .camera_canvas_wrap',wrap).animate({opacity:0},0);
							canvasLoader();
							if(idNum!=0){
								nextSlide(idNum);
							} else {
								nextSlide(amountSlide);
						   }
						   opts.onStartLoading.call(this);
						}
					});
				}

				if($(nextNav).length){
					$(nextNav).click(function(){
						if(!elem.hasClass('camerasliding')){
							var idNum = parseFloat($('.cameraSlide.cameracurrent',target).index());
							clearInterval(u);
							imgFake();
							$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);
							canvasLoader();
							if(idNum==amountSlide-1){
								nextSlide(1);
							} else {
								nextSlide(idNum+2);
						   }
						   opts.onStartLoading.call(this);
						}
					});
				}


				if(isMobile()){
					fakeHover.bind('swipeleft',function(event){
						if(!elem.hasClass('camerasliding')){
							var idNum = parseFloat($('.cameraSlide.cameracurrent',target).index());
							clearInterval(u);
							imgFake();
							$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);
							canvasLoader();
							if(idNum==amountSlide-1){
								nextSlide(1);
							} else {
								nextSlide(idNum+2);
						   }
						   opts.onStartLoading.call(this);
						}
					});
					fakeHover.bind('swiperight',function(event){
						if(!elem.hasClass('camerasliding')){
							var idNum = parseFloat($('.cameraSlide.cameracurrent',target).index());
							clearInterval(u);
							imgFake();
							$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);
							canvasLoader();
							if(idNum!=0){
								nextSlide(idNum);
							} else {
								nextSlide(amountSlide);
						   }
						   opts.onStartLoading.call(this);
						}
					});
				}

				if($(pagination).length){
					$('.camera_pag li',wrap).click(function(){
						if(!elem.hasClass('camerasliding')){
							var idNum = parseFloat($(this).index());
							var curNum = parseFloat($('.cameraSlide.cameracurrent',target).index());
							if(idNum!=curNum) {
								clearInterval(u);
								imgFake();
								$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);
								canvasLoader();
								nextSlide(idNum+1);
								opts.onStartLoading.call(this);
							}
						}
					});
				}

				if($(thumbs).length) {

					$('.pix_thumb img',thumbs).click(function(){
						if(!elem.hasClass('camerasliding')){
							var idNum = parseFloat($(this).parents('li').index());
							var curNum = parseFloat($('.cameracurrent',target).index());
							if(idNum!=curNum) {
								clearInterval(u);
								imgFake();
								$('#'+pieID+', .camera_canvas_wrap',camera_thumbs_wrap).animate({opacity:0},0);
								$('.pix_thumb',thumbs).removeClass('cameracurrent');
								$(this).parents('li').addClass('cameracurrent');
								canvasLoader();
								nextSlide(idNum+1);
								thumbnailPos();
								opts.onStartLoading.call(this);
							}
						}
					});

					$('.camera_thumbs_cont .camera_prevThumbs',camera_thumbs_wrap).hover(function(){
						$(this).stop(true,false).animate({opacity:1},250);
					},function(){
						$(this).stop(true,false).animate({opacity:.7},250);
					});
					$('.camera_prevThumbs',camera_thumbs_wrap).click(function(){
						var sum = 0,
							wTh = $(thumbs).outerWidth(),
							offUl = $('ul', thumbs).offset().left,
							offDiv = $('> div', thumbs).offset().left,
							ulLeft = offDiv-offUl;
							$('.camera_visThumb',thumbs).each(function(){
								var tW = $(this).outerWidth();
								sum = sum+tW;
							});
							if(ulLeft-sum>0){
								$('ul', thumbs).animate({'margin-left':'-'+(ulLeft-sum)+'px'},500,thumbnailVisible);
							} else {
								$('ul', thumbs).animate({'margin-left':0},500,thumbnailVisible);
							}
					});

					$('.camera_thumbs_cont .camera_nextThumbs',camera_thumbs_wrap).hover(function(){
						$(this).stop(true,false).animate({opacity:1},250);
					},function(){
						$(this).stop(true,false).animate({opacity:.7},250);
					});
					$('.camera_nextThumbs',camera_thumbs_wrap).click(function(){
						var sum = 0,
							wTh = $(thumbs).outerWidth(),
							ulW = $('ul', thumbs).outerWidth(),
							offUl = $('ul', thumbs).offset().left,
							offDiv = $('> div', thumbs).offset().left,
							ulLeft = offDiv-offUl;
							$('.camera_visThumb',thumbs).each(function(){
								var tW = $(this).outerWidth();
								sum = sum+tW;
							});
							if(ulLeft+sum+sum<ulW){
								$('ul', thumbs).animate({'margin-left':'-'+(ulLeft+sum)+'px'},500,thumbnailVisible);
							} else {
								$('ul', thumbs).animate({'margin-left':'-'+(ulW-wTh)+'px'},500,thumbnailVisible);
							}
					});

				}



}

})(jQuery);

;(function($){$.fn.cameraStop = function() {
	var wrap = $(this),
		elem = $('.camera_src',wrap),
		pieID = 'pie_'+wrap.index();
	elem.addClass('stopped');
	if($('.camera_showcommands').length) {
		var camera_thumbs_wrap = $('.camera_thumbs_wrap',wrap);
	} else {
		var camera_thumbs_wrap = wrap;
	}
}
})(jQuery);

;(function($){$.fn.cameraPause = function() {
	var wrap = $(this);
	var elem = $('.camera_src',wrap);
	elem.addClass('paused');
}
})(jQuery);

;(function($){$.fn.cameraResume = function() {
	var wrap = $(this);
	var elem = $('.camera_src',wrap);
	if(typeof autoAdv === 'undefined' || autoAdv!==true){
		elem.removeClass('paused');
	}
}
})(jQuery);

/*!
 * Bootstrap v3.2.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
 if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); +
 function(a) {
     "use strict";
     function b() {
         var a = document.createElement("bootstrap"),
         b = {
             WebkitTransition: "webkitTransitionEnd",
             MozTransition: "transitionend",
             OTransition: "oTransitionEnd otransitionend",
             transition: "transitionend"
         };
         for (var c in b) if (void 0 !== a.style[c]) return {
             end: b[c]
         };
         return ! 1
     }
     a.fn.emulateTransitionEnd = function(b) {
         var c = !1,
         d = this;
         a(this).one("bsTransitionEnd",
         function() {
             c = !0
         });
         var e = function() {
             c || a(d).trigger(a.support.transition.end)
         };
         return setTimeout(e, b),
         this
     },
     a(function() {
         a.support.transition = b(),
         a.support.transition && (a.event.special.bsTransitionEnd = {
             bindType: a.support.transition.end,
             delegateType: a.support.transition.end,
             handle: function(b) {
                 return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
             }
         })
     })
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var c = a(this),
             e = c.data("bs.alert");
             e || c.data("bs.alert", e = new d(this)),
             "string" == typeof b && e[b].call(c)
         })
     }
     var c = '[data-dismiss="alert"]',
     d = function(b) {
         a(b).on("click", c, this.close)
     };
     d.VERSION = "3.2.0",
     d.prototype.close = function(b) {
         function c() {
             f.detach().trigger("closed.bs.alert").remove()
         }
         var d = a(this),
         e = d.attr("data-target");
         e || (e = d.attr("href"), e = e && e.replace(/.*(?=#[^\s]*$)/, ""));
         var f = a(e);
         b && b.preventDefault(),
         f.length || (f = d.hasClass("alert") ? d: d.parent()),
         f.trigger(b = a.Event("close.bs.alert")),
         b.isDefaultPrevented() || (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", c).emulateTransitionEnd(150) : c())
     };
     var e = a.fn.alert;
     a.fn.alert = b,
     a.fn.alert.Constructor = d,
     a.fn.alert.noConflict = function() {
         return a.fn.alert = e,
         this
     },
     a(document).on("click.bs.alert.data-api", c, d.prototype.close)
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.button"),
             f = "object" == typeof b && b;
             e || d.data("bs.button", e = new c(this, f)),
             "toggle" == b ? e.toggle() : b && e.setState(b)
         })
     }
     var c = function(b, d) {
         this.$element = a(b),
         this.options = a.extend({},
         c.DEFAULTS, d),
         this.isLoading = !1
     };
     c.VERSION = "3.2.0",
     c.DEFAULTS = {
         loadingText: "loading..."
     },
     c.prototype.setState = function(b) {
         var c = "disabled",
         d = this.$element,
         e = d.is("input") ? "val": "html",
         f = d.data();
         b += "Text",
         null == f.resetText && d.data("resetText", d[e]()),
         d[e](null == f[b] ? this.options[b] : f[b]),
         setTimeout(a.proxy(function() {
             "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
         },
         this), 0)
     },
     c.prototype.toggle = function() {
         var a = !0,
         b = this.$element.closest('[data-toggle="buttons"]');
         if (b.length) {
             var c = this.$element.find("input");
             "radio" == c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? a = !1 : b.find(".active").removeClass("active")),
             a && c.prop("checked", !this.$element.hasClass("active")).trigger("change")
         }
         a && this.$element.toggleClass("active")
     };
     var d = a.fn.button;
     a.fn.button = b,
     a.fn.button.Constructor = c,
     a.fn.button.noConflict = function() {
         return a.fn.button = d,
         this
     },
     a(document).on("click.bs.button.data-api", '[data-toggle^="button"]',
     function(c) {
         var d = a(c.target);
         d.hasClass("btn") || (d = d.closest(".btn")),
         b.call(d, "toggle"),
         c.preventDefault()
     })
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.carousel"),
             f = a.extend({},
             c.DEFAULTS, d.data(), "object" == typeof b && b),
             g = "string" == typeof b ? b: f.slide;
             e || d.data("bs.carousel", e = new c(this, f)),
             "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
         })
     }
     var c = function(b, c) {
         this.$element = a(b).on("keydown.bs.carousel", a.proxy(this.keydown, this)),
         this.$indicators = this.$element.find(".carousel-indicators"),
         this.options = c,
         this.paused = this.sliding = this.interval = this.$active = this.$items = null,
         "hover" == this.options.pause && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
     };
     c.VERSION = "3.2.0",
     c.DEFAULTS = {
         interval: 5e3,
         pause: "hover",
         wrap: !0
     },
     c.prototype.keydown = function(a) {
         switch (a.which) {
         case 37:
             this.prev();
             break;
         case 39:
             this.next();
             break;
         default:
             return
         }
         a.preventDefault()
     },
     c.prototype.cycle = function(b) {
         return b || (this.paused = !1),
         this.interval && clearInterval(this.interval),
         this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)),
         this
     },
     c.prototype.getItemIndex = function(a) {
         return this.$items = a.parent().children(".item"),
         this.$items.index(a || this.$active)
     },
     c.prototype.to = function(b) {
         var c = this,
         d = this.getItemIndex(this.$active = this.$element.find(".item.active"));
         return b > this.$items.length - 1 || 0 > b ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel",
         function() {
             c.to(b)
         }) : d == b ? this.pause().cycle() : this.slide(b > d ? "next": "prev", a(this.$items[b]))
     },
     c.prototype.pause = function(b) {
         return b || (this.paused = !0),
         this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)),
         this.interval = clearInterval(this.interval),
         this
     },
     c.prototype.next = function() {
         return this.sliding ? void 0 : this.slide("next")
     },
     c.prototype.prev = function() {
         return this.sliding ? void 0 : this.slide("prev")
     },
     c.prototype.slide = function(b, c) {
         var d = this.$element.find(".item.active"),
         e = c || d[b](),
         f = this.interval,
         g = "next" == b ? "left": "right",
         h = "next" == b ? "first": "last",
         i = this;
         if (!e.length) {
             if (!this.options.wrap) return;
             e = this.$element.find(".item")[h]()
         }
         if (e.hasClass("active")) return this.sliding = !1;
         var j = e[0],
         k = a.Event("slide.bs.carousel", {
             relatedTarget: j,
             direction: g
         });
         if (this.$element.trigger(k), !k.isDefaultPrevented()) {
             if (this.sliding = !0, f && this.pause(), this.$indicators.length) {
                 this.$indicators.find(".active").removeClass("active");
                 var l = a(this.$indicators.children()[this.getItemIndex(e)]);
                 l && l.addClass("active")
             }
             var m = a.Event("slid.bs.carousel", {
                 relatedTarget: j,
                 direction: g
             });
             return a.support.transition && this.$element.hasClass("slide") ? (e.addClass(b), e[0].offsetWidth, d.addClass(g), e.addClass(g), d.one("bsTransitionEnd",
             function() {
                 e.removeClass([b, g].join(" ")).addClass("active"),
                 d.removeClass(["active", g].join(" ")),
                 i.sliding = !1,
                 setTimeout(function() {
                     i.$element.trigger(m)
                 },
                 0)
             }).emulateTransitionEnd(1e3 * d.css("transition-duration").slice(0, -1))) : (d.removeClass("active"), e.addClass("active"), this.sliding = !1, this.$element.trigger(m)),
             f && this.cycle(),
             this
         }
     };
     var d = a.fn.carousel;
     a.fn.carousel = b,
     a.fn.carousel.Constructor = c,
     a.fn.carousel.noConflict = function() {
         return a.fn.carousel = d,
         this
     },
     a(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]",
     function(c) {
         var d, e = a(this),
         f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
         if (f.hasClass("carousel")) {
             var g = a.extend({},
             f.data(), e.data()),
             h = e.attr("data-slide-to");
             h && (g.interval = !1),
             b.call(f, g),
             h && f.data("bs.carousel").to(h),
             c.preventDefault()
         }
     }),
     a(window).on("load",
     function() {
         a('[data-ride="carousel"]').each(function() {
             var c = a(this);
             b.call(c, c.data())
         })
     })
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.collapse"),
             f = a.extend({},
             c.DEFAULTS, d.data(), "object" == typeof b && b); ! e && f.toggle && "show" == b && (b = !b),
             e || d.data("bs.collapse", e = new c(this, f)),
             "string" == typeof b && e[b]()
         })
     }
     var c = function(b, d) {
         this.$element = a(b),
         this.options = a.extend({},
         c.DEFAULTS, d),
         this.transitioning = null,
         this.options.parent && (this.$parent = a(this.options.parent)),
         this.options.toggle && this.toggle()
     };
     c.VERSION = "3.2.0",
     c.DEFAULTS = {
         toggle: !0
     },
     c.prototype.dimension = function() {
         var a = this.$element.hasClass("width");
         return a ? "width": "height"
     },
     c.prototype.show = function() {
         if (!this.transitioning && !this.$element.hasClass("in")) {
             var c = a.Event("show.bs.collapse");
             if (this.$element.trigger(c), !c.isDefaultPrevented()) {
                 var d = this.$parent && this.$parent.find("> .panel > .in");
                 if (d && d.length) {
                     var e = d.data("bs.collapse");
                     if (e && e.transitioning) return;
                     b.call(d, "hide"),
                     e || d.data("bs.collapse", null)
                 }
                 var f = this.dimension();
                 this.$element.removeClass("collapse").addClass("collapsing")[f](0),
                 this.transitioning = 1;
                 var g = function() {
                     this.$element.removeClass("collapsing").addClass("collapse in")[f](""),
                     this.transitioning = 0,
                     this.$element.trigger("shown.bs.collapse")
                 };
                 if (!a.support.transition) return g.call(this);
                 var h = a.camelCase(["scroll", f].join("-"));
                 this.$element.one("bsTransitionEnd", a.proxy(g, this)).emulateTransitionEnd(350)[f](this.$element[0][h])
             }
         }
     },
     c.prototype.hide = function() {
         if (!this.transitioning && this.$element.hasClass("in")) {
             var b = a.Event("hide.bs.collapse");
             if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                 var c = this.dimension();
                 this.$element[c](this.$element[c]())[0].offsetHeight,
                 this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),
                 this.transitioning = 1;
                 var d = function() {
                     this.transitioning = 0,
                     this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")
                 };
                 return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(d, this)).emulateTransitionEnd(350) : d.call(this)
             }
         }
     },
     c.prototype.toggle = function() {
         this[this.$element.hasClass("in") ? "hide": "show"]()
     };
     var d = a.fn.collapse;
     a.fn.collapse = b,
     a.fn.collapse.Constructor = c,
     a.fn.collapse.noConflict = function() {
         return a.fn.collapse = d,
         this
     },
     a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]',
     function(c) {
         var d, e = a(this),
         f = e.attr("data-target") || c.preventDefault() || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""),
         g = a(f),
         h = g.data("bs.collapse"),
         i = h ? "toggle": e.data(),
         j = e.attr("data-parent"),
         k = j && a(j);
         h && h.transitioning || (k && k.find('[data-toggle="collapse"][data-parent="' + j + '"]').not(e).addClass("collapsed"), e[g.hasClass("in") ? "addClass": "removeClass"]("collapsed")),
         b.call(g, i)
     })
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         b && 3 === b.which || (a(e).remove(), a(f).each(function() {
             var d = c(a(this)),
             e = {
                 relatedTarget: this
             };
             d.hasClass("open") && (d.trigger(b = a.Event("hide.bs.dropdown", e)), b.isDefaultPrevented() || d.removeClass("open").trigger("hidden.bs.dropdown", e))
         }))
     }
     function c(b) {
         var c = b.attr("data-target");
         c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
         var d = c && a(c);
         return d && d.length ? d: b.parent()
     }
     function d(b) {
         return this.each(function() {
             var c = a(this),
             d = c.data("bs.dropdown");
             d || c.data("bs.dropdown", d = new g(this)),
             "string" == typeof b && d[b].call(c)
         })
     }
     var e = ".dropdown-backdrop",
     f = '[data-toggle="dropdown"]',
     g = function(b) {
         a(b).on("click.bs.dropdown", this.toggle)
     };
     g.VERSION = "3.2.0",
     g.prototype.toggle = function(d) {
         var e = a(this);
         if (!e.is(".disabled, :disabled")) {
             var f = c(e),
             g = f.hasClass("open");
             if (b(), !g) {
                 "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b);
                 var h = {
                     relatedTarget: this
                 };
                 if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;
                 e.trigger("focus"),
                 f.toggleClass("open").trigger("shown.bs.dropdown", h)
             }
             return ! 1
         }
     },
     g.prototype.keydown = function(b) {
         if (/(38|40|27)/.test(b.keyCode)) {
             var d = a(this);
             if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
                 var e = c(d),
                 g = e.hasClass("open");
                 if (!g || g && 27 == b.keyCode) return 27 == b.which && e.find(f).trigger("focus"),
                 d.trigger("click");
                 var h = " li:not(.divider):visible a",
                 i = e.find('[role="menu"]' + h + ', [role="listbox"]' + h);
                 if (i.length) {
                     var j = i.index(i.filter(":focus"));
                     38 == b.keyCode && j > 0 && j--,
                     40 == b.keyCode && j < i.length - 1 && j++,
                     ~j || (j = 0),
                     i.eq(j).trigger("focus")
                 }
             }
         }
     };
     var h = a.fn.dropdown;
     a.fn.dropdown = d,
     a.fn.dropdown.Constructor = g,
     a.fn.dropdown.noConflict = function() {
         return a.fn.dropdown = h,
         this
     },
     a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form",
     function(a) {
         a.stopPropagation()
     }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f + ', [role="menu"], [role="listbox"]', g.prototype.keydown)
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b, d) {
         return this.each(function() {
             var e = a(this),
             f = e.data("bs.modal"),
             g = a.extend({},
             c.DEFAULTS, e.data(), "object" == typeof b && b);
             f || e.data("bs.modal", f = new c(this, g)),
             "string" == typeof b ? f[b](d) : g.show && f.show(d)
         })
     }
     var c = function(b, c) {
         this.options = c,
         this.$body = a(document.body),
         this.$element = a(b),
         this.$backdrop = this.isShown = null,
         this.scrollbarWidth = 0,
         this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
             this.$element.trigger("loaded.bs.modal")
         },
         this))
     };
     c.VERSION = "3.2.0",
     c.DEFAULTS = {
         backdrop: !0,
         keyboard: !0,
         show: !0
     },
     c.prototype.toggle = function(a) {
         return this.isShown ? this.hide() : this.show(a)
     },
     c.prototype.show = function(b) {
         var c = this,
         d = a.Event("show.bs.modal", {
             relatedTarget: b
         });
         this.$element.trigger(d),
         this.isShown || d.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.$body.addClass("modal-open"), this.setScrollbar(), this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function() {
             var d = a.support.transition && c.$element.hasClass("fade");
             c.$element.parent().length || c.$element.appendTo(c.$body),
             c.$element.show().scrollTop(0),
             d && c.$element[0].offsetWidth,
             c.$element.addClass("in").attr("aria-hidden", !1),
             c.enforceFocus();
             var e = a.Event("shown.bs.modal", {
                 relatedTarget: b
             });
             d ? c.$element.find(".modal-dialog").one("bsTransitionEnd",
             function() {
                 c.$element.trigger("focus").trigger(e)
             }).emulateTransitionEnd(300) : c.$element.trigger("focus").trigger(e)
         }))
     },
     c.prototype.hide = function(b) {
         b && b.preventDefault(),
         b = a.Event("hide.bs.modal"),
         this.$element.trigger(b),
         this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.$body.removeClass("modal-open"), this.resetScrollbar(), this.escape(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
     },
     c.prototype.enforceFocus = function() {
         a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
             this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
         },
         this))
     },
     c.prototype.escape = function() {
         this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", a.proxy(function(a) {
             27 == a.which && this.hide()
         },
         this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
     },
     c.prototype.hideModal = function() {
         var a = this;
         this.$element.hide(),
         this.backdrop(function() {
             a.$element.trigger("hidden.bs.modal")
         })
     },
     c.prototype.removeBackdrop = function() {
         this.$backdrop && this.$backdrop.remove(),
         this.$backdrop = null
     },
     c.prototype.backdrop = function(b) {
         var c = this,
         d = this.$element.hasClass("fade") ? "fade": "";
         if (this.isShown && this.options.backdrop) {
             var e = a.support.transition && d;
             if (this.$backdrop = a('<div class="modal-backdrop ' + d + '" />').appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function(a) {
                 a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
             },
             this)), e && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
             e ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(150) : b()
         } else if (!this.isShown && this.$backdrop) {
             this.$backdrop.removeClass("in");
             var f = function() {
                 c.removeBackdrop(),
                 b && b()
             };
             a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", f).emulateTransitionEnd(150) : f()
         } else b && b()
     },
     c.prototype.checkScrollbar = function() {
         document.body.clientWidth >= window.innerWidth || (this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar())
     },
     c.prototype.setScrollbar = function() {
         var a = parseInt(this.$body.css("padding-right") || 0, 10);
         this.scrollbarWidth && this.$body.css("padding-right", a + this.scrollbarWidth)
     },
     c.prototype.resetScrollbar = function() {
         this.$body.css("padding-right", "")
     },
     c.prototype.measureScrollbar = function() {
         var a = document.createElement("div");
         a.className = "modal-scrollbar-measure",
         this.$body.append(a);
         var b = a.offsetWidth - a.clientWidth;
         return this.$body[0].removeChild(a),
         b
     };
     var d = a.fn.modal;
     a.fn.modal = b,
     a.fn.modal.Constructor = c,
     a.fn.modal.noConflict = function() {
         return a.fn.modal = d,
         this
     },
     a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]',
     function(c) {
         var d = a(this),
         e = d.attr("href"),
         f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
         g = f.data("bs.modal") ? "toggle": a.extend({
             remote: !/#/.test(e) && e
         },
         f.data(), d.data());
         d.is("a") && c.preventDefault(),
         f.one("show.bs.modal",
         function(a) {
             a.isDefaultPrevented() || f.one("hidden.bs.modal",
             function() {
                 d.is(":visible") && d.trigger("focus")
             })
         }),
         b.call(f, g, this)
     })
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.tooltip"),
             f = "object" == typeof b && b; (e || "destroy" != b) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
         })
     }
     var c = function(a, b) {
         this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null,
         this.init("tooltip", a, b)
     };
     c.VERSION = "3.2.0",
     c.DEFAULTS = {
         animation: !0,
         placement: "top",
         selector: !1,
         template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
         trigger: "hover focus",
         title: "",
         delay: 0,
         html: !1,
         container: !1,
         viewport: {
             selector: "body",
             padding: 0
         }
     },
     c.prototype.init = function(b, c, d) {
         this.enabled = !0,
         this.type = b,
         this.$element = a(c),
         this.options = this.getOptions(d),
         this.$viewport = this.options.viewport && a(this.options.viewport.selector || this.options.viewport);
         for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
             var g = e[f];
             if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
             else if ("manual" != g) {
                 var h = "hover" == g ? "mouseenter": "focusin",
                 i = "hover" == g ? "mouseleave": "focusout";
                 this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)),
                 this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
             }
         }
         this.options.selector ? this._options = a.extend({},
         this.options, {
             trigger: "manual",
             selector: ""
         }) : this.fixTitle()
     },
     c.prototype.getDefaults = function() {
         return c.DEFAULTS
     },
     c.prototype.getOptions = function(b) {
         return b = a.extend({},
         this.getDefaults(), this.$element.data(), b),
         b.delay && "number" == typeof b.delay && (b.delay = {
             show: b.delay,
             hide: b.delay
         }),
         b
     },
     c.prototype.getDelegateOptions = function() {
         var b = {},
         c = this.getDefaults();
         return this._options && a.each(this._options,
         function(a, d) {
             c[a] != d && (b[a] = d)
         }),
         b
     },
     c.prototype.enter = function(b) {
         var c = b instanceof this.constructor ? b: a(b.currentTarget).data("bs." + this.type);
         return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)),
         clearTimeout(c.timeout),
         c.hoverState = "in",
         c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function() {
             "in" == c.hoverState && c.show()
         },
         c.options.delay.show)) : c.show()
     },
     c.prototype.leave = function(b) {
         var c = b instanceof this.constructor ? b: a(b.currentTarget).data("bs." + this.type);
         return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)),
         clearTimeout(c.timeout),
         c.hoverState = "out",
         c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function() {
             "out" == c.hoverState && c.hide()
         },
         c.options.delay.hide)) : c.hide()
     },
     c.prototype.show = function() {
         var b = a.Event("show.bs." + this.type);
         if (this.hasContent() && this.enabled) {
             this.$element.trigger(b);
             var c = a.contains(document.documentElement, this.$element[0]);
             if (b.isDefaultPrevented() || !c) return;
             var d = this,
             e = this.tip(),
             f = this.getUID(this.type);
             this.setContent(),
             e.attr("id", f),
             this.$element.attr("aria-describedby", f),
             this.options.animation && e.addClass("fade");
             var g = "function" == typeof this.options.placement ? this.options.placement.call(this, e[0], this.$element[0]) : this.options.placement,
             h = /\s?auto?\s?/i,
             i = h.test(g);
             i && (g = g.replace(h, "") || "top"),
             e.detach().css({
                 top: 0,
                 left: 0,
                 display: "block"
             }).addClass(g).data("bs." + this.type, this),
             this.options.container ? e.appendTo(this.options.container) : e.insertAfter(this.$element);
             var j = this.getPosition(),
             k = e[0].offsetWidth,
             l = e[0].offsetHeight;
             if (i) {
                 var m = g,
                 n = this.$element.parent(),
                 o = this.getPosition(n);
                 g = "bottom" == g && j.top + j.height + l - o.scroll > o.height ? "top": "top" == g && j.top - o.scroll - l < 0 ? "bottom": "right" == g && j.right + k > o.width ? "left": "left" == g && j.left - k < o.left ? "right": g,
                 e.removeClass(m).addClass(g)
             }
             var p = this.getCalculatedOffset(g, j, k, l);
             this.applyPlacement(p, g);
             var q = function() {
                 d.$element.trigger("shown.bs." + d.type),
                 d.hoverState = null
             };
             a.support.transition && this.$tip.hasClass("fade") ? e.one("bsTransitionEnd", q).emulateTransitionEnd(150) : q()
         }
     },
     c.prototype.applyPlacement = function(b, c) {
         var d = this.tip(),
         e = d[0].offsetWidth,
         f = d[0].offsetHeight,
         g = parseInt(d.css("margin-top"), 10),
         h = parseInt(d.css("margin-left"), 10);
         isNaN(g) && (g = 0),
         isNaN(h) && (h = 0),
         b.top = b.top + g,
         b.left = b.left + h,
         a.offset.setOffset(d[0], a.extend({
             using: function(a) {
                 d.css({
                     top: Math.round(a.top),
                     left: Math.round(a.left)
                 })
             }
         },
         b), 0),
         d.addClass("in");
         var i = d[0].offsetWidth,
         j = d[0].offsetHeight;
         "top" == c && j != f && (b.top = b.top + f - j);
         var k = this.getViewportAdjustedDelta(c, b, i, j);
         k.left ? b.left += k.left: b.top += k.top;
         var l = k.left ? 2 * k.left - e + i: 2 * k.top - f + j,
         m = k.left ? "left": "top",
         n = k.left ? "offsetWidth": "offsetHeight";
         d.offset(b),
         this.replaceArrow(l, d[0][n], m)
     },
     c.prototype.replaceArrow = function(a, b, c) {
         this.arrow().css(c, a ? 50 * (1 - a / b) + "%": "")
     },
     c.prototype.setContent = function() {
         var a = this.tip(),
         b = this.getTitle();
         a.find(".tooltip-inner")[this.options.html ? "html": "text"](b),
         a.removeClass("fade in top bottom left right")
     },
     c.prototype.hide = function() {
         function b() {
             "in" != c.hoverState && d.detach(),
             c.$element.trigger("hidden.bs." + c.type)
         }
         var c = this,
         d = this.tip(),
         e = a.Event("hide.bs." + this.type);
         return this.$element.removeAttr("aria-describedby"),
         this.$element.trigger(e),
         e.isDefaultPrevented() ? void 0 : (d.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? d.one("bsTransitionEnd", b).emulateTransitionEnd(150) : b(), this.hoverState = null, this)
     },
     c.prototype.fixTitle = function() {
         var a = this.$element; (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
     },
     c.prototype.hasContent = function() {
         return this.getTitle()
     },
     c.prototype.getPosition = function(b) {
         b = b || this.$element;
         var c = b[0],
         d = "BODY" == c.tagName;
         return a.extend({},
         "function" == typeof c.getBoundingClientRect ? c.getBoundingClientRect() : null, {
             scroll: d ? document.documentElement.scrollTop || document.body.scrollTop: b.scrollTop(),
             width: d ? a(window).width() : b.outerWidth(),
             height: d ? a(window).height() : b.outerHeight()
         },
         d ? {
             top: 0,
             left: 0
         }: b.offset())
     },
     c.prototype.getCalculatedOffset = function(a, b, c, d) {
         return "bottom" == a ? {
             top: b.top + b.height,
             left: b.left + b.width / 2 - c / 2
         }: "top" == a ? {
             top: b.top - d,
             left: b.left + b.width / 2 - c / 2
         }: "left" == a ? {
             top: b.top + b.height / 2 - d / 2,
             left: b.left - c
         }: {
             top: b.top + b.height / 2 - d / 2,
             left: b.left + b.width
         }
     },
     c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
         var e = {
             top: 0,
             left: 0
         };
         if (!this.$viewport) return e;
         var f = this.options.viewport && this.options.viewport.padding || 0,
         g = this.getPosition(this.$viewport);
         if (/right|left/.test(a)) {
             var h = b.top - f - g.scroll,
             i = b.top + f - g.scroll + d;
             h < g.top ? e.top = g.top - h: i > g.top + g.height && (e.top = g.top + g.height - i)
         } else {
             var j = b.left - f,
             k = b.left + f + c;
             j < g.left ? e.left = g.left - j: k > g.width && (e.left = g.left + g.width - k)
         }
         return e
     },
     c.prototype.getTitle = function() {
         var a, b = this.$element,
         c = this.options;
         return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
     },
     c.prototype.getUID = function(a) {
         do a += ~~ (1e6 * Math.random());
         while (document.getElementById(a));
         return a
     },
     c.prototype.tip = function() {
         return this.$tip = this.$tip || a(this.options.template)
     },
     c.prototype.arrow = function() {
         return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
     },
     c.prototype.validate = function() {
         this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
     },
     c.prototype.enable = function() {
         this.enabled = !0
     },
     c.prototype.disable = function() {
         this.enabled = !1
     },
     c.prototype.toggleEnabled = function() {
         this.enabled = !this.enabled
     },
     c.prototype.toggle = function(b) {
         var c = this;
         b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))),
         c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
     },
     c.prototype.destroy = function() {
         clearTimeout(this.timeout),
         this.hide().$element.off("." + this.type).removeData("bs." + this.type)
     };
     var d = a.fn.tooltip;
     a.fn.tooltip = b,
     a.fn.tooltip.Constructor = c,
     a.fn.tooltip.noConflict = function() {
         return a.fn.tooltip = d,
         this
     }
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.popover"),
             f = "object" == typeof b && b; (e || "destroy" != b) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
         })
     }
     var c = function(a, b) {
         this.init("popover", a, b)
     };
     if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
     c.VERSION = "3.2.0",
     c.DEFAULTS = a.extend({},
     a.fn.tooltip.Constructor.DEFAULTS, {
         placement: "right",
         trigger: "click",
         content: "",
         template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
     }),
     c.prototype = a.extend({},
     a.fn.tooltip.Constructor.prototype),
     c.prototype.constructor = c,
     c.prototype.getDefaults = function() {
         return c.DEFAULTS
     },
     c.prototype.setContent = function() {
         var a = this.tip(),
         b = this.getTitle(),
         c = this.getContent();
         a.find(".popover-title")[this.options.html ? "html": "text"](b),
         a.find(".popover-content").empty()[this.options.html ? "string" == typeof c ? "html": "append": "text"](c),
         a.removeClass("fade top bottom left right in"),
         a.find(".popover-title").html() || a.find(".popover-title").hide()
     },
     c.prototype.hasContent = function() {
         return this.getTitle() || this.getContent()
     },
     c.prototype.getContent = function() {
         var a = this.$element,
         b = this.options;
         return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
     },
     c.prototype.arrow = function() {
         return this.$arrow = this.$arrow || this.tip().find(".arrow")
     },
     c.prototype.tip = function() {
         return this.$tip || (this.$tip = a(this.options.template)),
         this.$tip
     };
     var d = a.fn.popover;
     a.fn.popover = b,
     a.fn.popover.Constructor = c,
     a.fn.popover.noConflict = function() {
         return a.fn.popover = d,
         this
     }
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(c, d) {
         var e = a.proxy(this.process, this);
         this.$body = a("body"),
         this.$scrollElement = a(a(c).is("body") ? window: c),
         this.options = a.extend({},
         b.DEFAULTS, d),
         this.selector = (this.options.target || "") + " .nav li > a",
         this.offsets = [],
         this.targets = [],
         this.activeTarget = null,
         this.scrollHeight = 0,
         this.$scrollElement.on("scroll.bs.scrollspy", e),
         this.refresh(),
         this.process()
     }
     function c(c) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.scrollspy"),
             f = "object" == typeof c && c;
             e || d.data("bs.scrollspy", e = new b(this, f)),
             "string" == typeof c && e[c]()
         })
     }
     b.VERSION = "3.2.0",
     b.DEFAULTS = {
         offset: 10
     },
     b.prototype.getScrollHeight = function() {
         return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
     },
     b.prototype.refresh = function() {
         var b = "offset",
         c = 0;
         a.isWindow(this.$scrollElement[0]) || (b = "position", c = this.$scrollElement.scrollTop()),
         this.offsets = [],
         this.targets = [],
         this.scrollHeight = this.getScrollHeight();
         var d = this;
         this.$body.find(this.selector).map(function() {
             var d = a(this),
             e = d.data("target") || d.attr("href"),
             f = /^#./.test(e) && a(e);
             return f && f.length && f.is(":visible") && [[f[b]().top + c, e]] || null
         }).sort(function(a, b) {
             return a[0] - b[0]
         }).each(function() {
             d.offsets.push(this[0]),
             d.targets.push(this[1])
         })
     },
     b.prototype.process = function() {
         var a, b = this.$scrollElement.scrollTop() + this.options.offset,
         c = this.getScrollHeight(),
         d = this.options.offset + c - this.$scrollElement.height(),
         e = this.offsets,
         f = this.targets,
         g = this.activeTarget;
         if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
         if (g && b <= e[0]) return g != (a = f[0]) && this.activate(a);
         for (a = e.length; a--;) g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a])
     },
     b.prototype.activate = function(b) {
         this.activeTarget = b,
         a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
         var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
         d = a(c).parents("li").addClass("active");
         d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")),
         d.trigger("activate.bs.scrollspy")
     };
     var d = a.fn.scrollspy;
     a.fn.scrollspy = c,
     a.fn.scrollspy.Constructor = b,
     a.fn.scrollspy.noConflict = function() {
         return a.fn.scrollspy = d,
         this
     },
     a(window).on("load.bs.scrollspy.data-api",
     function() {
         a('[data-spy="scroll"]').each(function() {
             var b = a(this);
             c.call(b, b.data())
         })
     })
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.tab");
             e || d.data("bs.tab", e = new c(this)),
             "string" == typeof b && e[b]()
         })
     }
     var c = function(b) {
         this.element = a(b)
     };
     c.VERSION = "3.2.0",
     c.prototype.show = function() {
         var b = this.element,
         c = b.closest("ul:not(.dropdown-menu)"),
         d = b.data("target");
         if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
             var e = c.find(".active:last a")[0],
             f = a.Event("show.bs.tab", {
                 relatedTarget: e
             });
             if (b.trigger(f), !f.isDefaultPrevented()) {
                 var g = a(d);
                 this.activate(b.closest("li"), c),
                 this.activate(g, g.parent(),
                 function() {
                     b.trigger({
                         type: "shown.bs.tab",
                         relatedTarget: e
                     })
                 })
             }
         }
     },
     c.prototype.activate = function(b, c, d) {
         function e() {
             f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),
             b.addClass("active"),
             g ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"),
             b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active"),
             d && d()
         }
         var f = c.find("> .active"),
         g = d && a.support.transition && f.hasClass("fade");
         g ? f.one("bsTransitionEnd", e).emulateTransitionEnd(150) : e(),
         f.removeClass("in")
     };
     var d = a.fn.tab;
     a.fn.tab = b,
     a.fn.tab.Constructor = c,
     a.fn.tab.noConflict = function() {
         return a.fn.tab = d,
         this
     },
     a(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]',
     function(c) {
         c.preventDefault(),
         b.call(a(this), "show")
     })
 } (jQuery),
 +
 function(a) {
     "use strict";
     function b(b) {
         return this.each(function() {
             var d = a(this),
             e = d.data("bs.affix"),
             f = "object" == typeof b && b;
             e || d.data("bs.affix", e = new c(this, f)),
             "string" == typeof b && e[b]()
         })
     }
     var c = function(b, d) {
         this.options = a.extend({},
         c.DEFAULTS, d),
         this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)),
         this.$element = a(b),
         this.affixed = this.unpin = this.pinnedOffset = null,
         this.checkPosition()
     };
     c.VERSION = "3.2.0",
     c.RESET = "affix affix-top affix-bottom",
     c.DEFAULTS = {
         offset: 0,
         target: window
     },
     c.prototype.getPinnedOffset = function() {
         if (this.pinnedOffset) return this.pinnedOffset;
         this.$element.removeClass(c.RESET).addClass("affix");
         var a = this.$target.scrollTop(),
         b = this.$element.offset();
         return this.pinnedOffset = b.top - a
     },
     c.prototype.checkPositionWithEventLoop = function() {
         setTimeout(a.proxy(this.checkPosition, this), 1)
     },
     c.prototype.checkPosition = function() {
         if (this.$element.is(":visible")) {
             var b = a(document).height(),
             d = this.$target.scrollTop(),
             e = this.$element.offset(),
             f = this.options.offset,
             g = f.top,
             h = f.bottom;
             "object" != typeof f && (h = g = f),
             "function" == typeof g && (g = f.top(this.$element)),
             "function" == typeof h && (h = f.bottom(this.$element));
             var i = null != this.unpin && d + this.unpin <= e.top ? !1 : null != h && e.top + this.$element.height() >= b - h ? "bottom": null != g && g >= d ? "top": !1;
             if (this.affixed !== i) {
                 null != this.unpin && this.$element.css("top", "");
                 var j = "affix" + (i ? "-" + i: ""),
                 k = a.Event(j + ".bs.affix");
                 this.$element.trigger(k),
                 k.isDefaultPrevented() || (this.affixed = i, this.unpin = "bottom" == i ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(j).trigger(a.Event(j.replace("affix", "affixed"))), "bottom" == i && this.$element.offset({
                     top: b - this.$element.height() - h
                 }))
             }
         }
     };
     var d = a.fn.affix;
     a.fn.affix = b,
     a.fn.affix.Constructor = c,
     a.fn.affix.noConflict = function() {
         return a.fn.affix = d,
         this
     },
     a(window).on("load",
     function() {
         a('[data-spy="affix"]').each(function() {
             var c = a(this),
             d = c.data();
             d.offset = d.offset || {},
             d.offsetBottom && (d.offset.bottom = d.offsetBottom),
             d.offsetTop && (d.offset.top = d.offsetTop),
             b.call(c, d)
         })
     })
 } (jQuery);

 /*
  * jQuery EasIng v1.1.2 - http://gsgd.co.uk/sandbox/jquery.easIng.php
  *
  * Uses the built In easIng capabilities added In jQuery 1.1
  * to offer multiple easIng options
  *
  * Copyright (c) 2007 George Smith
  * Licensed under the MIT License:
  *   http://www.opensource.org/licenses/mit-license.php
  */

 // t: current time, b: begInnIng value, c: change In value, d: duration

 jQuery.extend( jQuery.easing,
 {
 	easeInQuad: function (x, t, b, c, d) {
 		return c*(t/=d)*t + b;
 	},
 	easeOutQuad: function (x, t, b, c, d) {
 		return -c *(t/=d)*(t-2) + b;
 	},
 	easeInOutQuad: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t + b;
 		return -c/2 * ((--t)*(t-2) - 1) + b;
 	},
 	easeInCubic: function (x, t, b, c, d) {
 		return c*(t/=d)*t*t + b;
 	},
 	easeOutCubic: function (x, t, b, c, d) {
 		return c*((t=t/d-1)*t*t + 1) + b;
 	},
 	easeInOutCubic: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t*t + b;
 		return c/2*((t-=2)*t*t + 2) + b;
 	},
 	easeInQuart: function (x, t, b, c, d) {
 		return c*(t/=d)*t*t*t + b;
 	},
 	easeOutQuart: function (x, t, b, c, d) {
 		return -c * ((t=t/d-1)*t*t*t - 1) + b;
 	},
 	easeInOutQuart: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
 		return -c/2 * ((t-=2)*t*t*t - 2) + b;
 	},
 	easeInQuint: function (x, t, b, c, d) {
 		return c*(t/=d)*t*t*t*t + b;
 	},
 	easeOutQuint: function (x, t, b, c, d) {
 		return c*((t=t/d-1)*t*t*t*t + 1) + b;
 	},
 	easeInOutQuint: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
 		return c/2*((t-=2)*t*t*t*t + 2) + b;
 	},
 	easeInSine: function (x, t, b, c, d) {
 		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
 	},
 	easeOutSine: function (x, t, b, c, d) {
 		return c * Math.sin(t/d * (Math.PI/2)) + b;
 	},
 	easeInOutSine: function (x, t, b, c, d) {
 		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
 	},
 	easeInExpo: function (x, t, b, c, d) {
 		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
 	},
 	easeOutExpo: function (x, t, b, c, d) {
 		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
 	},
 	easeInOutExpo: function (x, t, b, c, d) {
 		if (t==0) return b;
 		if (t==d) return b+c;
 		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
 		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
 	},
 	easeInCirc: function (x, t, b, c, d) {
 		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
 	},
 	easeOutCirc: function (x, t, b, c, d) {
 		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
 	},
 	easeInOutCirc: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
 		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
 	},
 	easeInElastic: function (x, t, b, c, d) {
 		var s=1.70158;var p=0;var a=c;
 		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
 		if (a < Math.abs(c)) { a=c; var s=p/4; }
 		else var s = p/(2*Math.PI) * Math.asin (c/a);
 		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
 	},
 	easeOutElastic: function (x, t, b, c, d) {
 		var s=1.70158;var p=0;var a=c;
 		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
 		if (a < Math.abs(c)) { a=c; var s=p/4; }
 		else var s = p/(2*Math.PI) * Math.asin (c/a);
 		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
 	},
 	easeInOutElastic: function (x, t, b, c, d) {
 		var s=1.70158;var p=0;var a=c;
 		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
 		if (a < Math.abs(c)) { a=c; var s=p/4; }
 		else var s = p/(2*Math.PI) * Math.asin (c/a);
 		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
 		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
 	},
 	easeInBack: function (x, t, b, c, d, s) {
 		if (s == undefined) s = 1.70158;
 		return c*(t/=d)*t*((s+1)*t - s) + b;
 	},
 	easeOutBack: function (x, t, b, c, d, s) {
 		if (s == undefined) s = 1.70158;
 		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
 	},
 	easeInOutBack: function (x, t, b, c, d, s) {
 		if (s == undefined) s = 1.70158;
 		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
 		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
 	},
 	easeInBounce: function (x, t, b, c, d) {
 		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
 	},
 	easeOutBounce: function (x, t, b, c, d) {
 		if ((t/=d) < (1/2.75)) {
 			return c*(7.5625*t*t) + b;
 		} else if (t < (2/2.75)) {
 			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
 		} else if (t < (2.5/2.75)) {
 			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
 		} else {
 			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
 		}
 	},
 	easeInOutBounce: function (x, t, b, c, d) {
 		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
 		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
 	}
 });

 /*
  * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
  *
  * Uses the built in easing capabilities added In jQuery 1.1
  * to offer multiple easing options
  *
  * TERMS OF USE - jQuery Easing
  *
  * Open source under the BSD License.
  *
  * Copyright © 2008 George McGinley Smith
  * All rights reserved.
  *
  * Redistribution and use in source and binary forms, with or without modification,
  * are permitted provided that the following conditions are met:
  *
  * Redistributions of source code must retain the above copyright notice, this list of
  * conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice, this list
  * of conditions and the following disclaimer in the documentation and/or other materials
  * provided with the distribution.
  *
  * Neither the name of the author nor the names of contributors may be used to endorse
  * or promote products derived from this software without specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
  * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
  *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
  *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
  * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
  * OF THE POSSIBILITY OF SUCH DAMAGE.
  *
 */

 // t: current time, b: begInnIng value, c: change In value, d: duration
 jQuery.easing['jswing'] = jQuery.easing['swing'];

 jQuery.extend( jQuery.easing,
 {
 	def: 'easeOutQuad',
 	swing: function (x, t, b, c, d) {
 		//alert(jQuery.easing.default);
 		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
 	},
 	easeInQuad: function (x, t, b, c, d) {
 		return c*(t/=d)*t + b;
 	},
 	easeOutQuad: function (x, t, b, c, d) {
 		return -c *(t/=d)*(t-2) + b;
 	},
 	easeInOutQuad: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t + b;
 		return -c/2 * ((--t)*(t-2) - 1) + b;
 	},
 	easeInCubic: function (x, t, b, c, d) {
 		return c*(t/=d)*t*t + b;
 	},
 	easeOutCubic: function (x, t, b, c, d) {
 		return c*((t=t/d-1)*t*t + 1) + b;
 	},
 	easeInOutCubic: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t*t + b;
 		return c/2*((t-=2)*t*t + 2) + b;
 	},
 	easeInQuart: function (x, t, b, c, d) {
 		return c*(t/=d)*t*t*t + b;
 	},
 	easeOutQuart: function (x, t, b, c, d) {
 		return -c * ((t=t/d-1)*t*t*t - 1) + b;
 	},
 	easeInOutQuart: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
 		return -c/2 * ((t-=2)*t*t*t - 2) + b;
 	},
 	easeInQuint: function (x, t, b, c, d) {
 		return c*(t/=d)*t*t*t*t + b;
 	},
 	easeOutQuint: function (x, t, b, c, d) {
 		return c*((t=t/d-1)*t*t*t*t + 1) + b;
 	},
 	easeInOutQuint: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
 		return c/2*((t-=2)*t*t*t*t + 2) + b;
 	},
 	easeInSine: function (x, t, b, c, d) {
 		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
 	},
 	easeOutSine: function (x, t, b, c, d) {
 		return c * Math.sin(t/d * (Math.PI/2)) + b;
 	},
 	easeInOutSine: function (x, t, b, c, d) {
 		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
 	},
 	easeInExpo: function (x, t, b, c, d) {
 		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
 	},
 	easeOutExpo: function (x, t, b, c, d) {
 		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
 	},
 	easeInOutExpo: function (x, t, b, c, d) {
 		if (t==0) return b;
 		if (t==d) return b+c;
 		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
 		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
 	},
 	easeInCirc: function (x, t, b, c, d) {
 		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
 	},
 	easeOutCirc: function (x, t, b, c, d) {
 		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
 	},
 	easeInOutCirc: function (x, t, b, c, d) {
 		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
 		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
 	},
 	easeInElastic: function (x, t, b, c, d) {
 		var s=1.70158;var p=0;var a=c;
 		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
 		if (a < Math.abs(c)) { a=c; var s=p/4; }
 		else var s = p/(2*Math.PI) * Math.asin (c/a);
 		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
 	},
 	easeOutElastic: function (x, t, b, c, d) {
 		var s=1.70158;var p=0;var a=c;
 		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
 		if (a < Math.abs(c)) { a=c; var s=p/4; }
 		else var s = p/(2*Math.PI) * Math.asin (c/a);
 		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
 	},
 	easeInOutElastic: function (x, t, b, c, d) {
 		var s=1.70158;var p=0;var a=c;
 		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
 		if (a < Math.abs(c)) { a=c; var s=p/4; }
 		else var s = p/(2*Math.PI) * Math.asin (c/a);
 		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
 		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
 	},
 	easeInBack: function (x, t, b, c, d, s) {
 		if (s == undefined) s = 1.70158;
 		return c*(t/=d)*t*((s+1)*t - s) + b;
 	},
 	easeOutBack: function (x, t, b, c, d, s) {
 		if (s == undefined) s = 1.70158;
 		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
 	},
 	easeInOutBack: function (x, t, b, c, d, s) {
 		if (s == undefined) s = 1.70158;
 		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
 		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
 	},
 	easeInBounce: function (x, t, b, c, d) {
 		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
 	},
 	easeOutBounce: function (x, t, b, c, d) {
 		if ((t/=d) < (1/2.75)) {
 			return c*(7.5625*t*t) + b;
 		} else if (t < (2/2.75)) {
 			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
 		} else if (t < (2.5/2.75)) {
 			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
 		} else {
 			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
 		}
 	},
 	easeInOutBounce: function (x, t, b, c, d) {
 		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
 		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
 	}
 });

 /*
  *
  * TERMS OF USE - EASING EQUATIONS
  *
  * Open source under the BSD License.
  *
  * Copyright © 2001 Robert Penner
  * All rights reserved.
  *
  * Redistribution and use in source and binary forms, with or without modification,
  * are permitted provided that the following conditions are met:
  *
  * Redistributions of source code must retain the above copyright notice, this list of
  * conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice, this list
  * of conditions and the following disclaimer in the documentation and/or other materials
  * provided with the distribution.
  *
  * Neither the name of the author nor the names of contributors may be used to endorse
  * or promote products derived from this software without specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
  * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
  *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
  *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
  * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
  * OF THE POSSIBILITY OF SUCH DAMAGE.
  *
  */

  /*! jQuery v1.7.1 jquery.com | jquery.org/license */
  (function(a, b) {
      function cy(a) {
          return f.isWindow(a) ? a: a.nodeType === 9 ? a.defaultView || a.parentWindow: !1
      }
      function cv(a) {
          if (!ck[a]) {
              var b = c.body,
              d = f("<" + a + ">").appendTo(b),
              e = d.css("display");
              d.remove();
              if (e === "none" || e === "") {
                  cl || (cl = c.createElement("iframe"), cl.frameBorder = cl.width = cl.height = 0),
                  b.appendChild(cl);
                  if (!cm || !cl.createElement) cm = (cl.contentWindow || cl.contentDocument).document,
                  cm.write((c.compatMode === "CSS1Compat" ? "<!doctype html>": "") + "<html><body>"),
                  cm.close();
                  d = cm.createElement(a),
                  cm.body.appendChild(d),
                  e = f.css(d, "display"),
                  b.removeChild(cl)
              }
              ck[a] = e
          }
          return ck[a]
      }
      function cu(a, b) {
          var c = {};
          f.each(cq.concat.apply([], cq.slice(0, b)),
          function() {
              c[this] = a
          });
          return c
      }
      function ct() {
          cr = b
      }
      function cs() {
          setTimeout(ct, 0);
          return cr = f.now()
      }
      function cj() {
          try {
              return new a.ActiveXObject("Microsoft.XMLHTTP")
          } catch(b) {}
      }
      function ci() {
          try {
              return new a.XMLHttpRequest
          } catch(b) {}
      }
      function cc(a, c) {
          a.dataFilter && (c = a.dataFilter(c, a.dataType));
          var d = a.dataTypes,
          e = {},
          g, h, i = d.length,
          j, k = d[0],
          l,
          m,
          n,
          o,
          p;
          for (g = 1; g < i; g++) {
              if (g === 1) for (h in a.converters) typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]);
              l = k,
              k = d[g];
              if (k === "*") k = l;
              else if (l !== "*" && l !== k) {
                  m = l + " " + k,
                  n = e[m] || e["* " + k];
                  if (!n) {
                      p = b;
                      for (o in e) {
                          j = o.split(" ");
                          if (j[0] === l || j[0] === "*") {
                              p = e[j[1] + " " + k];
                              if (p) {
                                  o = e[o],
                                  o === !0 ? n = p: p === !0 && (n = o);
                                  break
                              }
                          }
                      }
                  } ! n && !p && f.error("No conversion from " + m.replace(" ", " to ")),
                  n !== !0 && (c = n ? n(c) : p(o(c)))
              }
          }
          return c
      }
      function cb(a, c, d) {
          var e = a.contents,
          f = a.dataTypes,
          g = a.responseFields,
          h, i, j, k;
          for (i in g) i in d && (c[g[i]] = d[i]);
          while (f[0] === "*") f.shift(),
          h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
          if (h) for (i in e) if (e[i] && e[i].test(h)) {
              f.unshift(i);
              break
          }
          if (f[0] in d) j = f[0];
          else {
              for (i in d) {
                  if (!f[0] || a.converters[i + " " + f[0]]) {
                      j = i;
                      break
                  }
                  k || (k = i)
              }
              j = j || k
          }
          if (j) {
              j !== f[0] && f.unshift(j);
              return d[j]
          }
      }
      function ca(a, b, c, d) {
          if (f.isArray(b)) f.each(b,
          function(b, e) {
              c || bE.test(a) ? d(a, e) : ca(a + "[" + (typeof e == "object" || f.isArray(e) ? b: "") + "]", e, c, d)
          });
          else if (!c && b != null && typeof b == "object") for (var e in b) ca(a + "[" + e + "]", b[e], c, d);
          else d(a, b)
      }
      function b_(a, c) {
          var d, e, g = f.ajaxSettings.flatOptions || {};
          for (d in c) c[d] !== b && ((g[d] ? a: e || (e = {}))[d] = c[d]);
          e && f.extend(!0, a, e)
      }
      function b$(a, c, d, e, f, g) {
          f = f || c.dataTypes[0],
          g = g || {},
          g[f] = !0;
          var h = a[f],
          i = 0,
          j = h ? h.length: 0,
          k = a === bT,
          l;
          for (; i < j && (k || !l); i++) l = h[i](c, d, e),
          typeof l == "string" && (!k || g[l] ? l = b: (c.dataTypes.unshift(l), l = b$(a, c, d, e, l, g))); (k || !l) && !g["*"] && (l = b$(a, c, d, e, "*", g));
          return l
      }
      function bZ(a) {
          return function(b, c) {
              typeof b != "string" && (c = b, b = "*");
              if (f.isFunction(c)) {
                  var d = b.toLowerCase().split(bP),
                  e = 0,
                  g = d.length,
                  h,
                  i,
                  j;
                  for (; e < g; e++) h = d[e],
                  j = /^\+/.test(h),
                  j && (h = h.substr(1) || "*"),
                  i = a[h] = a[h] || [],
                  i[j ? "unshift": "push"](c)
              }
          }
      }
      function bC(a, b, c) {
          var d = b === "width" ? a.offsetWidth: a.offsetHeight,
          e = b === "width" ? bx: by,
          g = 0,
          h = e.length;
          if (d > 0) {
              if (c !== "border") for (; g < h; g++) c || (d -= parseFloat(f.css(a, "padding" + e[g])) || 0),
              c === "margin" ? d += parseFloat(f.css(a, c + e[g])) || 0 : d -= parseFloat(f.css(a, "border" + e[g] + "Width")) || 0;
              return d + "px"
          }
          d = bz(a, b, b);
          if (d < 0 || d == null) d = a.style[b] || 0;
          d = parseFloat(d) || 0;
          if (c) for (; g < h; g++) d += parseFloat(f.css(a, "padding" + e[g])) || 0,
          c !== "padding" && (d += parseFloat(f.css(a, "border" + e[g] + "Width")) || 0),
          c === "margin" && (d += parseFloat(f.css(a, c + e[g])) || 0);
          return d + "px"
      }
      function bp(a, b) {
          b.src ? f.ajax({
              url: b.src,
              async: !1,
              dataType: "script"
          }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")),
          b.parentNode && b.parentNode.removeChild(b)
      }
      function bo(a) {
          var b = c.createElement("div");
          bh.appendChild(b),
          b.innerHTML = a.outerHTML;
          return b.firstChild
      }
      function bn(a) {
          var b = (a.nodeName || "").toLowerCase();
          b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm)
      }
      function bm(a) {
          if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked
      }
      function bl(a) {
          return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
      }
      function bk(a, b) {
          var c;
          if (b.nodeType === 1) {
              b.clearAttributes && b.clearAttributes(),
              b.mergeAttributes && b.mergeAttributes(a),
              c = b.nodeName.toLowerCase();
              if (c === "object") b.outerHTML = a.outerHTML;
              else if (c !== "input" || a.type !== "checkbox" && a.type !== "radio") {
                  if (c === "option") b.selected = a.defaultSelected;
                  else if (c === "input" || c === "textarea") b.defaultValue = a.defaultValue
              } else a.checked && (b.defaultChecked = b.checked = a.checked),
              b.value !== a.value && (b.value = a.value);
              b.removeAttribute(f.expando)
          }
      }
      function bj(a, b) {
          if (b.nodeType === 1 && !!f.hasData(a)) {
              var c, d, e, g = f._data(a),
              h = f._data(b, g),
              i = g.events;
              if (i) {
                  delete h.handle,
                  h.events = {};
                  for (c in i) for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c + (i[c][d].namespace ? ".": "") + i[c][d].namespace, i[c][d], i[c][d].data)
              }
              h.data && (h.data = f.extend({},
              h.data))
          }
      }
      function bi(a, b) {
          return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
      }
      function U(a) {
          var b = V.split("|"),
          c = a.createDocumentFragment();
          if (c.createElement) while (b.length) c.createElement(b.pop());
          return c
      }
      function T(a, b, c) {
          b = b || 0;
          if (f.isFunction(b)) return f.grep(a,
          function(a, d) {
              var e = !!b.call(a, d, a);
              return e === c
          });
          if (b.nodeType) return f.grep(a,
          function(a, d) {
              return a === b === c
          });
          if (typeof b == "string") {
              var d = f.grep(a,
              function(a) {
                  return a.nodeType === 1
              });
              if (O.test(b)) return f.filter(b, d, !c);
              b = f.filter(b, d)
          }
          return f.grep(a,
          function(a, d) {
              return f.inArray(a, b) >= 0 === c
          })
      }
      function S(a) {
          return ! a || !a.parentNode || a.parentNode.nodeType === 11
      }
      function K() {
          return ! 0
      }
      function J() {
          return ! 1
      }
      function n(a, b, c) {
          var d = b + "defer",
          e = b + "queue",
          g = b + "mark",
          h = f._data(a, d);
          h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function() { ! f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire())
          },
          0)
      }
      function m(a) {
          for (var b in a) {
              if (b === "data" && f.isEmptyObject(a[b])) continue;
              if (b !== "toJSON") return ! 1
          }
          return ! 0
      }
      function l(a, c, d) {
          if (d === b && a.nodeType === 1) {
              var e = "data-" + c.replace(k, "-$1").toLowerCase();
              d = a.getAttribute(e);
              if (typeof d == "string") {
                  try {
                      d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null: f.isNumeric(d) ? parseFloat(d) : j.test(d) ? f.parseJSON(d) : d
                  } catch(g) {}
                  f.data(a, c, d)
              } else d = b
          }
          return d
      }
      function h(a) {
          var b = g[a] = {},
          c,
          d;
          a = a.split(/\s+/);
          for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
          return b
      }
      var c = a.document,
      d = a.navigator,
      e = a.location,
      f = function() {
          function J() {
              if (!e.isReady) {
                  try {
                      c.documentElement.doScroll("left")
                  } catch(a) {
                      setTimeout(J, 1);
                      return
                  }
                  e.ready()
              }
          }
          var e = function(a, b) {
              return new e.fn.init(a, b, h)
          },
          f = a.jQuery,
          g = a.$,
          h,
          i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
          j = /\S/,
          k = /^\s+/,
          l = /\s+$/,
          m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
          n = /^[\],:{}\s]*$/,
          o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
          p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          q = /(?:^|:|,)(?:\s*\[)+/g,
          r = /(webkit)[ \/]([\w.]+)/,
          s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
          t = /(msie) ([\w.]+)/,
          u = /(mozilla)(?:.*? rv:([\w.]+))?/,
          v = /-([a-z]|[0-9])/ig,
          w = /^-ms-/,
          x = function(a, b) {
              return (b + "").toUpperCase()
          },
          y = d.userAgent,
          z,
          A,
          B,
          C = Object.prototype.toString,
          D = Object.prototype.hasOwnProperty,
          E = Array.prototype.push,
          F = Array.prototype.slice,
          G = String.prototype.trim,
          H = Array.prototype.indexOf,
          I = {};
          e.fn = e.prototype = {
              constructor: e,
              init: function(a, d, f) {
                  var g, h, j, k;
                  if (!a) return this;
                  if (a.nodeType) {
                      this.context = this[0] = a,
                      this.length = 1;
                      return this
                  }
                  if (a === "body" && !d && c.body) {
                      this.context = c,
                      this[0] = c.body,
                      this.selector = a,
                      this.length = 1;
                      return this
                  }
                  if (typeof a == "string") {
                      a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null];
                      if (g && (g[1] || !d)) {
                          if (g[1]) {
                              d = d instanceof e ? d[0] : d,
                              k = d ? d.ownerDocument || d: c,
                              j = m.exec(a),
                              j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes);
                              return e.merge(this, a)
                          }
                          h = c.getElementById(g[2]);
                          if (h && h.parentNode) {
                              if (h.id !== g[2]) return f.find(a);
                              this.length = 1,
                              this[0] = h
                          }
                          this.context = c,
                          this.selector = a;
                          return this
                      }
                      return ! d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a)
                  }
                  if (e.isFunction(a)) return f.ready(a);
                  a.selector !== b && (this.selector = a.selector, this.context = a.context);
                  return e.makeArray(a, this)
              },
              selector: "",
              jquery: "1.7.1",
              length: 0,
              size: function() {
                  return this.length
              },
              toArray: function() {
                  return F.call(this, 0)
              },
              get: function(a) {
                  return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
              },
              pushStack: function(a, b, c) {
                  var d = this.constructor();
                  e.isArray(a) ? E.apply(d, a) : e.merge(d, a),
                  d.prevObject = this,
                  d.context = this.context,
                  b === "find" ? d.selector = this.selector + (this.selector ? " ": "") + c: b && (d.selector = this.selector + "." + b + "(" + c + ")");
                  return d
              },
              each: function(a, b) {
                  return e.each(this, a, b)
              },
              ready: function(a) {
                  e.bindReady(),
                  A.add(a);
                  return this
              },
              eq: function(a) {
                  a = +a;
                  return a === -1 ? this.slice(a) : this.slice(a, a + 1)
              },
              first: function() {
                  return this.eq(0)
              },
              last: function() {
                  return this.eq( - 1)
              },
              slice: function() {
                  return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(","))
              },
              map: function(a) {
                  return this.pushStack(e.map(this,
                  function(b, c) {
                      return a.call(b, c, b)
                  }))
              },
              end: function() {
                  return this.prevObject || this.constructor(null)
              },
              push: E,
              sort: [].sort,
              splice: [].splice
          },
          e.fn.init.prototype = e.fn,
          e.extend = e.fn.extend = function() {
              var a, c, d, f, g, h, i = arguments[0] || {},
              j = 1,
              k = arguments.length,
              l = !1;
              typeof i == "boolean" && (l = i, i = arguments[1] || {},
              j = 2),
              typeof i != "object" && !e.isFunction(i) && (i = {}),
              k === j && (i = this, --j);
              for (; j < k; j++) if ((a = arguments[j]) != null) for (c in a) {
                  d = i[c],
                  f = a[c];
                  if (i === f) continue;
                  l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d: []) : h = d && e.isPlainObject(d) ? d: {},
                  i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f)
              }
              return i
          },
          e.extend({
              noConflict: function(b) {
                  a.$ === e && (a.$ = g),
                  b && a.jQuery === e && (a.jQuery = f);
                  return e
              },
              isReady: !1,
              readyWait: 1,
              holdReady: function(a) {
                  a ? e.readyWait++:e.ready(!0)
              },
              ready: function(a) {
                  if (a === !0 && !--e.readyWait || a !== !0 && !e.isReady) {
                      if (!c.body) return setTimeout(e.ready, 1);
                      e.isReady = !0;
                      if (a !== !0 && --e.readyWait > 0) return;
                      A.fireWith(c, [e]),
                      e.fn.trigger && e(c).trigger("ready").off("ready")
                  }
              },
              bindReady: function() {
                  if (!A) {
                      A = e.Callbacks("once memory");
                      if (c.readyState === "complete") return setTimeout(e.ready, 1);
                      if (c.addEventListener) c.addEventListener("DOMContentLoaded", B, !1),
                      a.addEventListener("load", e.ready, !1);
                      else if (c.attachEvent) {
                          c.attachEvent("onreadystatechange", B),
                          a.attachEvent("onload", e.ready);
                          var b = !1;
                          try {
                              b = a.frameElement == null
                          } catch(d) {}
                          c.documentElement.doScroll && b && J()
                      }
                  }
              },
              isFunction: function(a) {
                  return e.type(a) === "function"
              },
              isArray: Array.isArray ||
              function(a) {
                  return e.type(a) === "array"
              },
              isWindow: function(a) {
                  return a && typeof a == "object" && "setInterval" in a
              },
              isNumeric: function(a) {
                  return ! isNaN(parseFloat(a)) && isFinite(a)
              },
              type: function(a) {
                  return a == null ? String(a) : I[C.call(a)] || "object"
              },
              isPlainObject: function(a) {
                  if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) return ! 1;
                  try {
                      if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) return ! 1
                  } catch(c) {
                      return ! 1
                  }
                  var d;
                  for (d in a);
                  return d === b || D.call(a, d)
              },
              isEmptyObject: function(a) {
                  for (var b in a) return ! 1;
                  return ! 0
              },
              error: function(a) {
                  throw new Error(a)
              },
              parseJSON: function(b) {
                  if (typeof b != "string" || !b) return null;
                  b = e.trim(b);
                  if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                  if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) return (new Function("return " + b))();
                  e.error("Invalid JSON: " + b)
              },
              parseXML: function(c) {
                  var d, f;
                  try {
                      a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
                  } catch(g) {
                      d = b
                  } (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c);
                  return d
              },
              noop: function() {},
              globalEval: function(b) {
                  b && j.test(b) && (a.execScript ||
                  function(b) {
                      a.eval.call(a, b)
                  })(b)
              },
              camelCase: function(a) {
                  return a.replace(w, "ms-").replace(v, x)
              },
              nodeName: function(a, b) {
                  return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
              },
              each: function(a, c, d) {
                  var f, g = 0,
                  h = a.length,
                  i = h === b || e.isFunction(a);
                  if (d) {
                      if (i) {
                          for (f in a) if (c.apply(a[f], d) === !1) break
                      } else for (; g < h;) if (c.apply(a[g++], d) === !1) break
                  } else if (i) {
                      for (f in a) if (c.call(a[f], f, a[f]) === !1) break
                  } else for (; g < h;) if (c.call(a[g], g, a[g++]) === !1) break;
                  return a
              },
              trim: G ?
              function(a) {
                  return a == null ? "": G.call(a)
              }: function(a) {
                  return a == null ? "": (a + "").replace(k, "").replace(l, "")
              },
              makeArray: function(a, b) {
                  var c = b || [];
                  if (a != null) {
                      var d = e.type(a);
                      a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a)
                  }
                  return c
              },
              inArray: function(a, b, c) {
                  var d;
                  if (b) {
                      if (H) return H.call(b, a, c);
                      d = b.length,
                      c = c ? c < 0 ? Math.max(0, d + c) : c: 0;
                      for (; c < d; c++) if (c in b && b[c] === a) return c
                  }
                  return - 1
              },
              merge: function(a, c) {
                  var d = a.length,
                  e = 0;
                  if (typeof c.length == "number") for (var f = c.length; e < f; e++) a[d++] = c[e];
                  else while (c[e] !== b) a[d++] = c[e++];
                  a.length = d;
                  return a
              },
              grep: function(a, b, c) {
                  var d = [],
                  e;
                  c = !!c;
                  for (var f = 0,
                  g = a.length; f < g; f++) e = !!b(a[f], f),
                  c !== e && d.push(a[f]);
                  return d
              },
              map: function(a, c, d) {
                  var f, g, h = [],
                  i = 0,
                  j = a.length,
                  k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a));
                  if (k) for (; i < j; i++) f = c(a[i], i, d),
                  f != null && (h[h.length] = f);
                  else for (g in a) f = c(a[g], g, d),
                  f != null && (h[h.length] = f);
                  return h.concat.apply([], h)
              },
              guid: 1,
              proxy: function(a, c) {
                  if (typeof c == "string") {
                      var d = a[c];
                      c = a,
                      a = d
                  }
                  if (!e.isFunction(a)) return b;
                  var f = F.call(arguments, 2),
                  g = function() {
                      return a.apply(c, f.concat(F.call(arguments)))
                  };
                  g.guid = a.guid = a.guid || g.guid || e.guid++;
                  return g
              },
              access: function(a, c, d, f, g, h) {
                  var i = a.length;
                  if (typeof c == "object") {
                      for (var j in c) e.access(a, j, c[j], f, g, d);
                      return a
                  }
                  if (d !== b) {
                      f = !h && f && e.isFunction(d);
                      for (var k = 0; k < i; k++) g(a[k], c, f ? d.call(a[k], k, g(a[k], c)) : d, h);
                      return a
                  }
                  return i ? g(a[0], c) : b
              },
              now: function() {
                  return (new Date).getTime()
              },
              uaMatch: function(a) {
                  a = a.toLowerCase();
                  var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                  return {
                      browser: b[1] || "",
                      version: b[2] || "0"
                  }
              },
              sub: function() {
                  function a(b, c) {
                      return new a.fn.init(b, c)
                  }
                  e.extend(!0, a, this),
                  a.superclass = this,
                  a.fn = a.prototype = this(),
                  a.fn.constructor = a,
                  a.sub = this.sub,
                  a.fn.init = function(d, f) {
                      f && f instanceof e && !(f instanceof a) && (f = a(f));
                      return e.fn.init.call(this, d, f, b)
                  },
                  a.fn.init.prototype = a.fn;
                  var b = a(c);
                  return a
              },
              browser: {}
          }),
          e.each("Boolean Number String Function Array Date RegExp Object".split(" "),
          function(a, b) {
              I["[object " + b + "]"] = b.toLowerCase()
          }),
          z = e.uaMatch(y),
          z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version),
          e.browser.webkit && (e.browser.safari = !0),
          j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/),
          h = e(c),
          c.addEventListener ? B = function() {
              c.removeEventListener("DOMContentLoaded", B, !1),
              e.ready()
          }: c.attachEvent && (B = function() {
              c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready())
          });
          return e
      } (),
      g = {};
      f.Callbacks = function(a) {
          a = a ? g[a] || h(a) : {};
          var c = [],
          d = [],
          e,
          i,
          j,
          k,
          l,
          m = function(b) {
              var d, e, g, h, i;
              for (d = 0, e = b.length; d < e; d++) g = b[d],
              h = f.type(g),
              h === "array" ? m(g) : h === "function" && (!a.unique || !o.has(g)) && c.push(g)
          },
          n = function(b, f) {
              f = f || [],
              e = !a.memory || [b, f],
              i = !0,
              l = j || 0,
              j = 0,
              k = c.length;
              for (; c && l < k; l++) if (c[l].apply(b, f) === !1 && a.stopOnFalse) {
                  e = !0;
                  break
              }
              i = !1,
              c && (a.once ? e === !0 ? o.disable() : c = [] : d && d.length && (e = d.shift(), o.fireWith(e[0], e[1])))
          },
          o = {
              add: function() {
                  if (c) {
                      var a = c.length;
                      m(arguments),
                      i ? k = c.length: e && e !== !0 && (j = a, n(e[0], e[1]))
                  }
                  return this
              },
              remove: function() {
                  if (c) {
                      var b = arguments,
                      d = 0,
                      e = b.length;
                      for (; d < e; d++) for (var f = 0; f < c.length; f++) if (b[d] === c[f]) {
                          i && f <= k && (k--, f <= l && l--),
                          c.splice(f--, 1);
                          if (a.unique) break
                      }
                  }
                  return this
              },
              has: function(a) {
                  if (c) {
                      var b = 0,
                      d = c.length;
                      for (; b < d; b++) if (a === c[b]) return ! 0
                  }
                  return ! 1
              },
              empty: function() {
                  c = [];
                  return this
              },
              disable: function() {
                  c = d = e = b;
                  return this
              },
              disabled: function() {
                  return ! c
              },
              lock: function() {
                  d = b,
                  (!e || e === !0) && o.disable();
                  return this
              },
              locked: function() {
                  return ! d
              },
              fireWith: function(b, c) {
                  d && (i ? a.once || d.push([b, c]) : (!a.once || !e) && n(b, c));
                  return this
              },
              fire: function() {
                  o.fireWith(this, arguments);
                  return this
              },
              fired: function() {
                  return !! e
              }
          };
          return o
      };
      var i = [].slice;
      f.extend({
          Deferred: function(a) {
              var b = f.Callbacks("once memory"),
              c = f.Callbacks("once memory"),
              d = f.Callbacks("memory"),
              e = "pending",
              g = {
                  resolve: b,
                  reject: c,
                  notify: d
              },
              h = {
                  done: b.add,
                  fail: c.add,
                  progress: d.add,
                  state: function() {
                      return e
                  },
                  isResolved: b.fired,
                  isRejected: c.fired,
                  then: function(a, b, c) {
                      i.done(a).fail(b).progress(c);
                      return this
                  },
                  always: function() {
                      i.done.apply(i, arguments).fail.apply(i, arguments);
                      return this
                  },
                  pipe: function(a, b, c) {
                      return f.Deferred(function(d) {
                          f.each({
                              done: [a, "resolve"],
                              fail: [b, "reject"],
                              progress: [c, "notify"]
                          },
                          function(a, b) {
                              var c = b[0],
                              e = b[1],
                              g;
                              f.isFunction(c) ? i[a](function() {
                                  g = c.apply(this, arguments),
                                  g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d: this, [g])
                              }) : i[a](d[e])
                          })
                      }).promise()
                  },
                  promise: function(a) {
                      if (a == null) a = h;
                      else for (var b in h) a[b] = h[b];
                      return a
                  }
              },
              i = h.promise({}),
              j;
              for (j in g) i[j] = g[j].fire,
              i[j + "With"] = g[j].fireWith;
              i.done(function() {
                  e = "resolved"
              },
              c.disable, d.lock).fail(function() {
                  e = "rejected"
              },
              b.disable, d.lock),
              a && a.call(i, i);
              return i
          },
          when: function(a) {
              function m(a) {
                  return function(b) {
                      e[a] = arguments.length > 1 ? i.call(arguments, 0) : b,
                      j.notifyWith(k, e)
                  }
              }
              function l(a) {
                  return function(c) {
                      b[a] = arguments.length > 1 ? i.call(arguments, 0) : c,
                      --g || j.resolveWith(j, b)
                  }
              }
              var b = i.call(arguments, 0),
              c = 0,
              d = b.length,
              e = Array(d),
              g = d,
              h = d,
              j = d <= 1 && a && f.isFunction(a.promise) ? a: f.Deferred(),
              k = j.promise();
              if (d > 1) {
                  for (; c < d; c++) b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g;
                  g || j.resolveWith(j, b)
              } else j !== a && j.resolveWith(j, d ? [a] : []);
              return k
          }
      }),
      f.support = function() {
          var b, d, e, g, h, i, j, k, l, m, n, o, p, q = c.createElement("div"),
          r = c.documentElement;
          q.setAttribute("className", "t"),
          q.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",
          d = q.getElementsByTagName("*"),
          e = q.getElementsByTagName("a")[0];
          if (!d || !d.length || !e) return {};
          g = c.createElement("select"),
          h = g.appendChild(c.createElement("option")),
          i = q.getElementsByTagName("input")[0],
          b = {
              leadingWhitespace: q.firstChild.nodeType === 3,
              tbody: !q.getElementsByTagName("tbody").length,
              htmlSerialize: !!q.getElementsByTagName("link").length,
              style: /top/.test(e.getAttribute("style")),
              hrefNormalized: e.getAttribute("href") === "/a",
              opacity: /^0.55/.test(e.style.opacity),
              cssFloat: !!e.style.cssFloat,
              checkOn: i.value === "on",
              optSelected: h.selected,
              getSetAttribute: q.className !== "t",
              enctype: !!c.createElement("form").enctype,
              html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
              submitBubbles: !0,
              changeBubbles: !0,
              focusinBubbles: !1,
              deleteExpando: !0,
              noCloneEvent: !0,
              inlineBlockNeedsLayout: !1,
              shrinkWrapBlocks: !1,
              reliableMarginRight: !0
          },
          i.checked = !0,
          b.noCloneChecked = i.cloneNode(!0).checked,
          g.disabled = !0,
          b.optDisabled = !h.disabled;
          try {
              delete q.test
          } catch(s) {
              b.deleteExpando = !1
          } ! q.addEventListener && q.attachEvent && q.fireEvent && (q.attachEvent("onclick",
          function() {
              b.noCloneEvent = !1
          }), q.cloneNode(!0).fireEvent("onclick")),
          i = c.createElement("input"),
          i.value = "t",
          i.setAttribute("type", "radio"),
          b.radioValue = i.value === "t",
          i.setAttribute("checked", "checked"),
          q.appendChild(i),
          k = c.createDocumentFragment(),
          k.appendChild(q.lastChild),
          b.checkClone = k.cloneNode(!0).cloneNode(!0).lastChild.checked,
          b.appendChecked = i.checked,
          k.removeChild(i),
          k.appendChild(q),
          q.innerHTML = "",
          a.getComputedStyle && (j = c.createElement("div"), j.style.width = "0", j.style.marginRight = "0", q.style.width = "2px", q.appendChild(j), b.reliableMarginRight = (parseInt((a.getComputedStyle(j, null) || {
              marginRight: 0
          }).marginRight, 10) || 0) === 0);
          if (q.attachEvent) for (o in {
              submit: 1,
              change: 1,
              focusin: 1
          }) n = "on" + o,
          p = n in q,
          p || (q.setAttribute(n, "return;"), p = typeof q[n] == "function"),
          b[o + "Bubbles"] = p;
          k.removeChild(q),
          k = g = h = j = q = i = null,
          f(function() {
              var a, d, e, g, h, i, j, k, m, n, o, r = c.getElementsByTagName("body")[0]; ! r || (j = 1, k = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;", m = "visibility:hidden;border:0;", n = "style='" + k + "border:5px solid #000;padding:0;'", o = "<div " + n + "><div></div></div>" + "<table " + n + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", a = c.createElement("div"), a.style.cssText = m + "width:0;height:0;position:static;top:0;margin-top:" + j + "px", r.insertBefore(a, r.firstChild), q = c.createElement("div"), a.appendChild(q), q.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>", l = q.getElementsByTagName("td"), p = l[0].offsetHeight === 0, l[0].style.display = "", l[1].style.display = "none", b.reliableHiddenOffsets = p && l[0].offsetHeight === 0, q.innerHTML = "", q.style.width = q.style.paddingLeft = "1px", f.boxModel = b.boxModel = q.offsetWidth === 2, typeof q.style.zoom != "undefined" && (q.style.display = "inline", q.style.zoom = 1, b.inlineBlockNeedsLayout = q.offsetWidth === 2, q.style.display = "", q.innerHTML = "<div style='width:4px;'></div>", b.shrinkWrapBlocks = q.offsetWidth !== 2), q.style.cssText = k + m, q.innerHTML = o, d = q.firstChild, e = d.firstChild, h = d.nextSibling.firstChild.firstChild, i = {
                  doesNotAddBorder: e.offsetTop !== 5,
                  doesAddBorderForTableAndCells: h.offsetTop === 5
              },
              e.style.position = "fixed", e.style.top = "20px", i.fixedPosition = e.offsetTop === 20 || e.offsetTop === 15, e.style.position = e.style.top = "", d.style.overflow = "hidden", d.style.position = "relative", i.subtractsBorderForOverflowNotVisible = e.offsetTop === -5, i.doesNotIncludeMarginInBodyOffset = r.offsetTop !== j, r.removeChild(a), q = a = null, f.extend(b, i))
          });
          return b
      } ();
      var j = /^(?:\{.*\}|\[.*\])$/,
      k = /([A-Z])/g;
      f.extend({
          cache: {},
          uuid: 0,
          expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
          noData: {
              embed: !0,
              object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
              applet: !0
          },
          hasData: function(a) {
              a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
              return !! a && !m(a)
          },
          data: function(a, c, d, e) {
              if ( !! f.acceptData(a)) {
                  var g, h, i, j = f.expando,
                  k = typeof c == "string",
                  l = a.nodeType,
                  m = l ? f.cache: a,
                  n = l ? a[j] : a[j] && j,
                  o = c === "events";
                  if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) return;
                  n || (l ? a[j] = n = ++f.uuid: n = j),
                  m[n] || (m[n] = {},
                  l || (m[n].toJSON = f.noop));
                  if (typeof c == "object" || typeof c == "function") e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c);
                  g = h = m[n],
                  e || (h.data || (h.data = {}), h = h.data),
                  d !== b && (h[f.camelCase(c)] = d);
                  if (o && !h[c]) return g.events;
                  k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h;
                  return i
              }
          },
          removeData: function(a, b, c) {
              if ( !! f.acceptData(a)) {
                  var d, e, g, h = f.expando,
                  i = a.nodeType,
                  j = i ? f.cache: a,
                  k = i ? a[h] : h;
                  if (!j[k]) return;
                  if (b) {
                      d = c ? j[k] : j[k].data;
                      if (d) {
                          f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                          for (e = 0, g = b.length; e < g; e++) delete d[b[e]];
                          if (! (c ? m: f.isEmptyObject)(d)) return
                      }
                  }
                  if (!c) {
                      delete j[k].data;
                      if (!m(j[k])) return
                  }
                  f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null,
                  i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null)
              }
          },
          _data: function(a, b, c) {
              return f.data(a, b, c, !0)
          },
          acceptData: function(a) {
              if (a.nodeName) {
                  var b = f.noData[a.nodeName.toLowerCase()];
                  if (b) return b !== !0 && a.getAttribute("classid") === b
              }
              return ! 0
          }
      }),
      f.fn.extend({
          data: function(a, c) {
              var d, e, g, h = null;
              if (typeof a == "undefined") {
                  if (this.length) {
                      h = f.data(this[0]);
                      if (this[0].nodeType === 1 && !f._data(this[0], "parsedAttrs")) {
                          e = this[0].attributes;
                          for (var i = 0,
                          j = e.length; i < j; i++) g = e[i].name,
                          g.indexOf("data-") === 0 && (g = f.camelCase(g.substring(5)), l(this[0], g, h[g]));
                          f._data(this[0], "parsedAttrs", !0)
                      }
                  }
                  return h
              }
              if (typeof a == "object") return this.each(function() {
                  f.data(this, a)
              });
              d = a.split("."),
              d[1] = d[1] ? "." + d[1] : "";
              if (c === b) {
                  h = this.triggerHandler("getData" + d[1] + "!", [d[0]]),
                  h === b && this.length && (h = f.data(this[0], a), h = l(this[0], a, h));
                  return h === b && d[1] ? this.data(d[0]) : h
              }
              return this.each(function() {
                  var b = f(this),
                  e = [d[0], c];
                  b.triggerHandler("setData" + d[1] + "!", e),
                  f.data(this, a, c),
                  b.triggerHandler("changeData" + d[1] + "!", e)
              })
          },
          removeData: function(a) {
              return this.each(function() {
                  f.removeData(this, a)
              })
          }
      }),
      f.extend({
          _mark: function(a, b) {
              a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1))
          },
          _unmark: function(a, b, c) {
              a !== !0 && (c = b, b = a, a = !1);
              if (b) {
                  c = c || "fx";
                  var d = c + "mark",
                  e = a ? 0 : (f._data(b, d) || 1) - 1;
                  e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"))
              }
          },
          queue: function(a, b, c) {
              var d;
              if (a) {
                  b = (b || "fx") + "queue",
                  d = f._data(a, b),
                  c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c));
                  return d || []
              }
          },
          dequeue: function(a, b) {
              b = b || "fx";
              var c = f.queue(a, b),
              d = c.shift(),
              e = {};
              d === "inprogress" && (d = c.shift()),
              d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a,
              function() {
                  f.dequeue(a, b)
              },
              e)),
              c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"))
          }
      }),
      f.fn.extend({
          queue: function(a, c) {
              typeof a != "string" && (c = a, a = "fx");
              if (c === b) return f.queue(this[0], a);
              return this.each(function() {
                  var b = f.queue(this, a, c);
                  a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a)
              })
          },
          dequeue: function(a) {
              return this.each(function() {
                  f.dequeue(this, a)
              })
          },
          delay: function(a, b) {
              a = f.fx ? f.fx.speeds[a] || a: a,
              b = b || "fx";
              return this.queue(b,
              function(b, c) {
                  var d = setTimeout(b, a);
                  c.stop = function() {
                      clearTimeout(d)
                  }
              })
          },
          clearQueue: function(a) {
              return this.queue(a || "fx", [])
          },
          promise: function(a, c) {
              function m() {--h || d.resolveWith(e, [e])
              }
              typeof a != "string" && (c = a, a = b),
              a = a || "fx";
              var d = f.Deferred(),
              e = this,
              g = e.length,
              h = 1,
              i = a + "defer",
              j = a + "queue",
              k = a + "mark",
              l;
              while (g--) if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) h++,
              l.add(m);
              m();
              return d.promise()
          }
      });
      var o = /[\n\t\r]/g,
      p = /\s+/,
      q = /\r/g,
      r = /^(?:button|input)$/i,
      s = /^(?:button|input|object|select|textarea)$/i,
      t = /^a(?:rea)?$/i,
      u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
      v = f.support.getSetAttribute,
      w, x, y;
      f.fn.extend({
          attr: function(a, b) {
              return f.access(this, a, b, !0, f.attr)
          },
          removeAttr: function(a) {
              return this.each(function() {
                  f.removeAttr(this, a)
              })
          },
          prop: function(a, b) {
              return f.access(this, a, b, !0, f.prop)
          },
          removeProp: function(a) {
              a = f.propFix[a] || a;
              return this.each(function() {
                  try {
                      this[a] = b,
                      delete this[a]
                  } catch(c) {}
              })
          },
          addClass: function(a) {
              var b, c, d, e, g, h, i;
              if (f.isFunction(a)) return this.each(function(b) {
                  f(this).addClass(a.call(this, b, this.className))
              });
              if (a && typeof a == "string") {
                  b = a.split(p);
                  for (c = 0, d = this.length; c < d; c++) {
                      e = this[c];
                      if (e.nodeType === 1) if (!e.className && b.length === 1) e.className = a;
                      else {
                          g = " " + e.className + " ";
                          for (h = 0, i = b.length; h < i; h++)~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ");
                          e.className = f.trim(g)
                      }
                  }
              }
              return this
          },
          removeClass: function(a) {
              var c, d, e, g, h, i, j;
              if (f.isFunction(a)) return this.each(function(b) {
                  f(this).removeClass(a.call(this, b, this.className))
              });
              if (a && typeof a == "string" || a === b) {
                  c = (a || "").split(p);
                  for (d = 0, e = this.length; d < e; d++) {
                      g = this[d];
                      if (g.nodeType === 1 && g.className) if (a) {
                          h = (" " + g.className + " ").replace(o, " ");
                          for (i = 0, j = c.length; i < j; i++) h = h.replace(" " + c[i] + " ", " ");
                          g.className = f.trim(h)
                      } else g.className = ""
                  }
              }
              return this
          },
          toggleClass: function(a, b) {
              var c = typeof a,
              d = typeof b == "boolean";
              if (f.isFunction(a)) return this.each(function(c) {
                  f(this).toggleClass(a.call(this, c, this.className, b), b)
              });
              return this.each(function() {
                  if (c === "string") {
                      var e, g = 0,
                      h = f(this),
                      i = b,
                      j = a.split(p);
                      while (e = j[g++]) i = d ? i: !h.hasClass(e),
                      h[i ? "addClass": "removeClass"](e)
                  } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className),
                  this.className = this.className || a === !1 ? "": f._data(this, "__className__") || ""
              })
          },
          hasClass: function(a) {
              var b = " " + a + " ",
              c = 0,
              d = this.length;
              for (; c < d; c++) if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) return ! 0;
              return ! 1
          },
          val: function(a) {
              var c, d, e, g = this[0]; {
                  if ( !! arguments.length) {
                      e = f.isFunction(a);
                      return this.each(function(d) {
                          var g = f(this),
                          h;
                          if (this.nodeType === 1) {
                              e ? h = a.call(this, d, g.val()) : h = a,
                              h == null ? h = "": typeof h == "number" ? h += "": f.isArray(h) && (h = f.map(h,
                              function(a) {
                                  return a == null ? "": a + ""
                              })),
                              c = f.valHooks[this.nodeName.toLowerCase()] || f.valHooks[this.type];
                              if (!c || !("set" in c) || c.set(this, h, "value") === b) this.value = h
                          }
                      })
                  }
                  if (g) {
                      c = f.valHooks[g.nodeName.toLowerCase()] || f.valHooks[g.type];
                      if (c && "get" in c && (d = c.get(g, "value")) !== b) return d;
                      d = g.value;
                      return typeof d == "string" ? d.replace(q, "") : d == null ? "": d
                  }
              }
          }
      }),
      f.extend({
          valHooks: {
              option: {
                  get: function(a) {
                      var b = a.attributes.value;
                      return ! b || b.specified ? a.value: a.text
                  }
              },
              select: {
                  get: function(a) {
                      var b, c, d, e, g = a.selectedIndex,
                      h = [],
                      i = a.options,
                      j = a.type === "select-one";
                      if (g < 0) return null;
                      c = j ? g: 0,
                      d = j ? g + 1 : i.length;
                      for (; c < d; c++) {
                          e = i[c];
                          if (e.selected && (f.support.optDisabled ? !e.disabled: e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) {
                              b = f(e).val();
                              if (j) return b;
                              h.push(b)
                          }
                      }
                      if (j && !h.length && i.length) return f(i[g]).val();
                      return h
                  },
                  set: function(a, b) {
                      var c = f.makeArray(b);
                      f(a).find("option").each(function() {
                          this.selected = f.inArray(f(this).val(), c) >= 0
                      }),
                      c.length || (a.selectedIndex = -1);
                      return c
                  }
              }
          },
          attrFn: {
              val: !0,
              css: !0,
              html: !0,
              text: !0,
              data: !0,
              width: !0,
              height: !0,
              offset: !0
          },
          attr: function(a, c, d, e) {
              var g, h, i, j = a.nodeType;
              if ( !! a && j !== 3 && j !== 8 && j !== 2) {
                  if (e && c in f.attrFn) return f(a)[c](d);
                  if (typeof a.getAttribute == "undefined") return f.prop(a, c, d);
                  i = j !== 1 || !f.isXMLDoc(a),
                  i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x: w));
                  if (d !== b) {
                      if (d === null) {
                          f.removeAttr(a, c);
                          return
                      }
                      if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) return g;
                      a.setAttribute(c, "" + d);
                      return d
                  }
                  if (h && "get" in h && i && (g = h.get(a, c)) !== null) return g;
                  g = a.getAttribute(c);
                  return g === null ? b: g
              }
          },
          removeAttr: function(a, b) {
              var c, d, e, g, h = 0;
              if (b && a.nodeType === 1) {
                  d = b.toLowerCase().split(p),
                  g = d.length;
                  for (; h < g; h++) e = d[h],
                  e && (c = f.propFix[e] || e, f.attr(a, e, ""), a.removeAttribute(v ? e: c), u.test(e) && c in a && (a[c] = !1))
              }
          },
          attrHooks: {
              type: {
                  set: function(a, b) {
                      if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed");
                      else if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) {
                          var c = a.value;
                          a.setAttribute("type", b),
                          c && (a.value = c);
                          return b
                      }
                  }
              },
              value: {
                  get: function(a, b) {
                      if (w && f.nodeName(a, "button")) return w.get(a, b);
                      return b in a ? a.value: null
                  },
                  set: function(a, b, c) {
                      if (w && f.nodeName(a, "button")) return w.set(a, b, c);
                      a.value = b
                  }
              }
          },
          propFix: {
              tabindex: "tabIndex",
              readonly: "readOnly",
              "for": "htmlFor",
              "class": "className",
              maxlength: "maxLength",
              cellspacing: "cellSpacing",
              cellpadding: "cellPadding",
              rowspan: "rowSpan",
              colspan: "colSpan",
              usemap: "useMap",
              frameborder: "frameBorder",
              contenteditable: "contentEditable"
          },
          prop: function(a, c, d) {
              var e, g, h, i = a.nodeType;
              if ( !! a && i !== 3 && i !== 8 && i !== 2) {
                  h = i !== 1 || !f.isXMLDoc(a),
                  h && (c = f.propFix[c] || c, g = f.propHooks[c]);
                  return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e: a[c] = d: g && "get" in g && (e = g.get(a, c)) !== null ? e: a[c]
              }
          },
          propHooks: {
              tabIndex: {
                  get: function(a) {
                      var c = a.getAttributeNode("tabindex");
                      return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b
                  }
              }
          }
      }),
      f.attrHooks.tabindex = f.propHooks.tabIndex,
      x = {
          get: function(a, c) {
              var d, e = f.prop(a, c);
              return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
          },
          set: function(a, b, c) {
              var d;
              b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase()));
              return c
          }
      },
      v || (y = {
          name: !0,
          id: !0
      },
      w = f.valHooks.button = {
          get: function(a, c) {
              var d;
              d = a.getAttributeNode(c);
              return d && (y[c] ? d.nodeValue !== "": d.specified) ? d.nodeValue: b
          },
          set: function(a, b, d) {
              var e = a.getAttributeNode(d);
              e || (e = c.createAttribute(d), a.setAttributeNode(e));
              return e.nodeValue = b + ""
          }
      },
      f.attrHooks.tabindex.set = w.set, f.each(["width", "height"],
      function(a, b) {
          f.attrHooks[b] = f.extend(f.attrHooks[b], {
              set: function(a, c) {
                  if (c === "") {
                      a.setAttribute(b, "auto");
                      return c
                  }
              }
          })
      }), f.attrHooks.contenteditable = {
          get: w.get,
          set: function(a, b, c) {
              b === "" && (b = "false"),
              w.set(a, b, c)
          }
      }),
      f.support.hrefNormalized || f.each(["href", "src", "width", "height"],
      function(a, c) {
          f.attrHooks[c] = f.extend(f.attrHooks[c], {
              get: function(a) {
                  var d = a.getAttribute(c, 2);
                  return d === null ? b: d
              }
          })
      }),
      f.support.style || (f.attrHooks.style = {
          get: function(a) {
              return a.style.cssText.toLowerCase() || b
          },
          set: function(a, b) {
              return a.style.cssText = "" + b
          }
      }),
      f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {
          get: function(a) {
              var b = a.parentNode;
              b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
              return null
          }
      })),
      f.support.enctype || (f.propFix.enctype = "encoding"),
      f.support.checkOn || f.each(["radio", "checkbox"],
      function() {
          f.valHooks[this] = {
              get: function(a) {
                  return a.getAttribute("value") === null ? "on": a.value
              }
          }
      }),
      f.each(["radio", "checkbox"],
      function() {
          f.valHooks[this] = f.extend(f.valHooks[this], {
              set: function(a, b) {
                  if (f.isArray(b)) return a.checked = f.inArray(f(a).val(), b) >= 0
              }
          })
      });
      var z = /^(?:textarea|input|select)$/i,
      A = /^([^\.]*)?(?:\.(.+))?$/,
      B = /\bhover(\.\S+)?\b/,
      C = /^key/,
      D = /^(?:mouse|contextmenu)|click/,
      E = /^(?:focusinfocus|focusoutblur)$/,
      F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
      G = function(a) {
          var b = F.exec(a);
          b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)"));
          return b
      },
      H = function(a, b) {
          var c = a.attributes || {};
          return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value))
      },
      I = function(a) {
          return f.event.special.hover ? a: a.replace(B, "mouseenter$1 mouseleave$1")
      };
      f.event = {
          add: function(a, c, d, e, g) {
              var h, i, j, k, l, m, n, o, p, q, r, s;
              if (! (a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
                  d.handler && (p = d, d = p.handler),
                  d.guid || (d.guid = f.guid++),
                  j = h.events,
                  j || (h.events = j = {}),
                  i = h.handle,
                  i || (h.handle = i = function(a) {
                      return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b
                  },
                  i.elem = a),
                  c = f.trim(I(c)).split(" ");
                  for (k = 0; k < c.length; k++) {
                      l = A.exec(c[k]) || [],
                      m = l[1],
                      n = (l[2] || "").split(".").sort(),
                      s = f.event.special[m] || {},
                      m = (g ? s.delegateType: s.bindType) || m,
                      s = f.event.special[m] || {},
                      o = f.extend({
                          type: m,
                          origType: l[1],
                          data: e,
                          handler: d,
                          guid: d.guid,
                          selector: g,
                          quick: G(g),
                          namespace: n.join(".")
                      },
                      p),
                      r = j[m];
                      if (!r) {
                          r = j[m] = [],
                          r.delegateCount = 0;
                          if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i)
                      }
                      s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)),
                      g ? r.splice(r.delegateCount++, 0, o) : r.push(o),
                      f.event.global[m] = !0
                  }
                  a = null
              }
          },
          global: {},
          remove: function(a, b, c, d, e) {
              var g = f.hasData(a) && f._data(a),
              h,
              i,
              j,
              k,
              l,
              m,
              n,
              o,
              p,
              q,
              r,
              s;
              if ( !! g && !!(o = g.events)) {
                  b = f.trim(I(b || "")).split(" ");
                  for (h = 0; h < b.length; h++) {
                      i = A.exec(b[h]) || [],
                      j = k = i[1],
                      l = i[2];
                      if (!j) {
                          for (j in o) f.event.remove(a, j + b[h], c, d, !0);
                          continue
                      }
                      p = f.event.special[j] || {},
                      j = (d ? p.delegateType: p.bindType) || j,
                      r = o[j] || [],
                      m = r.length,
                      l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                      for (n = 0; n < r.length; n++) s = r[n],
                      (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s));
                      r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j])
                  }
                  f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0))
              }
          },
          customEvent: {
              getData: !0,
              setData: !0,
              changeData: !0
          },
          trigger: function(c, d, e, g) {
              if (!e || e.nodeType !== 3 && e.nodeType !== 8) {
                  var h = c.type || c,
                  i = [],
                  j,
                  k,
                  l,
                  m,
                  n,
                  o,
                  p,
                  q,
                  r,
                  s;
                  if (E.test(h + f.event.triggered)) return;
                  h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0),
                  h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
                  if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return;
                  c = typeof c == "object" ? c[f.expando] ? c: new f.Event(h, c) : new f.Event(h),
                  c.type = h,
                  c.isTrigger = !0,
                  c.exclusive = k,
                  c.namespace = i.join("."),
                  c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null,
                  o = h.indexOf(":") < 0 ? "on" + h: "";
                  if (!e) {
                      j = f.cache;
                      for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0);
                      return
                  }
                  c.result = b,
                  c.target || (c.target = e),
                  d = d != null ? f.makeArray(d) : [],
                  d.unshift(c),
                  p = f.event.special[h] || {};
                  if (p.trigger && p.trigger.apply(e, d) === !1) return;
                  r = [[e, p.bindType || h]];
                  if (!g && !p.noBubble && !f.isWindow(e)) {
                      s = p.delegateType || h,
                      m = E.test(s + h) ? e: e.parentNode,
                      n = null;
                      for (; m; m = m.parentNode) r.push([m, s]),
                      n = m;
                      n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s])
                  }
                  for (l = 0; l < r.length && !c.isPropagationStopped(); l++) m = r[l][0],
                  c.type = r[l][1],
                  q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"),
                  q && q.apply(m, d),
                  q = o && m[o],
                  q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault();
                  c.type = h,
                  !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n));
                  return c.result
              }
          },
          dispatch: function(c) {
              c = f.event.fix(c || a.event);
              var d = (f._data(this, "events") || {})[c.type] || [],
              e = d.delegateCount,
              g = [].slice.call(arguments, 0),
              h = !c.exclusive && !c.namespace,
              i = [],
              j,
              k,
              l,
              m,
              n,
              o,
              p,
              q,
              r,
              s,
              t;
              g[0] = c,
              c.delegateTarget = this;
              if (e && !c.target.disabled && (!c.button || c.type !== "click")) {
                  m = f(this),
                  m.context = this.ownerDocument || this;
                  for (l = c.target; l != this; l = l.parentNode || this) {
                      o = {},
                      q = [],
                      m[0] = l;
                      for (j = 0; j < e; j++) r = d[j],
                      s = r.selector,
                      o[s] === b && (o[s] = r.quick ? H(l, r.quick) : m.is(s)),
                      o[s] && q.push(r);
                      q.length && i.push({
                          elem: l,
                          matches: q
                      })
                  }
              }
              d.length > e && i.push({
                  elem: this,
                  matches: d.slice(e)
              });
              for (j = 0; j < i.length && !c.isPropagationStopped(); j++) {
                  p = i[j],
                  c.currentTarget = p.elem;
                  for (k = 0; k < p.matches.length && !c.isImmediatePropagationStopped(); k++) {
                      r = p.matches[k];
                      if (h || !c.namespace && !r.namespace || c.namespace_re && c.namespace_re.test(r.namespace)) c.data = r.data,
                      c.handleObj = r,
                      n = ((f.event.special[r.origType] || {}).handle || r.handler).apply(p.elem, g),
                      n !== b && (c.result = n, n === !1 && (c.preventDefault(), c.stopPropagation()))
                  }
              }
              return c.result
          },
          props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
          fixHooks: {},
          keyHooks: {
              props: "char charCode key keyCode".split(" "),
              filter: function(a, b) {
                  a.which == null && (a.which = b.charCode != null ? b.charCode: b.keyCode);
                  return a
              }
          },
          mouseHooks: {
              props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
              filter: function(a, d) {
                  var e, f, g, h = d.button,
                  i = d.fromElement;
                  a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)),
                  !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement: i),
                  !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
                  return a
              }
          },
          fix: function(a) {
              if (a[f.expando]) return a;
              var d, e, g = a,
              h = f.event.fixHooks[a.type] || {},
              i = h.props ? this.props.concat(h.props) : this.props;
              a = f.Event(g);
              for (d = i.length; d;) e = i[--d],
              a[e] = g[e];
              a.target || (a.target = g.srcElement || c),
              a.target.nodeType === 3 && (a.target = a.target.parentNode),
              a.metaKey === b && (a.metaKey = a.ctrlKey);
              return h.filter ? h.filter(a, g) : a
          },
          special: {
              ready: {
                  setup: f.bindReady
              },
              load: {
                  noBubble: !0
              },
              focus: {
                  delegateType: "focusin"
              },
              blur: {
                  delegateType: "focusout"
              },
              beforeunload: {
                  setup: function(a, b, c) {
                      f.isWindow(this) && (this.onbeforeunload = c)
                  },
                  teardown: function(a, b) {
                      this.onbeforeunload === b && (this.onbeforeunload = null)
                  }
              }
          },
          simulate: function(a, b, c, d) {
              var e = f.extend(new f.Event, c, {
                  type: a,
                  isSimulated: !0,
                  originalEvent: {}
              });
              d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e),
              e.isDefaultPrevented() && c.preventDefault()
          }
      },
      f.event.handle = f.event.dispatch,
      f.removeEvent = c.removeEventListener ?
      function(a, b, c) {
          a.removeEventListener && a.removeEventListener(b, c, !1)
      }: function(a, b, c) {
          a.detachEvent && a.detachEvent("on" + b, c)
      },
      f.Event = function(a, b) {
          if (! (this instanceof f.Event)) return new f.Event(a, b);
          a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K: J) : this.type = a,
          b && f.extend(this, b),
          this.timeStamp = a && a.timeStamp || f.now(),
          this[f.expando] = !0
      },
      f.Event.prototype = {
          preventDefault: function() {
              this.isDefaultPrevented = K;
              var a = this.originalEvent; ! a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
          },
          stopPropagation: function() {
              this.isPropagationStopped = K;
              var a = this.originalEvent; ! a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
          },
          stopImmediatePropagation: function() {
              this.isImmediatePropagationStopped = K,
              this.stopPropagation()
          },
          isDefaultPrevented: J,
          isPropagationStopped: J,
          isImmediatePropagationStopped: J
      },
      f.each({
          mouseenter: "mouseover",
          mouseleave: "mouseout"
      },
      function(a, b) {
          f.event.special[a] = {
              delegateType: b,
              bindType: b,
              handle: function(a) {
                  var c = this,
                  d = a.relatedTarget,
                  e = a.handleObj,
                  g = e.selector,
                  h;
                  if (!d || d !== c && !f.contains(c, d)) a.type = e.origType,
                  h = e.handler.apply(this, arguments),
                  a.type = b;
                  return h
              }
          }
      }),
      f.support.submitBubbles || (f.event.special.submit = {
          setup: function() {
              if (f.nodeName(this, "form")) return ! 1;
              f.event.add(this, "click._submit keypress._submit",
              function(a) {
                  var c = a.target,
                  d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form: b;
                  d && !d._submit_attached && (f.event.add(d, "submit._submit",
                  function(a) {
                      this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0)
                  }), d._submit_attached = !0)
              })
          },
          teardown: function() {
              if (f.nodeName(this, "form")) return ! 1;
              f.event.remove(this, "._submit")
          }
      }),
      f.support.changeBubbles || (f.event.special.change = {
          setup: function() {
              if (z.test(this.nodeName)) {
                  if (this.type === "checkbox" || this.type === "radio") f.event.add(this, "propertychange._change",
                  function(a) {
                      a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                  }),
                  f.event.add(this, "click._change",
                  function(a) {
                      this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0))
                  });
                  return ! 1
              }
              f.event.add(this, "beforeactivate._change",
              function(a) {
                  var b = a.target;
                  z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change",
                  function(a) {
                      this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0)
                  }), b._change_attached = !0)
              })
          },
          handle: function(a) {
              var b = a.target;
              if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments)
          },
          teardown: function() {
              f.event.remove(this, "._change");
              return z.test(this.nodeName)
          }
      }),
      f.support.focusinBubbles || f.each({
          focus: "focusin",
          blur: "focusout"
      },
      function(a, b) {
          var d = 0,
          e = function(a) {
              f.event.simulate(b, a.target, f.event.fix(a), !0)
          };
          f.event.special[b] = {
              setup: function() {
                  d++===0 && c.addEventListener(a, e, !0)
              },
              teardown: function() {--d === 0 && c.removeEventListener(a, e, !0)
              }
          }
      }),
      f.fn.extend({
          on: function(a, c, d, e, g) {
              var h, i;
              if (typeof a == "object") {
                  typeof c != "string" && (d = c, c = b);
                  for (i in a) this.on(i, c, d, a[i], g);
                  return this
              }
              d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
              if (e === !1) e = J;
              else if (!e) return this;
              g === 1 && (h = e, e = function(a) {
                  f().off(a);
                  return h.apply(this, arguments)
              },
              e.guid = h.guid || (h.guid = f.guid++));
              return this.each(function() {
                  f.event.add(this, a, e, d, c)
              })
          },
          one: function(a, b, c, d) {
              return this.on.call(this, a, b, c, d, 1)
          },
          off: function(a, c, d) {
              if (a && a.preventDefault && a.handleObj) {
                  var e = a.handleObj;
                  f(a.delegateTarget).off(e.namespace ? e.type + "." + e.namespace: e.type, e.selector, e.handler);
                  return this
              }
              if (typeof a == "object") {
                  for (var g in a) this.off(g, c, a[g]);
                  return this
              }
              if (c === !1 || typeof c == "function") d = c,
              c = b;
              d === !1 && (d = J);
              return this.each(function() {
                  f.event.remove(this, a, d, c)
              })
          },
          bind: function(a, b, c) {
              return this.on(a, null, b, c)
          },
          unbind: function(a, b) {
              return this.off(a, null, b)
          },
          live: function(a, b, c) {
              f(this.context).on(a, this.selector, b, c);
              return this
          },
          die: function(a, b) {
              f(this.context).off(a, this.selector || "**", b);
              return this
          },
          delegate: function(a, b, c, d) {
              return this.on(b, a, c, d)
          },
          undelegate: function(a, b, c) {
              return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c)
          },
          trigger: function(a, b) {
              return this.each(function() {
                  f.event.trigger(a, b, this)
              })
          },
          triggerHandler: function(a, b) {
              if (this[0]) return f.event.trigger(a, b, this[0], !0)
          },
          toggle: function(a) {
              var b = arguments,
              c = a.guid || f.guid++,
              d = 0,
              e = function(c) {
                  var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
                  f._data(this, "lastToggle" + a.guid, e + 1),
                  c.preventDefault();
                  return b[e].apply(this, arguments) || !1
              };
              e.guid = c;
              while (d < b.length) b[d++].guid = c;
              return this.click(e)
          },
          hover: function(a, b) {
              return this.mouseenter(a).mouseleave(b || a)
          }
      }),
      f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
      function(a, b) {
          f.fn[b] = function(a, c) {
              c == null && (c = a, a = null);
              return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
          },
          f.attrFn && (f.attrFn[b] = !0),
          C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks),
          D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks)
      }),
      function() {
          function x(a, b, c, e, f, g) {
              for (var h = 0,
              i = e.length; h < i; h++) {
                  var j = e[h];
                  if (j) {
                      var k = !1;
                      j = j[a];
                      while (j) {
                          if (j[d] === c) {
                              k = e[j.sizset];
                              break
                          }
                          if (j.nodeType === 1) {
                              g || (j[d] = c, j.sizset = h);
                              if (typeof b != "string") {
                                  if (j === b) {
                                      k = !0;
                                      break
                                  }
                              } else if (m.filter(b, [j]).length > 0) {
                                  k = j;
                                  break
                              }
                          }
                          j = j[a]
                      }
                      e[h] = k
                  }
              }
          }
          function w(a, b, c, e, f, g) {
              for (var h = 0,
              i = e.length; h < i; h++) {
                  var j = e[h];
                  if (j) {
                      var k = !1;
                      j = j[a];
                      while (j) {
                          if (j[d] === c) {
                              k = e[j.sizset];
                              break
                          }
                          j.nodeType === 1 && !g && (j[d] = c, j.sizset = h);
                          if (j.nodeName.toLowerCase() === b) {
                              k = j;
                              break
                          }
                          j = j[a]
                      }
                      e[h] = k
                  }
              }
          }
          var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
          d = "sizcache" + (Math.random() + "").replace(".", ""),
          e = 0,
          g = Object.prototype.toString,
          h = !1,
          i = !0,
          j = /\\/g,
          k = /\r\n/g,
          l = /\W/; [0, 0].sort(function() {
              i = !1;
              return 0
          });
          var m = function(b, d, e, f) {
              e = e || [],
              d = d || c;
              var h = d;
              if (d.nodeType !== 1 && d.nodeType !== 9) return [];
              if (!b || typeof b != "string") return e;
              var i, j, k, l, n, q, r, t, u = !0,
              v = m.isXML(d),
              w = [],
              x = b;
              do {
                  a.exec(""), i = a.exec(x);
                  if (i) {
                      x = i[3],
                      w.push(i[1]);
                      if (i[2]) {
                          l = i[3];
                          break
                      }
                  }
              } while ( i );
              if (w.length > 1 && p.exec(b)) if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f);
              else {
                  j = o.relative[w[0]] ? [d] : m(w.shift(), d);
                  while (w.length) b = w.shift(),
                  o.relative[b] && (b += w.shift()),
                  j = y(b, j, f)
              } else { ! f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]);
                  if (d) {
                      n = f ? {
                          expr: w.pop(),
                          set: s(f)
                      }: m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode: d, v),
                      j = n.expr ? m.filter(n.expr, n.set) : n.set,
                      w.length > 0 ? k = s(j) : u = !1;
                      while (w.length) q = w.pop(),
                      r = q,
                      o.relative[q] ? r = w.pop() : q = "",
                      r == null && (r = d),
                      o.relative[q](k, r, v)
                  } else k = w = []
              }
              k || (k = j),
              k || m.error(q || b);
              if (g.call(k) === "[object Array]") if (!u) e.push.apply(e, k);
              else if (d && d.nodeType === 1) for (t = 0; k[t] != null; t++) k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t]);
              else for (t = 0; k[t] != null; t++) k[t] && k[t].nodeType === 1 && e.push(j[t]);
              else s(k, e);
              l && (m(l, h, e, f), m.uniqueSort(e));
              return e
          };
          m.uniqueSort = function(a) {
              if (u) {
                  h = i,
                  a.sort(u);
                  if (h) for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1)
              }
              return a
          },
          m.matches = function(a, b) {
              return m(a, null, null, b)
          },
          m.matchesSelector = function(a, b) {
              return m(b, null, null, [a]).length > 0
          },
          m.find = function(a, b, c) {
              var d, e, f, g, h, i;
              if (!a) return [];
              for (e = 0, f = o.order.length; e < f; e++) {
                  h = o.order[e];
                  if (g = o.leftMatch[h].exec(a)) {
                      i = g[1],
                      g.splice(1, 1);
                      if (i.substr(i.length - 1) !== "\\") {
                          g[1] = (g[1] || "").replace(j, ""),
                          d = o.find[h](g, b, c);
                          if (d != null) {
                              a = a.replace(o.match[h], "");
                              break
                          }
                      }
                  }
              }
              d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []);
              return {
                  set: d,
                  expr: a
              }
          },
          m.filter = function(a, c, d, e) {
              var f, g, h, i, j, k, l, n, p, q = a,
              r = [],
              s = c,
              t = c && c[0] && m.isXML(c[0]);
              while (a && c.length) {
                  for (h in o.filter) if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                      k = o.filter[h],
                      l = f[1],
                      g = !1,
                      f.splice(1, 1);
                      if (l.substr(l.length - 1) === "\\") continue;
                      s === r && (r = []);
                      if (o.preFilter[h]) {
                          f = o.preFilter[h](f, s, d, r, e, t);
                          if (!f) g = i = !0;
                          else if (f === !0) continue
                      }
                      if (f) for (n = 0; (j = s[n]) != null; n++) j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0));
                      if (i !== b) {
                          d || (s = r),
                          a = a.replace(o.match[h], "");
                          if (!g) return [];
                          break
                      }
                  }
                  if (a === q) if (g == null) m.error(a);
                  else break;
                  q = a
              }
              return s
          },
          m.error = function(a) {
              throw new Error("Syntax error, unrecognized expression: " + a)
          };
          var n = m.getText = function(a) {
              var b, c, d = a.nodeType,
              e = "";
              if (d) {
                  if (d === 1 || d === 9) {
                      if (typeof a.textContent == "string") return a.textContent;
                      if (typeof a.innerText == "string") return a.innerText.replace(k, "");
                      for (a = a.firstChild; a; a = a.nextSibling) e += n(a)
                  } else if (d === 3 || d === 4) return a.nodeValue
              } else for (b = 0; c = a[b]; b++) c.nodeType !== 8 && (e += n(c));
              return e
          },
          o = m.selectors = {
              order: ["ID", "NAME", "TAG"],
              match: {
                  ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                  CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                  NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                  ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                  TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                  CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                  POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                  PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
              },
              leftMatch: {},
              attrMap: {
                  "class": "className",
                  "for": "htmlFor"
              },
              attrHandle: {
                  href: function(a) {
                      return a.getAttribute("href")
                  },
                  type: function(a) {
                      return a.getAttribute("type")
                  }
              },
              relative: {
                  "+": function(a, b) {
                      var c = typeof b == "string",
                      d = c && !l.test(b),
                      e = c && !d;
                      d && (b = b.toLowerCase());
                      for (var f = 0,
                      g = a.length,
                      h; f < g; f++) if (h = a[f]) {
                          while ((h = h.previousSibling) && h.nodeType !== 1);
                          a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
                      }
                      e && m.filter(b, a, !0)
                  },
                  ">": function(a, b) {
                      var c, d = typeof b == "string",
                      e = 0,
                      f = a.length;
                      if (d && !l.test(b)) {
                          b = b.toLowerCase();
                          for (; e < f; e++) {
                              c = a[e];
                              if (c) {
                                  var g = c.parentNode;
                                  a[e] = g.nodeName.toLowerCase() === b ? g: !1
                              }
                          }
                      } else {
                          for (; e < f; e++) c = a[e],
                          c && (a[e] = d ? c.parentNode: c.parentNode === b);
                          d && m.filter(b, a, !0)
                      }
                  },
                  "": function(a, b, c) {
                      var d, f = e++,
                      g = x;
                      typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w),
                      g("parentNode", b, f, a, d, c)
                  },
                  "~": function(a, b, c) {
                      var d, f = e++,
                      g = x;
                      typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w),
                      g("previousSibling", b, f, a, d, c)
                  }
              },
              find: {
                  ID: function(a, b, c) {
                      if (typeof b.getElementById != "undefined" && !c) {
                          var d = b.getElementById(a[1]);
                          return d && d.parentNode ? [d] : []
                      }
                  },
                  NAME: function(a, b) {
                      if (typeof b.getElementsByName != "undefined") {
                          var c = [],
                          d = b.getElementsByName(a[1]);
                          for (var e = 0,
                          f = d.length; e < f; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]);
                          return c.length === 0 ? null: c
                      }
                  },
                  TAG: function(a, b) {
                      if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1])
                  }
              },
              preFilter: {
                  CLASS: function(a, b, c, d, e, f) {
                      a = " " + a[1].replace(j, "") + " ";
                      if (f) return a;
                      for (var g = 0,
                      h; (h = b[g]) != null; g++) h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                      return ! 1
                  },
                  ID: function(a) {
                      return a[1].replace(j, "")
                  },
                  TAG: function(a, b) {
                      return a[1].replace(j, "").toLowerCase()
                  },
                  CHILD: function(a) {
                      if (a[1] === "nth") {
                          a[2] || m.error(a[0]),
                          a[2] = a[2].replace(/^\+|\s*/g, "");
                          var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                          a[2] = b[1] + (b[2] || 1) - 0,
                          a[3] = b[3] - 0
                      } else a[2] && m.error(a[0]);
                      a[0] = e++;
                      return a
                  },
                  ATTR: function(a, b, c, d, e, f) {
                      var g = a[1] = a[1].replace(j, ""); ! f && o.attrMap[g] && (a[1] = o.attrMap[g]),
                      a[4] = (a[4] || a[5] || "").replace(j, ""),
                      a[2] === "~=" && (a[4] = " " + a[4] + " ");
                      return a
                  },
                  PSEUDO: function(b, c, d, e, f) {
                      if (b[1] === "not") if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) b[3] = m(b[3], null, null, c);
                      else {
                          var g = m.filter(b[3], c, d, !0 ^ f);
                          d || e.push.apply(e, g);
                          return ! 1
                      } else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return ! 0;
                      return b
                  },
                  POS: function(a) {
                      a.unshift(!0);
                      return a
                  }
              },
              filters: {
                  enabled: function(a) {
                      return a.disabled === !1 && a.type !== "hidden"
                  },
                  disabled: function(a) {
                      return a.disabled === !0
                  },
                  checked: function(a) {
                      return a.checked === !0
                  },
                  selected: function(a) {
                      a.parentNode && a.parentNode.selectedIndex;
                      return a.selected === !0
                  },
                  parent: function(a) {
                      return !! a.firstChild
                  },
                  empty: function(a) {
                      return ! a.firstChild
                  },
                  has: function(a, b, c) {
                      return !! m(c[3], a).length
                  },
                  header: function(a) {
                      return /h\d/i.test(a.nodeName)
                  },
                  text: function(a) {
                      var b = a.getAttribute("type"),
                      c = a.type;
                      return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null)
                  },
                  radio: function(a) {
                      return a.nodeName.toLowerCase() === "input" && "radio" === a.type
                  },
                  checkbox: function(a) {
                      return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
                  },
                  file: function(a) {
                      return a.nodeName.toLowerCase() === "input" && "file" === a.type
                  },
                  password: function(a) {
                      return a.nodeName.toLowerCase() === "input" && "password" === a.type
                  },
                  submit: function(a) {
                      var b = a.nodeName.toLowerCase();
                      return (b === "input" || b === "button") && "submit" === a.type
                  },
                  image: function(a) {
                      return a.nodeName.toLowerCase() === "input" && "image" === a.type
                  },
                  reset: function(a) {
                      var b = a.nodeName.toLowerCase();
                      return (b === "input" || b === "button") && "reset" === a.type
                  },
                  button: function(a) {
                      var b = a.nodeName.toLowerCase();
                      return b === "input" && "button" === a.type || b === "button"
                  },
                  input: function(a) {
                      return /input|select|textarea|button/i.test(a.nodeName)
                  },
                  focus: function(a) {
                      return a === a.ownerDocument.activeElement
                  }
              },
              setFilters: {
                  first: function(a, b) {
                      return b === 0
                  },
                  last: function(a, b, c, d) {
                      return b === d.length - 1
                  },
                  even: function(a, b) {
                      return b % 2 === 0
                  },
                  odd: function(a, b) {
                      return b % 2 === 1
                  },
                  lt: function(a, b, c) {
                      return b < c[3] - 0
                  },
                  gt: function(a, b, c) {
                      return b > c[3] - 0
                  },
                  nth: function(a, b, c) {
                      return c[3] - 0 === b
                  },
                  eq: function(a, b, c) {
                      return c[3] - 0 === b
                  }
              },
              filter: {
                  PSEUDO: function(a, b, c, d) {
                      var e = b[1],
                      f = o.filters[e];
                      if (f) return f(a, c, b, d);
                      if (e === "contains") return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0;
                      if (e === "not") {
                          var g = b[3];
                          for (var h = 0,
                          i = g.length; h < i; h++) if (g[h] === a) return ! 1;
                          return ! 0
                      }
                      m.error(e)
                  },
                  CHILD: function(a, b) {
                      var c, e, f, g, h, i, j, k = b[1],
                      l = a;
                      switch (k) {
                      case "only":
                      case "first":
                          while (l = l.previousSibling) if (l.nodeType === 1) return ! 1;
                          if (k === "first") return ! 0;
                          l = a;
                      case "last":
                          while (l = l.nextSibling) if (l.nodeType === 1) return ! 1;
                          return ! 0;
                      case "nth":
                          c = b[2],
                          e = b[3];
                          if (c === 1 && e === 0) return ! 0;
                          f = b[0],
                          g = a.parentNode;
                          if (g && (g[d] !== f || !a.nodeIndex)) {
                              i = 0;
                              for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i);
                              g[d] = f
                          }
                          j = a.nodeIndex - e;
                          return c === 0 ? j === 0 : j % c === 0 && j / c >= 0
                      }
                  },
                  ID: function(a, b) {
                      return a.nodeType === 1 && a.getAttribute("id") === b
                  },
                  TAG: function(a, b) {
                      return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b
                  },
                  CLASS: function(a, b) {
                      return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                  },
                  ATTR: function(a, b) {
                      var c = b[1],
                      d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c),
                      e = d + "",
                      f = b[2],
                      g = b[4];
                      return d == null ? f === "!=": !f && m.attr ? d != null: f === "=" ? e === g: f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g: f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g: f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-": !1 : e && d !== !1
                  },
                  POS: function(a, b, c, d) {
                      var e = b[2],
                      f = o.setFilters[e];
                      if (f) return f(a, c, b, d)
                  }
              }
          },
          p = o.match.POS,
          q = function(a, b) {
              return "\\" + (b - 0 + 1)
          };
          for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source),
          o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q));
          var s = function(a, b) {
              a = Array.prototype.slice.call(a, 0);
              if (b) {
                  b.push.apply(b, a);
                  return b
              }
              return a
          };
          try {
              Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType
          } catch(t) {
              s = function(a, b) {
                  var c = 0,
                  d = b || [];
                  if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a);
                  else if (typeof a.length == "number") for (var e = a.length; c < e; c++) d.push(a[c]);
                  else for (; a[c]; c++) d.push(a[c]);
                  return d
              }
          }
          var u, v;
          c.documentElement.compareDocumentPosition ? u = function(a, b) {
              if (a === b) {
                  h = !0;
                  return 0
              }
              if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1;
              return a.compareDocumentPosition(b) & 4 ? -1 : 1
          }: (u = function(a, b) {
              if (a === b) {
                  h = !0;
                  return 0
              }
              if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
              var c, d, e = [],
              f = [],
              g = a.parentNode,
              i = b.parentNode,
              j = g;
              if (g === i) return v(a, b);
              if (!g) return - 1;
              if (!i) return 1;
              while (j) e.unshift(j),
              j = j.parentNode;
              j = i;
              while (j) f.unshift(j),
              j = j.parentNode;
              c = e.length,
              d = f.length;
              for (var k = 0; k < c && k < d; k++) if (e[k] !== f[k]) return v(e[k], f[k]);
              return k === c ? v(a, f[k], -1) : v(e[k], b, 1)
          },
          v = function(a, b, c) {
              if (a === b) return c;
              var d = a.nextSibling;
              while (d) {
                  if (d === b) return - 1;
                  d = d.nextSibling
              }
              return 1
          }),
          function() {
              var a = c.createElement("div"),
              d = "script" + (new Date).getTime(),
              e = c.documentElement;
              a.innerHTML = "<a name='" + d + "'/>",
              e.insertBefore(a, e.firstChild),
              c.getElementById(d) && (o.find.ID = function(a, c, d) {
                  if (typeof c.getElementById != "undefined" && !d) {
                      var e = c.getElementById(a[1]);
                      return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b: []
                  }
              },
              o.filter.ID = function(a, b) {
                  var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
                  return a.nodeType === 1 && c && c.nodeValue === b
              }),
              e.removeChild(a),
              e = a = null
          } (),
          function() {
              var a = c.createElement("div");
              a.appendChild(c.createComment("")),
              a.getElementsByTagName("*").length > 0 && (o.find.TAG = function(a, b) {
                  var c = b.getElementsByTagName(a[1]);
                  if (a[1] === "*") {
                      var d = [];
                      for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]);
                      c = d
                  }
                  return c
              }),
              a.innerHTML = "<a href='#'></a>",
              a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function(a) {
                  return a.getAttribute("href", 2)
              }),
              a = null
          } (),
          c.querySelectorAll &&
          function() {
              var a = m,
              b = c.createElement("div"),
              d = "__sizzle__";
              b.innerHTML = "<p class='TEST'></p>";
              if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
                  m = function(b, e, f, g) {
                      e = e || c;
                      if (!g && !m.isXML(e)) {
                          var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                          if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                              if (h[1]) return s(e.getElementsByTagName(b), f);
                              if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f)
                          }
                          if (e.nodeType === 9) {
                              if (b === "body" && e.body) return s([e.body], f);
                              if (h && h[3]) {
                                  var i = e.getElementById(h[3]);
                                  if (!i || !i.parentNode) return s([], f);
                                  if (i.id === h[3]) return s([i], f)
                              }
                              try {
                                  return s(e.querySelectorAll(b), f)
                              } catch(j) {}
                          } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") {
                              var k = e,
                              l = e.getAttribute("id"),
                              n = l || d,
                              p = e.parentNode,
                              q = /^\s*[+~]/.test(b);
                              l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n),
                              q && p && (e = e.parentNode);
                              try {
                                  if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f)
                              } catch(r) {} finally {
                                  l || k.removeAttribute("id")
                              }
                          }
                      }
                      return a(b, e, f, g)
                  };
                  for (var e in a) m[e] = a[e];
                  b = null
              }
          } (),
          function() {
              var a = c.documentElement,
              b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
              if (b) {
                  var d = !b.call(c.createElement("div"), "div"),
                  e = !1;
                  try {
                      b.call(c.documentElement, "[test!='']:sizzle")
                  } catch(f) {
                      e = !0
                  }
                  m.matchesSelector = function(a, c) {
                      c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                      if (!m.isXML(a)) try {
                          if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) {
                              var f = b.call(a, c);
                              if (f || !d || a.document && a.document.nodeType !== 11) return f
                          }
                      } catch(g) {}
                      return m(c, null, null, [a]).length > 0
                  }
              }
          } (),
          function() {
              var a = c.createElement("div");
              a.innerHTML = "<div class='test e'></div><div class='test'></div>";
              if ( !! a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
                  a.lastChild.className = "e";
                  if (a.getElementsByClassName("e").length === 1) return;
                  o.order.splice(1, 0, "CLASS"),
                  o.find.CLASS = function(a, b, c) {
                      if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1])
                  },
                  a = null
              }
          } (),
          c.documentElement.contains ? m.contains = function(a, b) {
              return a !== b && (a.contains ? a.contains(b) : !0)
          }: c.documentElement.compareDocumentPosition ? m.contains = function(a, b) {
              return !! (a.compareDocumentPosition(b) & 16)
          }: m.contains = function() {
              return ! 1
          },
          m.isXML = function(a) {
              var b = (a ? a.ownerDocument || a: 0).documentElement;
              return b ? b.nodeName !== "HTML": !1
          };
          var y = function(a, b, c) {
              var d, e = [],
              f = "",
              g = b.nodeType ? [b] : b;
              while (d = o.match.PSEUDO.exec(a)) f += d[0],
              a = a.replace(o.match.PSEUDO, "");
              a = o.relative[a] ? a + "*": a;
              for (var h = 0,
              i = g.length; h < i; h++) m(a, g[h], e, c);
              return m.filter(f, e)
          };
          m.attr = f.attr,
          m.selectors.attrMap = {},
          f.find = m,
          f.expr = m.selectors,
          f.expr[":"] = f.expr.filters,
          f.unique = m.uniqueSort,
          f.text = m.getText,
          f.isXMLDoc = m.isXML,
          f.contains = m.contains
      } ();
      var L = /Until$/,
      M = /^(?:parents|prevUntil|prevAll)/,
      N = /,/,
      O = /^.[^:#\[\.,]*$/,
      P = Array.prototype.slice,
      Q = f.expr.match.POS,
      R = {
          children: !0,
          contents: !0,
          next: !0,
          prev: !0
      };
      f.fn.extend({
          find: function(a) {
              var b = this,
              c, d;
              if (typeof a != "string") return f(a).filter(function() {
                  for (c = 0, d = b.length; c < d; c++) if (f.contains(b[c], this)) return ! 0
              });
              var e = this.pushStack("", "find", a),
              g,
              h,
              i;
              for (c = 0, d = this.length; c < d; c++) {
                  g = e.length,
                  f.find(a, this[c], e);
                  if (c > 0) for (h = g; h < e.length; h++) for (i = 0; i < g; i++) if (e[i] === e[h]) {
                      e.splice(h--, 1);
                      break
                  }
              }
              return e
          },
          has: function(a) {
              var b = f(a);
              return this.filter(function() {
                  for (var a = 0,
                  c = b.length; a < c; a++) if (f.contains(this, b[a])) return ! 0
              })
          },
          not: function(a) {
              return this.pushStack(T(this, a, !1), "not", a)
          },
          filter: function(a) {
              return this.pushStack(T(this, a, !0), "filter", a)
          },
          is: function(a) {
              return !! a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0)
          },
          closest: function(a, b) {
              var c = [],
              d,
              e,
              g = this[0];
              if (f.isArray(a)) {
                  var h = 1;
                  while (g && g.ownerDocument && g !== b) {
                      for (d = 0; d < a.length; d++) f(g).is(a[d]) && c.push({
                          selector: a[d],
                          elem: g,
                          level: h
                      });
                      g = g.parentNode,
                      h++
                  }
                  return c
              }
              var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
              for (d = 0, e = this.length; d < e; d++) {
                  g = this[d];
                  while (g) {
                      if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
                          c.push(g);
                          break
                      }
                      g = g.parentNode;
                      if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break
                  }
              }
              c = c.length > 1 ? f.unique(c) : c;
              return this.pushStack(c, "closest", a)
          },
          index: function(a) {
              if (!a) return this[0] && this[0].parentNode ? this.prevAll().length: -1;
              if (typeof a == "string") return f.inArray(this[0], f(a));
              return f.inArray(a.jquery ? a[0] : a, this)
          },
          add: function(a, b) {
              var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a),
              d = f.merge(this.get(), c);
              return this.pushStack(S(c[0]) || S(d[0]) ? d: f.unique(d))
          },
          andSelf: function() {
              return this.add(this.prevObject)
          }
      }),
      f.each({
          parent: function(a) {
              var b = a.parentNode;
              return b && b.nodeType !== 11 ? b: null
          },
          parents: function(a) {
              return f.dir(a, "parentNode")
          },
          parentsUntil: function(a, b, c) {
              return f.dir(a, "parentNode", c)
          },
          next: function(a) {
              return f.nth(a, 2, "nextSibling")
          },
          prev: function(a) {
              return f.nth(a, 2, "previousSibling")
          },
          nextAll: function(a) {
              return f.dir(a, "nextSibling")
          },
          prevAll: function(a) {
              return f.dir(a, "previousSibling")
          },
          nextUntil: function(a, b, c) {
              return f.dir(a, "nextSibling", c)
          },
          prevUntil: function(a, b, c) {
              return f.dir(a, "previousSibling", c)
          },
          siblings: function(a) {
              return f.sibling(a.parentNode.firstChild, a)
          },
          children: function(a) {
              return f.sibling(a.firstChild)
          },
          contents: function(a) {
              return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document: f.makeArray(a.childNodes)
          }
      },
      function(a, b) {
          f.fn[a] = function(c, d) {
              var e = f.map(this, b, c);
              L.test(a) || (d = c),
              d && typeof d == "string" && (e = f.filter(d, e)),
              e = this.length > 1 && !R[a] ? f.unique(e) : e,
              (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
              return this.pushStack(e, a, P.call(arguments).join(","))
          }
      }),
      f.extend({
          filter: function(a, b, c) {
              c && (a = ":not(" + a + ")");
              return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b)
          },
          dir: function(a, c, d) {
              var e = [],
              g = a[c];
              while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g),
              g = g[c];
              return e
          },
          nth: function(a, b, c, d) {
              b = b || 1;
              var e = 0;
              for (; a; a = a[c]) if (a.nodeType === 1 && ++e === b) break;
              return a
          },
          sibling: function(a, b) {
              var c = [];
              for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
              return c
          }
      });
      var V = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
      W = / jQuery\d+="(?:\d+|null)"/g,
      X = /^\s+/,
      Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
      Z = /<([\w:]+)/,
      $ = /<tbody/i,
      _ = /<|&#?\w+;/,
      ba = /<(?:script|style)/i,
      bb = /<(?:script|object|embed|option|style)/i,
      bc = new RegExp("<(?:" + V + ")", "i"),
      bd = /checked\s*(?:[^=]|=\s*.checked.)/i,
      be = /\/(java|ecma)script/i,
      bf = /^\s*<!(?:\[CDATA\[|\-\-)/,
      bg = {
          option: [1, "<select multiple='multiple'>", "</select>"],
          legend: [1, "<fieldset>", "</fieldset>"],
          thead: [1, "<table>", "</table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
          col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
          area: [1, "<map>", "</map>"],
          _default: [0, "", ""]
      },
      bh = U(c);
      bg.optgroup = bg.option,
      bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead,
      bg.th = bg.td,
      f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]),
      f.fn.extend({
          text: function(a) {
              if (f.isFunction(a)) return this.each(function(b) {
                  var c = f(this);
                  c.text(a.call(this, b, c.text()))
              });
              if (typeof a != "object" && a !== b) return this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a));
              return f.text(this)
          },
          wrapAll: function(a) {
              if (f.isFunction(a)) return this.each(function(b) {
                  f(this).wrapAll(a.call(this, b))
              });
              if (this[0]) {
                  var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
                  this[0].parentNode && b.insertBefore(this[0]),
                  b.map(function() {
                      var a = this;
                      while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                      return a
                  }).append(this)
              }
              return this
          },
          wrapInner: function(a) {
              if (f.isFunction(a)) return this.each(function(b) {
                  f(this).wrapInner(a.call(this, b))
              });
              return this.each(function() {
                  var b = f(this),
                  c = b.contents();
                  c.length ? c.wrapAll(a) : b.append(a)
              })
          },
          wrap: function(a) {
              var b = f.isFunction(a);
              return this.each(function(c) {
                  f(this).wrapAll(b ? a.call(this, c) : a)
              })
          },
          unwrap: function() {
              return this.parent().each(function() {
                  f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
              }).end()
          },
          append: function() {
              return this.domManip(arguments, !0,
              function(a) {
                  this.nodeType === 1 && this.appendChild(a)
              })
          },
          prepend: function() {
              return this.domManip(arguments, !0,
              function(a) {
                  this.nodeType === 1 && this.insertBefore(a, this.firstChild)
              })
          },
          before: function() {
              if (this[0] && this[0].parentNode) return this.domManip(arguments, !1,
              function(a) {
                  this.parentNode.insertBefore(a, this)
              });
              if (arguments.length) {
                  var a = f.clean(arguments);
                  a.push.apply(a, this.toArray());
                  return this.pushStack(a, "before", arguments)
              }
          },
          after: function() {
              if (this[0] && this[0].parentNode) return this.domManip(arguments, !1,
              function(a) {
                  this.parentNode.insertBefore(a, this.nextSibling)
              });
              if (arguments.length) {
                  var a = this.pushStack(this, "after", arguments);
                  a.push.apply(a, f.clean(arguments));
                  return a
              }
          },
          remove: function(a, b) {
              for (var c = 0,
              d; (d = this[c]) != null; c++) if (!a || f.filter(a, [d]).length) ! b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])),
              d.parentNode && d.parentNode.removeChild(d);
              return this
          },
          empty: function() {
              for (var a = 0,
              b; (b = this[a]) != null; a++) {
                  b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
                  while (b.firstChild) b.removeChild(b.firstChild)
              }
              return this
          },
          clone: function(a, b) {
              a = a == null ? !1 : a,
              b = b == null ? a: b;
              return this.map(function() {
                  return f.clone(this, a, b)
              })
          },
          html: function(a) {
              if (a === b) return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(W, "") : null;
              if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) {
                  a = a.replace(Y, "<$1></$2>");
                  try {
                      for (var c = 0,
                      d = this.length; c < d; c++) this[c].nodeType === 1 && (f.cleanData(this[c].getElementsByTagName("*")), this[c].innerHTML = a)
                  } catch(e) {
                      this.empty().append(a)
                  }
              } else f.isFunction(a) ? this.each(function(b) {
                  var c = f(this);
                  c.html(a.call(this, b, c.html()))
              }) : this.empty().append(a);
              return this
          },
          replaceWith: function(a) {
              if (this[0] && this[0].parentNode) {
                  if (f.isFunction(a)) return this.each(function(b) {
                      var c = f(this),
                      d = c.html();
                      c.replaceWith(a.call(this, b, d))
                  });
                  typeof a != "string" && (a = f(a).detach());
                  return this.each(function() {
                      var b = this.nextSibling,
                      c = this.parentNode;
                      f(this).remove(),
                      b ? f(b).before(a) : f(c).append(a)
                  })
              }
              return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this
          },
          detach: function(a) {
              return this.remove(a, !0)
          },
          domManip: function(a, c, d) {
              var e, g, h, i, j = a[0],
              k = [];
              if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) return this.each(function() {
                  f(this).domManip(a, c, d, !0)
              });
              if (f.isFunction(j)) return this.each(function(e) {
                  var g = f(this);
                  a[0] = j.call(this, e, c ? g.html() : b),
                  g.domManip(a, c, d)
              });
              if (this[0]) {
                  i = j && j.parentNode,
                  f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = {
                      fragment: i
                  }: e = f.buildFragment(a, this, k),
                  h = e.fragment,
                  h.childNodes.length === 1 ? g = h = h.firstChild: g = h.firstChild;
                  if (g) {
                      c = c && f.nodeName(g, "tr");
                      for (var l = 0,
                      m = this.length,
                      n = m - 1; l < m; l++) d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h)
                  }
                  k.length && f.each(k, bp)
              }
              return this
          }
      }),
      f.buildFragment = function(a, b, d) {
          var e, g, h, i, j = a[0];
          b && b[0] && (i = b[0].ownerDocument || b[0]),
          i.createDocumentFragment || (i = c),
          a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)),
          e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)),
          g && (f.fragments[j] = h ? e: 1);
          return {
              fragment: e,
              cacheable: g
          }
      },
      f.fragments = {},
      f.each({
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
      },
      function(a, b) {
          f.fn[a] = function(c) {
              var d = [],
              e = f(c),
              g = this.length === 1 && this[0].parentNode;
              if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) {
                  e[b](this[0]);
                  return this
              }
              for (var h = 0,
              i = e.length; h < i; h++) {
                  var j = (h > 0 ? this.clone(!0) : this).get();
                  f(e[h])[b](j),
                  d = d.concat(j)
              }
              return this.pushStack(d, a, e.selector)
          }
      }),
      f.extend({
          clone: function(a, b, c) {
              var d, e, g, h = f.support.html5Clone || !bc.test("<" + a.nodeName) ? a.cloneNode(!0) : bo(a);
              if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
                  bk(a, h),
                  d = bl(a),
                  e = bl(h);
                  for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g])
              }
              if (b) {
                  bj(a, h);
                  if (c) {
                      d = bl(a),
                      e = bl(h);
                      for (g = 0; d[g]; ++g) bj(d[g], e[g])
                  }
              }
              d = e = null;
              return h
          },
          clean: function(a, b, d, e) {
              var g;
              b = b || c,
              typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
              var h = [],
              i;
              for (var j = 0,
              k; (k = a[j]) != null; j++) {
                  typeof k == "number" && (k += "");
                  if (!k) continue;
                  if (typeof k == "string") if (!_.test(k)) k = b.createTextNode(k);
                  else {
                      k = k.replace(Y, "<$1></$2>");
                      var l = (Z.exec(k) || ["", ""])[1].toLowerCase(),
                      m = bg[l] || bg._default,
                      n = m[0],
                      o = b.createElement("div");
                      b === c ? bh.appendChild(o) : U(b).appendChild(o),
                      o.innerHTML = m[1] + k + m[2];
                      while (n--) o = o.lastChild;
                      if (!f.support.tbody) {
                          var p = $.test(k),
                          q = l === "table" && !p ? o.firstChild && o.firstChild.childNodes: m[1] === "<table>" && !p ? o.childNodes: [];
                          for (i = q.length - 1; i >= 0; --i) f.nodeName(q[i], "tbody") && !q[i].childNodes.length && q[i].parentNode.removeChild(q[i])
                      } ! f.support.leadingWhitespace && X.test(k) && o.insertBefore(b.createTextNode(X.exec(k)[0]), o.firstChild),
                      k = o.childNodes
                  }
                  var r;
                  if (!f.support.appendChecked) if (k[0] && typeof(r = k.length) == "number") for (i = 0; i < r; i++) bn(k[i]);
                  else bn(k);
                  k.nodeType ? h.push(k) : h = f.merge(h, k)
              }
              if (d) {
                  g = function(a) {
                      return ! a.type || be.test(a.type)
                  };
                  for (j = 0; h[j]; j++) if (e && f.nodeName(h[j], "script") && (!h[j].type || h[j].type.toLowerCase() === "text/javascript")) e.push(h[j].parentNode ? h[j].parentNode.removeChild(h[j]) : h[j]);
                  else {
                      if (h[j].nodeType === 1) {
                          var s = f.grep(h[j].getElementsByTagName("script"), g);
                          h.splice.apply(h, [j + 1, 0].concat(s))
                      }
                      d.appendChild(h[j])
                  }
              }
              return h
          },
          cleanData: function(a) {
              var b, c, d = f.cache,
              e = f.event.special,
              g = f.support.deleteExpando;
              for (var h = 0,
              i; (i = a[h]) != null; h++) {
                  if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue;
                  c = i[f.expando];
                  if (c) {
                      b = d[c];
                      if (b && b.events) {
                          for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle);
                          b.handle && (b.handle.elem = null)
                      }
                      g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando),
                      delete d[c]
                  }
              }
          }
      });
      var bq = /alpha\([^)]*\)/i,
      br = /opacity=([^)]*)/,
      bs = /([A-Z]|^ms)/g,
      bt = /^-?\d+(?:px)?$/i,
      bu = /^-?\d/,
      bv = /^([\-+])=([\-+.\de]+)/,
      bw = {
          position: "absolute",
          visibility: "hidden",
          display: "block"
      },
      bx = ["Left", "Right"],
      by = ["Top", "Bottom"],
      bz,
      bA,
      bB;
      f.fn.css = function(a, c) {
          if (arguments.length === 2 && c === b) return this;
          return f.access(this, a, c, !0,
          function(a, c, d) {
              return d !== b ? f.style(a, c, d) : f.css(a, c)
          })
      },
      f.extend({
          cssHooks: {
              opacity: {
                  get: function(a, b) {
                      if (b) {
                          var c = bz(a, "opacity", "opacity");
                          return c === "" ? "1": c
                      }
                      return a.style.opacity
                  }
              }
          },
          cssNumber: {
              fillOpacity: !0,
              fontWeight: !0,
              lineHeight: !0,
              opacity: !0,
              orphans: !0,
              widows: !0,
              zIndex: !0,
              zoom: !0
          },
          cssProps: {
              "float": f.support.cssFloat ? "cssFloat": "styleFloat"
          },
          style: function(a, c, d, e) {
              if ( !! a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
                  var g, h, i = f.camelCase(c),
                  j = a.style,
                  k = f.cssHooks[i];
                  c = f.cssProps[i] || i;
                  if (d === b) {
                      if (k && "get" in k && (g = k.get(a, !1, e)) !== b) return g;
                      return j[c]
                  }
                  h = typeof d,
                  h === "string" && (g = bv.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number");
                  if (d == null || h === "number" && isNaN(d)) return;
                  h === "number" && !f.cssNumber[i] && (d += "px");
                  if (!k || !("set" in k) || (d = k.set(a, d)) !== b) try {
                      j[c] = d
                  } catch(l) {}
              }
          },
          css: function(a, c, d) {
              var e, g;
              c = f.camelCase(c),
              g = f.cssHooks[c],
              c = f.cssProps[c] || c,
              c === "cssFloat" && (c = "float");
              if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e;
              if (bz) return bz(a, c)
          },
          swap: function(a, b, c) {
              var d = {};
              for (var e in b) d[e] = a.style[e],
              a.style[e] = b[e];
              c.call(a);
              for (e in b) a.style[e] = d[e]
          }
      }),
      f.curCSS = f.css,
      f.each(["height", "width"],
      function(a, b) {
          f.cssHooks[b] = {
              get: function(a, c, d) {
                  var e;
                  if (c) {
                      if (a.offsetWidth !== 0) return bC(a, b, d);
                      f.swap(a, bw,
                      function() {
                          e = bC(a, b, d)
                      });
                      return e
                  }
              },
              set: function(a, b) {
                  if (!bt.test(b)) return b;
                  b = parseFloat(b);
                  if (b >= 0) return b + "px"
              }
          }
      }),
      f.support.opacity || (f.cssHooks.opacity = {
          get: function(a, b) {
              return br.test((b && a.currentStyle ? a.currentStyle.filter: a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "": b ? "1": ""
          },
          set: function(a, b) {
              var c = a.style,
              d = a.currentStyle,
              e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")": "",
              g = d && d.filter || c.filter || "";
              c.zoom = 1;
              if (b >= 1 && f.trim(g.replace(bq, "")) === "") {
                  c.removeAttribute("filter");
                  if (d && !d.filter) return
              }
              c.filter = bq.test(g) ? g.replace(bq, e) : g + " " + e
          }
      }),
      f(function() {
          f.support.reliableMarginRight || (f.cssHooks.marginRight = {
              get: function(a, b) {
                  var c;
                  f.swap(a, {
                      display: "inline-block"
                  },
                  function() {
                      b ? c = bz(a, "margin-right", "marginRight") : c = a.style.marginRight
                  });
                  return c
              }
          })
      }),
      c.defaultView && c.defaultView.getComputedStyle && (bA = function(a, b) {
          var c, d, e;
          b = b.replace(bs, "-$1").toLowerCase(),
          (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b)));
          return c
      }),
      c.documentElement.currentStyle && (bB = function(a, b) {
          var c, d, e, f = a.currentStyle && a.currentStyle[b],
          g = a.style;
          f === null && g && (e = g[b]) && (f = e),
          !bt.test(f) && bu.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em": f || 0, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d));
          return f === "" ? "auto": f
      }),
      bz = bA || bB,
      f.expr && f.expr.filters && (f.expr.filters.hidden = function(a) {
          var b = a.offsetWidth,
          c = a.offsetHeight;
          return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none"
      },
      f.expr.filters.visible = function(a) {
          return ! f.expr.filters.hidden(a)
      });
      var bD = /%20/g,
      bE = /\[\]$/,
      bF = /\r?\n/g,
      bG = /#.*$/,
      bH = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
      bI = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
      bJ = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
      bK = /^(?:GET|HEAD)$/,
      bL = /^\/\//,
      bM = /\?/,
      bN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      bO = /^(?:select|textarea)/i,
      bP = /\s+/,
      bQ = /([?&])_=[^&]*/,
      bR = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
      bS = f.fn.load,
      bT = {},
      bU = {},
      bV, bW, bX = ["*/"] + ["*"];
      try {
          bV = e.href
      } catch(bY) {
          bV = c.createElement("a"),
          bV.href = "",
          bV = bV.href
      }
      bW = bR.exec(bV.toLowerCase()) || [],
      f.fn.extend({
          load: function(a, c, d) {
              if (typeof a != "string" && bS) return bS.apply(this, arguments);
              if (!this.length) return this;
              var e = a.indexOf(" ");
              if (e >= 0) {
                  var g = a.slice(e, a.length);
                  a = a.slice(0, e)
              }
              var h = "GET";
              c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST"));
              var i = this;
              f.ajax({
                  url: a,
                  type: h,
                  dataType: "html",
                  data: c,
                  complete: function(a, b, c) {
                      c = a.responseText,
                      a.isResolved() && (a.done(function(a) {
                          c = a
                      }), i.html(g ? f("<div>").append(c.replace(bN, "")).find(g) : c)),
                      d && i.each(d, [c, b, a])
                  }
              });
              return this
          },
          serialize: function() {
              return f.param(this.serializeArray())
          },
          serializeArray: function() {
              return this.map(function() {
                  return this.elements ? f.makeArray(this.elements) : this
              }).filter(function() {
                  return this.name && !this.disabled && (this.checked || bO.test(this.nodeName) || bI.test(this.type))
              }).map(function(a, b) {
                  var c = f(this).val();
                  return c == null ? null: f.isArray(c) ? f.map(c,
                  function(a, c) {
                      return {
                          name: b.name,
                          value: a.replace(bF, "\r\n")
                      }
                  }) : {
                      name: b.name,
                      value: c.replace(bF, "\r\n")
                  }
              }).get()
          }
      }),
      f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),
      function(a, b) {
          f.fn[b] = function(a) {
              return this.on(b, a)
          }
      }),
      f.each(["get", "post"],
      function(a, c) {
          f[c] = function(a, d, e, g) {
              f.isFunction(d) && (g = g || e, e = d, d = b);
              return f.ajax({
                  type: c,
                  url: a,
                  data: d,
                  success: e,
                  dataType: g
              })
          }
      }),
      f.extend({
          getScript: function(a, c) {
              return f.get(a, b, c, "script")
          },
          getJSON: function(a, b, c) {
              return f.get(a, b, c, "json")
          },
          ajaxSetup: function(a, b) {
              b ? b_(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings),
              b_(a, b);
              return a
          },
          ajaxSettings: {
              url: bV,
              isLocal: bJ.test(bW[1]),
              global: !0,
              type: "GET",
              contentType: "application/x-www-form-urlencoded",
              processData: !0,
              async: !0,
              accepts: {
                  xml: "application/xml, text/xml",
                  html: "text/html",
                  text: "text/plain",
                  json: "application/json, text/javascript",
                  "*": bX
              },
              contents: {
                  xml: /xml/,
                  html: /html/,
                  json: /json/
              },
              responseFields: {
                  xml: "responseXML",
                  text: "responseText"
              },
              converters: {
                  "* text": a.String,
                  "text html": !0,
                  "text json": f.parseJSON,
                  "text xml": f.parseXML
              },
              flatOptions: {
                  context: !0,
                  url: !0
              }
          },
          ajaxPrefilter: bZ(bT),
          ajaxTransport: bZ(bU),
          ajax: function(a, c) {
              function w(a, c, l, m) {
                  if (s !== 2) {
                      s = 2,
                      q && clearTimeout(q),
                      p = b,
                      n = m || "",
                      v.readyState = a > 0 ? 4 : 0;
                      var o, r, u, w = c,
                      x = l ? cb(d, v, l) : b,
                      y,
                      z;
                      if (a >= 200 && a < 300 || a === 304) {
                          if (d.ifModified) {
                              if (y = v.getResponseHeader("Last-Modified")) f.lastModified[k] = y;
                              if (z = v.getResponseHeader("Etag")) f.etag[k] = z
                          }
                          if (a === 304) w = "notmodified",
                          o = !0;
                          else try {
                              r = cc(d, x),
                              w = "success",
                              o = !0
                          } catch(A) {
                              w = "parsererror",
                              u = A
                          }
                      } else {
                          u = w;
                          if (!w || a) w = "error",
                          a < 0 && (a = 0)
                      }
                      v.status = a,
                      v.statusText = "" + (c || w),
                      o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]),
                      v.statusCode(j),
                      j = b,
                      t && g.trigger("ajax" + (o ? "Success": "Error"), [v, d, o ? r: u]),
                      i.fireWith(e, [v, w]),
                      t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop"))
                  }
              }
              typeof a == "object" && (c = a, a = b),
              c = c || {};
              var d = f.ajaxSetup({},
              c),
              e = d.context || d,
              g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event,
              h = f.Deferred(),
              i = f.Callbacks("once memory"),
              j = d.statusCode || {},
              k,
              l = {},
              m = {},
              n,
              o,
              p,
              q,
              r,
              s = 0,
              t,
              u,
              v = {
                  readyState: 0,
                  setRequestHeader: function(a, b) {
                      if (!s) {
                          var c = a.toLowerCase();
                          a = m[c] = m[c] || a,
                          l[a] = b
                      }
                      return this
                  },
                  getAllResponseHeaders: function() {
                      return s === 2 ? n: null
                  },
                  getResponseHeader: function(a) {
                      var c;
                      if (s === 2) {
                          if (!o) {
                              o = {};
                              while (c = bH.exec(n)) o[c[1].toLowerCase()] = c[2]
                          }
                          c = o[a.toLowerCase()]
                      }
                      return c === b ? null: c
                  },
                  overrideMimeType: function(a) {
                      s || (d.mimeType = a);
                      return this
                  },
                  abort: function(a) {
                      a = a || "abort",
                      p && p.abort(a),
                      w(0, a);
                      return this
                  }
              };
              h.promise(v),
              v.success = v.done,
              v.error = v.fail,
              v.complete = i.add,
              v.statusCode = function(a) {
                  if (a) {
                      var b;
                      if (s < 2) for (b in a) j[b] = [j[b], a[b]];
                      else b = a[v.status],
                      v.then(b, b)
                  }
                  return this
              },
              d.url = ((a || d.url) + "").replace(bG, "").replace(bL, bW[1] + "//"),
              d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bP),
              d.crossDomain == null && (r = bR.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bW[1] && r[2] == bW[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bW[3] || (bW[1] === "http:" ? 80 : 443)))),
              d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)),
              b$(bT, d, c, v);
              if (s === 2) return ! 1;
              t = d.global,
              d.type = d.type.toUpperCase(),
              d.hasContent = !bK.test(d.type),
              t && f.active++===0 && f.event.trigger("ajaxStart");
              if (!d.hasContent) {
                  d.data && (d.url += (bM.test(d.url) ? "&": "?") + d.data, delete d.data),
                  k = d.url;
                  if (d.cache === !1) {
                      var x = f.now(),
                      y = d.url.replace(bQ, "$1_=" + x);
                      d.url = y + (y === d.url ? (bM.test(d.url) ? "&": "?") + "_=" + x: "")
                  }
              } (d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType),
              d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])),
              v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bX + "; q=0.01": "") : d.accepts["*"]);
              for (u in d.headers) v.setRequestHeader(u, d.headers[u]);
              if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
                  v.abort();
                  return ! 1
              }
              for (u in {
                  success: 1,
                  error: 1,
                  complete: 1
              }) v[u](d[u]);
              p = b$(bU, d, c, v);
              if (!p) w( - 1, "No Transport");
              else {
                  v.readyState = 1,
                  t && g.trigger("ajaxSend", [v, d]),
                  d.async && d.timeout > 0 && (q = setTimeout(function() {
                      v.abort("timeout")
                  },
                  d.timeout));
                  try {
                      s = 1,
                      p.send(l, w)
                  } catch(z) {
                      if (s < 2) w( - 1, z);
                      else throw z
                  }
              }
              return v
          },
          param: function(a, c) {
              var d = [],
              e = function(a, b) {
                  b = f.isFunction(b) ? b() : b,
                  d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
              };
              c === b && (c = f.ajaxSettings.traditional);
              if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) f.each(a,
              function() {
                  e(this.name, this.value)
              });
              else for (var g in a) ca(g, a[g], c, e);
              return d.join("&").replace(bD, "+")
          }
      }),
      f.extend({
          active: 0,
          lastModified: {},
          etag: {}
      });
      var cd = f.now(),
      ce = /(\=)\?(&|$)|\?\?/i;
      f.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function() {
              return f.expando + "_" + cd++
          }
      }),
      f.ajaxPrefilter("json jsonp",
      function(b, c, d) {
          var e = b.contentType === "application/x-www-form-urlencoded" && typeof b.data == "string";
          if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (ce.test(b.url) || e && ce.test(b.data))) {
              var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
              i = a[h],
              j = b.url,
              k = b.data,
              l = "$1" + h + "$2";
              b.jsonp !== !1 && (j = j.replace(ce, l), b.url === j && (e && (k = k.replace(ce, l)), b.data === k && (j += (/\?/.test(j) ? "&": "?") + b.jsonp + "=" + h))),
              b.url = j,
              b.data = k,
              a[h] = function(a) {
                  g = [a]
              },
              d.always(function() {
                  a[h] = i,
                  g && f.isFunction(i) && a[h](g[0])
              }),
              b.converters["script json"] = function() {
                  g || f.error(h + " was not called");
                  return g[0]
              },
              b.dataTypes[0] = "json";
              return "script"
          }
      }),
      f.ajaxSetup({
          accepts: {
              script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
          },
          contents: {
              script: /javascript|ecmascript/
          },
          converters: {
              "text script": function(a) {
                  f.globalEval(a);
                  return a
              }
          }
      }),
      f.ajaxPrefilter("script",
      function(a) {
          a.cache === b && (a.cache = !1),
          a.crossDomain && (a.type = "GET", a.global = !1)
      }),
      f.ajaxTransport("script",
      function(a) {
          if (a.crossDomain) {
              var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
              return {
                  send: function(f, g) {
                      d = c.createElement("script"),
                      d.async = "async",
                      a.scriptCharset && (d.charset = a.scriptCharset),
                      d.src = a.url,
                      d.onload = d.onreadystatechange = function(a, c) {
                          if (c || !d.readyState || /loaded|complete/.test(d.readyState)) d.onload = d.onreadystatechange = null,
                          e && d.parentNode && e.removeChild(d),
                          d = b,
                          c || g(200, "success")
                      },
                      e.insertBefore(d, e.firstChild)
                  },
                  abort: function() {
                      d && d.onload(0, 1)
                  }
              }
          }
      });
      var cf = a.ActiveXObject ?
      function() {
          for (var a in ch) ch[a](0, 1)
      }: !1,
      cg = 0,
      ch;
      f.ajaxSettings.xhr = a.ActiveXObject ?
      function() {
          return ! this.isLocal && ci() || cj()
      }: ci,
      function(a) {
          f.extend(f.support, {
              ajax: !!a,
              cors: !!a && "withCredentials" in a
          })
      } (f.ajaxSettings.xhr()),
      f.support.ajax && f.ajaxTransport(function(c) {
          if (!c.crossDomain || f.support.cors) {
              var d;
              return {
                  send: function(e, g) {
                      var h = c.xhr(),
                      i,
                      j;
                      c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
                      if (c.xhrFields) for (j in c.xhrFields) h[j] = c.xhrFields[j];
                      c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType),
                      !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                      try {
                          for (j in e) h.setRequestHeader(j, e[j])
                      } catch(k) {}
                      h.send(c.hasContent && c.data || null),
                      d = function(a, e) {
                          var j, k, l, m, n;
                          try {
                              if (d && (e || h.readyState === 4)) {
                                  d = b,
                                  i && (h.onreadystatechange = f.noop, cf && delete ch[i]);
                                  if (e) h.readyState !== 4 && h.abort();
                                  else {
                                      j = h.status,
                                      l = h.getAllResponseHeaders(),
                                      m = {},
                                      n = h.responseXML,
                                      n && n.documentElement && (m.xml = n),
                                      m.text = h.responseText;
                                      try {
                                          k = h.statusText
                                      } catch(o) {
                                          k = ""
                                      } ! j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204)
                                  }
                              }
                          } catch(p) {
                              e || g( - 1, p)
                          }
                          m && g(j, k, m, l)
                      },
                      !c.async || h.readyState === 4 ? d() : (i = ++cg, cf && (ch || (ch = {},
                      f(a).unload(cf)), ch[i] = d), h.onreadystatechange = d)
                  },
                  abort: function() {
                      d && d(0, 1)
                  }
              }
          }
      });
      var ck = {},
      cl, cm, cn = /^(?:toggle|show|hide)$/,
      co = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
      cp, cq = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]],
      cr;
      f.fn.extend({
          show: function(a, b, c) {
              var d, e;
              if (a || a === 0) return this.animate(cu("show", 3), a, b, c);
              for (var g = 0,
              h = this.length; g < h; g++) d = this[g],
              d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), e === "" && f.css(d, "display") === "none" && f._data(d, "olddisplay", cv(d.nodeName)));
              for (g = 0; g < h; g++) {
                  d = this[g];
                  if (d.style) {
                      e = d.style.display;
                      if (e === "" || e === "none") d.style.display = f._data(d, "olddisplay") || ""
                  }
              }
              return this
          },
          hide: function(a, b, c) {
              if (a || a === 0) return this.animate(cu("hide", 3), a, b, c);
              var d, e, g = 0,
              h = this.length;
              for (; g < h; g++) d = this[g],
              d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e));
              for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none");
              return this
          },
          _toggle: f.fn.toggle,
          toggle: function(a, b, c) {
              var d = typeof a == "boolean";
              f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function() {
                  var b = d ? a: f(this).is(":hidden");
                  f(this)[b ? "show": "hide"]()
              }) : this.animate(cu("toggle", 3), a, b, c);
              return this
          },
          fadeTo: function(a, b, c, d) {
              return this.filter(":hidden").css("opacity", 0).show().end().animate({
                  opacity: b
              },
              a, c, d)
          },
          animate: function(a, b, c, d) {
              function g() {
                  e.queue === !1 && f._mark(this);
                  var b = f.extend({},
                  e),
                  c = this.nodeType === 1,
                  d = c && f(this).is(":hidden"),
                  g,
                  h,
                  i,
                  j,
                  k,
                  l,
                  m,
                  n,
                  o;
                  b.animatedProperties = {};
                  for (i in a) {
                      g = f.camelCase(i),
                      i !== g && (a[g] = a[i], delete a[i]),
                      h = a[g],
                      f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing";
                      if (h === "hide" && d || h === "show" && !d) return b.complete.call(this);
                      c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cv(this.nodeName) === "inline" ? this.style.display = "inline-block": this.style.zoom = 1))
                  }
                  b.overflow != null && (this.style.overflow = "hidden");
                  for (i in a) j = new f.fx(this, b, i),
                  h = a[i],
                  cn.test(h) ? (o = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show": "hide": 0), o ? (f._data(this, "toggle" + i, o === "show" ? "hide": "show"), j[o]()) : j[h]()) : (k = co.exec(h), l = j.cur(), k ? (m = parseFloat(k[2]), n = k[3] || (f.cssNumber[i] ? "": "px"), n !== "px" && (f.style(this, i, (m || 1) + n), l = (m || 1) / j.cur() * l, f.style(this, i, l + n)), k[1] && (m = (k[1] === "-=" ? -1 : 1) * m + l), j.custom(l, m, n)) : j.custom(l, h, ""));
                  return ! 0
              }
              var e = f.speed(b, c, d);
              if (f.isEmptyObject(a)) return this.each(e.complete, [!1]);
              a = f.extend({},
              a);
              return e.queue === !1 ? this.each(g) : this.queue(e.queue, g)
          },
          stop: function(a, c, d) {
              typeof a != "string" && (d = c, c = a, a = b),
              c && a !== !1 && this.queue(a || "fx", []);
              return this.each(function() {
                  function h(a, b, c) {
                      var e = b[c];
                      f.removeData(a, c, !0),
                      e.stop(d)
                  }
                  var b, c = !1,
                  e = f.timers,
                  g = f._data(this);
                  d || f._unmark(!0, this);
                  if (a == null) for (b in g) g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b);
                  else g[b = a + ".run"] && g[b].stop && h(this, g, b);
                  for (b = e.length; b--;) e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1)); (!d || !c) && f.dequeue(this, a)
              })
          }
      }),
      f.each({
          slideDown: cu("show", 1),
          slideUp: cu("hide", 1),
          slideToggle: cu("toggle", 1),
          fadeIn: {
              opacity: "show"
          },
          fadeOut: {
              opacity: "hide"
          },
          fadeToggle: {
              opacity: "toggle"
          }
      },
      function(a, b) {
          f.fn[a] = function(a, c, d) {
              return this.animate(b, a, c, d)
          }
      }),
      f.extend({
          speed: function(a, b, c) {
              var d = a && typeof a == "object" ? f.extend({},
              a) : {
                  complete: c || !c && b || f.isFunction(a) && a,
                  duration: a,
                  easing: c && b || b && !f.isFunction(b) && b
              };
              d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration: d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
              if (d.queue == null || d.queue === !0) d.queue = "fx";
              d.old = d.complete,
              d.complete = function(a) {
                  f.isFunction(d.old) && d.old.call(this),
                  d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this)
              };
              return d
          },
          easing: {
              linear: function(a, b, c, d) {
                  return c + d * a
              },
              swing: function(a, b, c, d) {
                  return ( - Math.cos(a * Math.PI) / 2 + .5) * d + c
              }
          },
          timers: [],
          fx: function(a, b, c) {
              this.options = b,
              this.elem = a,
              this.prop = c,
              b.orig = b.orig || {}
          }
      }),
      f.fx.prototype = {
          update: function() {
              this.options.step && this.options.step.call(this.elem, this.now, this),
              (f.fx.step[this.prop] || f.fx.step._default)(this)
          },
          cur: function() {
              if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop];
              var a, b = f.css(this.elem, this.prop);
              return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b: a
          },
          custom: function(a, c, d) {
              function h(a) {
                  return e.step(a)
              }
              var e = this,
              g = f.fx;
              this.startTime = cr || cs(),
              this.end = c,
              this.now = this.start = a,
              this.pos = this.state = 0,
              this.unit = d || this.unit || (f.cssNumber[this.prop] ? "": "px"),
              h.queue = this.options.queue,
              h.elem = this.elem,
              h.saveState = function() {
                  e.options.hide && f._data(e.elem, "fxshow" + e.prop) === b && f._data(e.elem, "fxshow" + e.prop, e.start)
              },
              h() && f.timers.push(h) && !cp && (cp = setInterval(g.tick, g.interval))
          },
          show: function() {
              var a = f._data(this.elem, "fxshow" + this.prop);
              this.options.orig[this.prop] = a || f.style(this.elem, this.prop),
              this.options.show = !0,
              a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()),
              f(this.elem).show()
          },
          hide: function() {
              this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop),
              this.options.hide = !0,
              this.custom(this.cur(), 0)
          },
          step: function(a) {
              var b, c, d, e = cr || cs(),
              g = !0,
              h = this.elem,
              i = this.options;
              if (a || e >= i.duration + this.startTime) {
                  this.now = this.end,
                  this.pos = this.state = 1,
                  this.update(),
                  i.animatedProperties[this.prop] = !0;
                  for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1);
                  if (g) {
                      i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"],
                      function(a, b) {
                          h.style["overflow" + b] = i.overflow[a]
                      }),
                      i.hide && f(h).hide();
                      if (i.hide || i.show) for (b in i.animatedProperties) f.style(h, b, i.orig[b]),
                      f.removeData(h, "fxshow" + b, !0),
                      f.removeData(h, "toggle" + b, !0);
                      d = i.complete,
                      d && (i.complete = !1, d.call(h))
                  }
                  return ! 1
              }
              i.duration == Infinity ? this.now = e: (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos),
              this.update();
              return ! 0
          }
      },
      f.extend(f.fx, {
          tick: function() {
              var a, b = f.timers,
              c = 0;
              for (; c < b.length; c++) a = b[c],
              !a() && b[c] === a && b.splice(c--, 1);
              b.length || f.fx.stop()
          },
          interval: 13,
          stop: function() {
              clearInterval(cp),
              cp = null
          },
          speeds: {
              slow: 600,
              fast: 200,
              _default: 400
          },
          step: {
              opacity: function(a) {
                  f.style(a.elem, "opacity", a.now)
              },
              _default: function(a) {
                  a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit: a.elem[a.prop] = a.now
              }
          }
      }),
      f.each(["width", "height"],
      function(a, b) {
          f.fx.step[b] = function(a) {
              f.style(a.elem, b, Math.max(0, a.now) + a.unit)
          }
      }),
      f.expr && f.expr.filters && (f.expr.filters.animated = function(a) {
          return f.grep(f.timers,
          function(b) {
              return a === b.elem
          }).length
      });
      var cw = /^t(?:able|d|h)$/i,
      cx = /^(?:body|html)$/i;
      "getBoundingClientRect" in c.documentElement ? f.fn.offset = function(a) {
          var b = this[0],
          c;
          if (a) return this.each(function(b) {
              f.offset.setOffset(this, a, b)
          });
          if (!b || !b.ownerDocument) return null;
          if (b === b.ownerDocument.body) return f.offset.bodyOffset(b);
          try {
              c = b.getBoundingClientRect()
          } catch(d) {}
          var e = b.ownerDocument,
          g = e.documentElement;
          if (!c || !f.contains(g, b)) return c ? {
              top: c.top,
              left: c.left
          }: {
              top: 0,
              left: 0
          };
          var h = e.body,
          i = cy(e),
          j = g.clientTop || h.clientTop || 0,
          k = g.clientLeft || h.clientLeft || 0,
          l = i.pageYOffset || f.support.boxModel && g.scrollTop || h.scrollTop,
          m = i.pageXOffset || f.support.boxModel && g.scrollLeft || h.scrollLeft,
          n = c.top + l - j,
          o = c.left + m - k;
          return {
              top: n,
              left: o
          }
      }: f.fn.offset = function(a) {
          var b = this[0];
          if (a) return this.each(function(b) {
              f.offset.setOffset(this, a, b)
          });
          if (!b || !b.ownerDocument) return null;
          if (b === b.ownerDocument.body) return f.offset.bodyOffset(b);
          var c, d = b.offsetParent,
          e = b,
          g = b.ownerDocument,
          h = g.documentElement,
          i = g.body,
          j = g.defaultView,
          k = j ? j.getComputedStyle(b, null) : b.currentStyle,
          l = b.offsetTop,
          m = b.offsetLeft;
          while ((b = b.parentNode) && b !== i && b !== h) {
              if (f.support.fixedPosition && k.position === "fixed") break;
              c = j ? j.getComputedStyle(b, null) : b.currentStyle,
              l -= b.scrollTop,
              m -= b.scrollLeft,
              b === d && (l += b.offsetTop, m += b.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(b.nodeName)) && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), e = d, d = b.offsetParent),
              f.support.subtractsBorderForOverflowNotVisible && c.overflow !== "visible" && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0),
              k = c
          }
          if (k.position === "relative" || k.position === "static") l += i.offsetTop,
          m += i.offsetLeft;
          f.support.fixedPosition && k.position === "fixed" && (l += Math.max(h.scrollTop, i.scrollTop), m += Math.max(h.scrollLeft, i.scrollLeft));
          return {
              top: l,
              left: m
          }
      },
      f.offset = {
          bodyOffset: function(a) {
              var b = a.offsetTop,
              c = a.offsetLeft;
              f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0);
              return {
                  top: b,
                  left: c
              }
          },
          setOffset: function(a, b, c) {
              var d = f.css(a, "position");
              d === "static" && (a.style.position = "relative");
              var e = f(a),
              g = e.offset(),
              h = f.css(a, "top"),
              i = f.css(a, "left"),
              j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1,
              k = {},
              l = {},
              m,
              n;
              j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0),
              f.isFunction(b) && (b = b.call(a, c, g)),
              b.top != null && (k.top = b.top - g.top + m),
              b.left != null && (k.left = b.left - g.left + n),
              "using" in b ? b.using.call(a, k) : e.css(k)
          }
      },
      f.fn.extend({
          position: function() {
              if (!this[0]) return null;
              var a = this[0],
              b = this.offsetParent(),
              c = this.offset(),
              d = cx.test(b[0].nodeName) ? {
                  top: 0,
                  left: 0
              }: b.offset();
              c.top -= parseFloat(f.css(a, "marginTop")) || 0,
              c.left -= parseFloat(f.css(a, "marginLeft")) || 0,
              d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0,
              d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0;
              return {
                  top: c.top - d.top,
                  left: c.left - d.left
              }
          },
          offsetParent: function() {
              return this.map(function() {
                  var a = this.offsetParent || c.body;
                  while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") a = a.offsetParent;
                  return a
              })
          }
      }),
      f.each(["Left", "Top"],
      function(a, c) {
          var d = "scroll" + c;
          f.fn[d] = function(c) {
              var e, g;
              if (c === b) {
                  e = this[0];
                  if (!e) return null;
                  g = cy(e);
                  return g ? "pageXOffset" in g ? g[a ? "pageYOffset": "pageXOffset"] : f.support.boxModel && g.document.documentElement[d] || g.document.body[d] : e[d]
              }
              return this.each(function() {
                  g = cy(this),
                  g ? g.scrollTo(a ? f(g).scrollLeft() : c, a ? c: f(g).scrollTop()) : this[d] = c
              })
          }
      }),
      f.each(["Height", "Width"],
      function(a, c) {
          var d = c.toLowerCase();
          f.fn["inner" + c] = function() {
              var a = this[0];
              return a ? a.style ? parseFloat(f.css(a, d, "padding")) : this[d]() : null
          },
          f.fn["outer" + c] = function(a) {
              var b = this[0];
              return b ? b.style ? parseFloat(f.css(b, d, a ? "margin": "border")) : this[d]() : null
          },
          f.fn[d] = function(a) {
              var e = this[0];
              if (!e) return a == null ? null: this;
              if (f.isFunction(a)) return this.each(function(b) {
                  var c = f(this);
                  c[d](a.call(this, b, c[d]()))
              });
              if (f.isWindow(e)) {
                  var g = e.document.documentElement["client" + c],
                  h = e.document.body;
                  return e.document.compatMode === "CSS1Compat" && g || h && h["client" + c] || g
              }
              if (e.nodeType === 9) return Math.max(e.documentElement["client" + c], e.body["scroll" + c], e.documentElement["scroll" + c], e.body["offset" + c], e.documentElement["offset" + c]);
              if (a === b) {
                  var i = f.css(e, d),
                  j = parseFloat(i);
                  return f.isNumeric(j) ? j: i
              }
              return this.css(d, typeof a == "string" ? a: a + "px")
          }
      }),
      a.jQuery = a.$ = f,
      typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [],
      function() {
          return f
      })
  })(window);
  jQuery.noConflict();


  /*
  @author       Constantin Saguin - @brutaldesign
  @link            http://bsign.co
  @github        http://github.com/brutaldesign/swipebox
  @version     1.0
  @license      MIT License
  */
  (function(e, t, n, r) {
      n.swipebox = function(i, s) {
          var o = {
              useCSS: true,
              hideBarsDelay: 3e3
          },
          u = this,
          a = n(i),
          i = i,
          f = i.selector,
          l = n(f),
          c = t.createTouch !== r || "ontouchstart" in e || "onmsgesturechange" in e || navigator.msMaxTouchPoints,
          h = !!e.SVGSVGElement,
          p = '<div id="swipebox-overlay">					<div id="swipebox-slider"></div>					<div id="swipebox-caption"></div>					<div id="swipebox-action">						<a id="swipebox-close"></a>						<a id="swipebox-prev"></a>						<a id="swipebox-next"></a>					</div></div>';
          u.settings = {};
          u.init = function() {
              u.settings = n.extend({},
              o, s);
              l.click(function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  index = a.index(n(this));
                  d.init(index)
              })
          };
          var d = {
              init: function(e) {
                  this.build();
                  this.openSlide(e);
                  this.openImg(e);
                  this.preloadImg(e + 1);
                  this.preloadImg(e - 1)
              },
              build: function() {
                  var t = this;
                  n("body").append(p);
                  if (t.doCssTrans()) {
                      n("#swipebox-slider").css({
                          "-webkit-transition": "left 0.4s ease",
                          "-moz-transition": "left 0.4s ease",
                          "-o-transition": "left 0.4s ease",
                          "-khtml-transition": "left 0.4s ease",
                          transition: "left 0.4s ease"
                      });
                      n("#swipebox-overlay").css({
                          "-webkit-transition": "opacity 1s ease",
                          "-moz-transition": "opacity 1s ease",
                          "-o-transition": "opacity 1s ease",
                          "-khtml-transition": "opacity 1s ease",
                          transition: "opacity 1s ease"
                      });
                      n("#swipebox-action, #swipebox-caption").css({
                          "-webkit-transition": "0.5s",
                          "-moz-transition": "0.5s",
                          "-o-transition": "0.5s",
                          "-khtml-transition": "0.5s",
                          transition: "0.5s"
                      })
                  }
                  if (h) {
                      var r = n("#swipebox-action #swipebox-close").css("background-image");
                      r = r.replace("png", "svg");
                      n("#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-action #swipebox-close").css({
                          "background-image": r
                      })
                  }
                  a.each(function() {
                      n("#swipebox-slider").append('<div class="slide"></div>')
                  });
                  t.setDim();
                  t.actions();
                  t.keyboard();
                  t.gesture();
                  t.animBars();
                  n(e).resize(function() {
                      t.setDim()
                  }).resize()
              },
              setDim: function() {
                  var t = {
                      width: n(e).width(),
                      height: e.innerHeight ? e.innerHeight: n(e).height()
                  };
                  n("#swipebox-overlay").css(t)
              },
              supportTransition: function() {
                  var e = "transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");
                  for (var n = 0; n < e.length; n++) {
                      if (t.createElement("div").style[e[n]] !== r) {
                          return e[n]
                      }
                  }
                  return false
              },
              doCssTrans: function() {
                  if (u.settings.useCSS && this.supportTransition()) {
                      return true
                  }
              },
              gesture: function() {
                  if (c) {
                      var e = this,
                      t = null,
                      r = 10,
                      i = {},
                      s = {};
                      var o = n("#swipebox-caption, #swipebox-action");
                      o.addClass("visible-bars");
                      e.setTimeout();
                      n("body").bind("touchstart",
                      function(e) {
                          n(this).addClass("touching");
                          s = e.originalEvent.targetTouches[0];
                          i.pageX = e.originalEvent.targetTouches[0].pageX;
                          n(".touching").bind("touchmove",
                          function(e) {
                              e.preventDefault();
                              e.stopPropagation();
                              s = e.originalEvent.targetTouches[0]
                          });
                          return false
                      }).bind("touchend",
                      function(u) {
                          u.preventDefault();
                          u.stopPropagation();
                          t = s.pageX - i.pageX;
                          if (t >= r) {
                              e.getPrev()
                          } else if (t <= -r) {
                              e.getNext()
                          } else {
                              if (!o.hasClass("visible-bars")) {
                                  e.showBars();
                                  e.setTimeout()
                              } else {
                                  e.clearTimeout();
                                  e.hideBars()
                              }
                          }
                          n(".touching").off("touchmove").removeClass("touching")
                      })
                  }
              },
              setTimeout: function() {
                  if (u.settings.hideBarsDelay > 0) {
                      var t = this;
                      t.clearTimeout();
                      t.timeout = e.setTimeout(function() {
                          t.hideBars()
                      },
                      u.settings.hideBarsDelay)
                  }
              },
              clearTimeout: function() {
                  e.clearTimeout(this.timeout);
                  this.timeout = null
              },
              showBars: function() {
                  var e = n("#swipebox-caption, #swipebox-action");
                  if (this.doCssTrans()) {
                      e.addClass("visible-bars")
                  } else {
                      n("#swipebox-caption").animate({
                          top: 0
                      },
                      500);
                      n("#swipebox-action").animate({
                          bottom: 0
                      },
                      500);
                      setTimeout(function() {
                          e.addClass("visible-bars")
                      },
                      1e3)
                  }
              },
              hideBars: function() {
                  var e = n("#swipebox-caption, #swipebox-action");
                  if (this.doCssTrans()) {
                      e.removeClass("visible-bars")
                  } else {
                      n("#swipebox-caption").animate({
                          top: "-50px"
                      },
                      500);
                      n("#swipebox-action").animate({
                          bottom: "-50px"
                      },
                      500);
                      setTimeout(function() {
                          e.removeClass("visible-bars")
                      },
                      1e3)
                  }
              },
              animBars: function() {
                  var e = this;
                  var t = n("#swipebox-caption, #swipebox-action");
                  if (!c) {
                      t.addClass("visible-bars");
                      e.setTimeout();
                      n("#swipebox-slider").click(function(n) {
                          if (!t.hasClass("visible-bars")) {
                              e.showBars();
                              e.setTimeout()
                          }
                      });
                      n("#swipebox-action").hover(function() {
                          e.showBars();
                          t.addClass("force-visible-bars");
                          e.clearTimeout()
                      },
                      function() {
                          t.removeClass("force-visible-bars");
                          e.setTimeout()
                      })
                  }
              },
              keyboard: function() {
                  if (!c) {
                      var t = this;
                      n(e).bind("keyup",
                      function(e) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.keyCode == 37) {
                              t.getPrev()
                          } else if (e.keyCode == 39) {
                              t.getNext()
                          } else if (e.keyCode == 27) {
                              t.closeSlide()
                          }
                      })
                  }
              },
              actions: function() {
                  var e = this;
                  if (a.length < 2) {
                      n("#swipebox-prev, #swipebox-next").hide()
                  } else {
                      n("#swipebox-prev").bind("click touchend",
                      function(t) {
                          t.preventDefault();
                          t.stopPropagation();
                          e.getPrev();
                          e.setTimeout()
                      });
                      n("#swipebox-next").bind("click touchend",
                      function(t) {
                          t.preventDefault();
                          t.stopPropagation();
                          e.getNext();
                          e.setTimeout()
                      })
                  }
                  n("#swipebox-close").bind("click touchstart",
                  function(t) {
                      e.closeSlide()
                  })
              },
              setSlide: function(e) {
                  var t = n("#swipebox-slider");
                  if (this.doCssTrans()) {
                      t.css({
                          left: -e * 100 + "%"
                      })
                  } else {
                      t.animate({
                          left: -e * 100 + "%"
                      })
                  }
                  n("#swipebox-slider .slide").removeClass("current");
                  n("#swipebox-slider .slide").eq(e).addClass("current");
                  this.setTitle(e);
                  n("#swipebox-prev, #swipebox-next").removeClass("disabled");
                  if (e == 0) {
                      n("#swipebox-prev").addClass("disabled")
                  } else if (e == a.length - 1) {
                      n("#swipebox-next").addClass("disabled")
                  }
              },
              openSlide: function(e) {
                  n("#swipebox-overlay").show().stop().animate({
                      opacity: 1
                  },
                  "slow").addClass("visible");
                  setTimeout(function() {
                      n("body").addClass("swipebox-overflow-hidden")
                  },
                  1500);
                  this.setSlide(e)
              },
              preloadImg: function(e) {
                  var t = this;
                  setTimeout(function() {
                      t.openImg(e)
                  },
                  1e3)
              },
              openImg: function(e) {
                  var t = this;
                  if (e < 0 || e >= a.length) {
                      return false
                  }
                  t.loadImg(a.eq(e).attr("href"),
                  function() {
                      n("#swipebox-slider .slide").eq(e).html(this)
                  })
              },
              setTitle: function(e) {
                  var t = null;
                  if (a.eq(e).attr("title")) {
                      n("#swipebox-caption").empty().append(a.eq(e).attr("title"))
                  }
              },
              loadImg: function(e, t) {
                  var r = n("<img>").on("load",
                  function() {
                      t.call(r)
                  });
                  r.attr("src", e)
              },
              getNext: function() {
                  var e = this;
                  index = n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));
                  if (index + 1 < a.length) {
                      index++;
                      e.setSlide(index);
                      e.preloadImg(index + 1)
                  } else {
                      n("#swipebox-slider").addClass("rightSpring");
                      setTimeout(function() {
                          n("#swipebox-slider").removeClass("rightSpring")
                      },
                      500)
                  }
              },
              getPrev: function() {
                  var e = this;
                  index = n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));
                  if (index > 0) {
                      index--;
                      e.setSlide(index);
                      e.preloadImg(index - 1)
                  } else {
                      n("#swipebox-slider").addClass("leftSpring");
                      setTimeout(function() {
                          n("#swipebox-slider").removeClass("leftSpring")
                      },
                      500)
                  }
              },
              closeSlide: function() {
                  var e = this;
                  n("body").removeClass("swipebox-overflow-hidden");
                  n("#swipebox-overlay").animate({
                      opacity: 0
                  },
                  "fast");
                  setTimeout(function() {
                      n("#swipebox-overlay").removeClass("visible");
                      e.destroy()
                  },
                  1e3)
              },
              destroy: function() {
                  var t = this;
                  n(e).unbind("keyup");
                  n(e).unbind("resize");
                  n("body").unbind();
                  n("#swipebox-slider").unbind();
                  n("#swipebox-overlay").remove();
                  a.removeData("_swipebox")
              }
          };
          u.init()
      };
      n.fn.swipebox = function(e) {
          if (!n.data(this, "_swipebox")) {
              var t = new n.swipebox(this, e);
              this.data("_swipebox", t)
          }
      }
  })(window, document, jQuery)


  jQuery(document).ready(function($){
  	var is_bouncy_nav_animating = false;
  	//open bouncy navigation
  	$('.cd-bouncy-nav-trigger').on('click', function(){
  		triggerBouncyNav(true);
  	});
  	//close bouncy navigation
  	$('.cd-bouncy-nav-modal .cd-close').on('click', function(){
  		triggerBouncyNav(false);
  	});
  	$('.cd-bouncy-nav-modal').on('click', function(event){
  		if($(event.target).is('.cd-bouncy-nav-modal')) {
  			triggerBouncyNav(false);
  		}
  	});

  	function triggerBouncyNav($bool) {
  		//check if no nav animation is ongoing
  		if( !is_bouncy_nav_animating) {
  			is_bouncy_nav_animating = true;

  			//toggle list items animation
  			$('.cd-bouncy-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
  				$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
  				if(!$bool) $('.cd-bouncy-nav-modal').removeClass('fade-out');
  				is_bouncy_nav_animating = false;
  			});

  			//check if CSS animations are supported...
  			if($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0 ) {
  				$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
  				is_bouncy_nav_animating = false;
  			}
  		}
  	}
  });


  /*! WOW - v0.1.9 - 2014-05-10
  * Copyright (c) 2014 Matthieu Aussaguel; Licensed MIT */
  (function() {
      var a, b, c = function(a, b) {
          return function() {
              return a.apply(b, arguments)
          }
      };
      a = function() {
          function a() {}
          return a.prototype.extend = function(a, b) {
              var c, d;
              for (c in a) d = a[c],
              null != d && (b[c] = d);
              return b
          },
          a.prototype.isMobile = function(a) {
              return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)
          },
          a
      } (),
      b = this.WeakMap || (b = function() {
          function a() {
              this.keys = [],
              this.values = []
          }
          return a.prototype.get = function(a) {
              var b, c, d, e, f;
              for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d) if (c = f[b], c === a) return this.values[b]
          },
          a.prototype.set = function(a, b) {
              var c, d, e, f, g;
              for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e) if (d = g[c], d === a) return void(this.values[c] = b);
              return this.keys.push(a),
              this.values.push(b)
          },
          a
      } ()),
      this.WOW = function() {
          function d(a) {
              null == a && (a = {}),
              this.scrollCallback = c(this.scrollCallback, this),
              this.scrollHandler = c(this.scrollHandler, this),
              this.start = c(this.start, this),
              this.scrolled = !0,
              this.config = this.util().extend(a, this.defaults),
              this.animationNameCache = new b
          }
          return d.prototype.defaults = {
              boxClass: "wow",
              animateClass: "animated",
              offset: 0,
              mobile: !0
          },
          d.prototype.init = function() {
              var a;
              return this.element = window.document.documentElement,
              "interactive" === (a = document.readyState) || "complete" === a ? this.start() : document.addEventListener("DOMContentLoaded", this.start)
          },
          d.prototype.start = function() {
              var a, b, c, d;
              if (this.boxes = this.element.getElementsByClassName(this.config.boxClass), this.boxes.length) {
                  if (this.disabled()) return this.resetStyle();
                  for (d = this.boxes, b = 0, c = d.length; c > b; b++) a = d[b],
                  this.applyStyle(a, !0);
                  return window.addEventListener("scroll", this.scrollHandler, !1),
                  window.addEventListener("resize", this.scrollHandler, !1),
                  this.interval = setInterval(this.scrollCallback, 50)
              }
          },
          d.prototype.stop = function() {
              return window.removeEventListener("scroll", this.scrollHandler, !1),
              window.removeEventListener("resize", this.scrollHandler, !1),
              null != this.interval ? clearInterval(this.interval) : void 0
          },
          d.prototype.show = function(a) {
              return this.applyStyle(a),
              a.className = "" + a.className + " " + this.config.animateClass
          },
          d.prototype.applyStyle = function(a, b) {
              var c, d, e;
              return d = a.getAttribute("data-wow-duration"),
              c = a.getAttribute("data-wow-delay"),
              e = a.getAttribute("data-wow-iteration"),
              this.animate(function(f) {
                  return function() {
                      return f.customStyle(a, b, d, c, e)
                  }
              } (this))
          },
          d.prototype.animate = function() {
              return "requestAnimationFrame" in window ?
              function(a) {
                  return window.requestAnimationFrame(a)
              }: function(a) {
                  return a()
              }
          } (),
          d.prototype.resetStyle = function() {
              var a, b, c, d, e;
              for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b],
              e.push(a.setAttribute("style", "visibility: visible;"));
              return e
          },
          d.prototype.customStyle = function(a, b, c, d, e) {
              return b && this.cacheAnimationName(a),
              a.style.visibility = b ? "hidden": "visible",
              c && this.vendorSet(a.style, {
                  animationDuration: c
              }),
              d && this.vendorSet(a.style, {
                  animationDelay: d
              }),
              e && this.vendorSet(a.style, {
                  animationIterationCount: e
              }),
              this.vendorSet(a.style, {
                  animationName: b ? "none": this.cachedAnimationName(a)
              }),
              a
          },
          d.prototype.vendors = ["moz", "webkit"],
          d.prototype.vendorSet = function(a, b) {
              var c, d, e, f;
              f = [];
              for (c in b) d = b[c],
              a["" + c] = d,
              f.push(function() {
                  var b, f, g, h;
                  for (g = this.vendors, h = [], b = 0, f = g.length; f > b; b++) e = g[b],
                  h.push(a["" + e + c.charAt(0).toUpperCase() + c.substr(1)] = d);
                  return h
              }.call(this));
              return f
          },
          d.prototype.vendorCSS = function(a, b) {
              var c, d, e, f, g, h;
              for (d = window.getComputedStyle(a), c = d.getPropertyCSSValue(b), h = this.vendors, f = 0, g = h.length; g > f; f++) e = h[f],
              c = c || d.getPropertyCSSValue("-" + e + "-" + b);
              return c
          },
          d.prototype.animationName = function(a) {
              var b;
              try {
                  b = this.vendorCSS(a, "animation-name").cssText
              } catch(c) {
                  b = window.getComputedStyle(a).getPropertyValue("animation-name")
              }
              return "none" === b ? "": b
          },
          d.prototype.cacheAnimationName = function(a) {
              return this.animationNameCache.set(a, this.animationName(a))
          },
          d.prototype.cachedAnimationName = function(a) {
              return this.animationNameCache.get(a)
          },
          d.prototype.scrollHandler = function() {
              return this.scrolled = !0
          },
          d.prototype.scrollCallback = function() {
              var a;
              return this.scrolled && (this.scrolled = !1, this.boxes = function() {
                  var b, c, d, e;
                  for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b],
                  a && (this.isVisible(a) ? this.show(a) : e.push(a));
                  return e
              }.call(this), !this.boxes.length) ? this.stop() : void 0
          },
          d.prototype.offsetTop = function(a) {
              for (var b; void 0 === a.offsetTop;) a = a.parentNode;
              for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop;
              return b
          },
          d.prototype.isVisible = function(a) {
              var b, c, d, e, f;
              return c = a.getAttribute("data-wow-offset") || this.config.offset,
              f = window.pageYOffset,
              e = f + this.element.clientHeight - c,
              d = this.offsetTop(a),
              b = d + a.clientHeight,
              e >= d && b >= f
          },
          d.prototype.util = function() {
              return this._util || (this._util = new a)
          },
          d.prototype.disabled = function() {
              return ! this.config.mobile && this.util().isMobile(navigator.userAgent)
          },
          d
      } ()
  }).call(this);
