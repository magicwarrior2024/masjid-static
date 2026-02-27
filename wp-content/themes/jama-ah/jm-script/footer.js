    jQuery(document).ready(function ($) {
		$('.newsticker_post').AcmeTicker({
            type:'marquee',
            direction: 'left',
            speed: 0.05,
            controls: {
                toggle: $('.acme-news-ticker-pause'),
            }
        });
	})
	
	jQuery(document).bind("scroll", function() { 
		if ( jQuery(this).scrollTop() >= 150 ) {  
			jQuery('body').addClass("noscroll");
		} else {
			jQuery('body').removeClass("noscroll");
		}
	});
	
	jQuery(document).ready(function($){
		$(".toggle_info").click(function(){
			$("body").addClass("open_info");
		});
		$(".close_info").click(function(){
			$("body").removeClass("open_info");
		});
		$(".jm__openmenu").click(function(){
			$("body").toggleClass("open_menu");
		});
		
    });
	 
	function resize() {
        if ( jQuery(window).width() < 982 ) { 
	    	jQuery(".jm__menu .navmenu .dd").addClass("accord").removeClass("desktop"); 
		} else { 
	    	jQuery(".jm__menu .navmenu .dd").removeClass("accord").addClass("desktop");
		}
    }
	
    (console.log = function () {}),
	
    jQuery.noConflict(),
    jQuery("document").ready(function (e) {
            
            e(".navmenu > ul > li:has(ul),.navmenu > ul > li > ul > li:has(ul),.navmenu > ul > li > ul > li > ul > li:has(ul)").addClass("has-sub"),
            e(".navmenu > ul > li > a").click(function () {
                var l = e(this).next();
                return (
                    e(".navmenu li").removeClass("active"),
                    e(this).closest("li").addClass("active"),
                    l.is("ul") && l.is(":visible") && (e(this).closest("li").removeClass("active"), l.slideUp("slow")),
                    l.is("ul") && !l.is(":visible") && (e(".navmenu ul ul:visible").slideUp("slow"), l.slideDown("slow")),
                    !l.is("ul")
                );
            }),
            e(".navmenu > ul > li > ul > li > a").click(function () {
                var l = e(this).next();
                return (
                    e(".navmenu li ul li").removeClass("active"),
                    e(this).closest("li").addClass("active"),
                    l.is("ul") && l.is(":visible") && (e(this).closest("li").removeClass("active"), l.slideUp("slow")),
                    l.is("ul") && !l.is(":visible") && (e(".navmenu ul ul ul:visible").slideUp("slow"), l.slideDown("slow")),
                    !l.is("ul")
                );
            }),
            e(".navmenu > ul > li > ul > li > ul > li > a").click(function () {
                var l = e(this).next();
                return (
                    e(".navmenu li ul li ul li").removeClass("active"),
                    e(this).closest("li").addClass("active"),
                    l.is("ul") && l.is(":visible") && (e(this).closest("li").removeClass("active"), l.slideUp("slow")),
                    l.is("ul") && !l.is(":visible") && (e(".navmenu ul ul ul ul:visible").slideUp("slow"), l.slideDown("slow")),
                    !l.is("ul")
                );
            });
    });
	
    jQuery(document).ready(function (e) {
        e(window).resize(resize), resize();
    });
	



