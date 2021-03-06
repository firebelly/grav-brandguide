// Firebelly 2015

// Good Design for Good Reason for Good Namespace
var FB = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,1000,1200],
      $document,
      $body,
      loadingTimer;

  function _init() {
    // Cache some common DOM queries
    $document = $(document);
    $body = $('body');
    $('body').addClass('loaded');

    // Set screen size vars
    _resize();

    _initNav();
    _initColorPalettes();
    _initIsotope();
    _initLightbox();
    _initPageNav();
    _initBigClicky();

    // Esc handlers
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        _hideMobileNav();
      }
    });

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      _scrollBody($(href));
    });

    // Scroll down to hash afer page load
    $(window).load(function() {
      if (window.location.hash) {
        _scrollBody($(window.location.hash));
      }
    });

  } // end init()

  function _scrollBody(element) {

    element.velocity("scroll", {
      duration: 250,
      delay: 0,
      offset: 0
    }, "easeOutSine");
  }

  // Handles main nav
  function _initNav() {
    // SEO-useless nav toggler
    $('<button class="menu-toggle"><span class="menu-icon"></span><span class="label visually-hidden">Table of Contents</span></button>')
      .prependTo('.header')
      .on('click', function(e) {
        if (!$('.main-nav').is('.active')) {
          _showMobileNav();
        } else {
          _hideMobileNav();
        }
    });

    // Leaving out for now since the nav fills the viewport
    // $document.on('click', 'body.menu-open', function(e) {
    //   if (!isNav($(e.target))) {
    //     _hideMobileNav();
    //   }
    // });

    function isNav(target) {
      if (target.is('.menu-toggle') || target.parents('.menu-toggle').length || target.is('.main-nav') || target.parents('.main-nav').length) {
        return true;
      }
    }

    // var mobileSearch = $('.search-form').clone().addClass('mobile-search');
    // mobileSearch.prependTo('.site-nav');

    $('.main-nav a').on('click', function() {
      if (this.hash) {
        _hideMobileNav();
        _scrollBody($('#'+this.hash.substr(1)));
      }
    });
  }

  function _showMobileNav() {
    $('body, .menu-toggle').addClass('menu-open');
    $('.main-nav').addClass('active');
  }

  function _hideMobileNav() {
    $('body, .menu-toggle').removeClass('menu-open');
    $('.main-nav').removeClass('active');
  }

  function _initColorPalettes() {
    $('.colorpalettes:not(.colorways) .color').each(function() {
      var hex = $(this).find('.hex .value').text().replace('#', '');
      var rgb = _hexToRgb(hex);
      var cmyk = _rgbToCmyk(rgb);
      rgb = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
      cmyk = cmyk.c + ', ' + cmyk.m + ', ' + cmyk.y + ', ' + cmyk.k;
      $(this).find('.rgb .value').text(rgb);
      $(this).find('.cmyk .value').text(cmyk);
    });

    // Click to Copy
    var clipboard = new Clipboard('.swatch'),
    clipboardTimer;

    clipboard.on('success', function(e) {
      var $swatch = $(e.trigger);
      $swatch.append('<span class="copied-message"><span class="checkmark"></span>Copied!</span>');
      $swatch.addClass('copied');

      clipboardTimer = setTimeout(function() {
        $swatch.removeClass('copied');
        $swatch.find('.copied-message').remove();
      }, 3000);
    });
  }

  // Color Conversions
  function _hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  function CMYK(c, m, y, k) {
    if (c <= 0) { c = 0; }
    if (m <= 0) { m = 0; }
    if (y <= 0) { y = 0; }
    if (k <= 0) { k = 0; }
   
    if (c > 100) { c = 100; }
    if (m > 100) { m = 100; }
    if (y > 100) { y = 100; }
    if (k > 100) { k = 100; }
   
    this.c = c;
    this.m = m;
    this.y = y;
    this.k = k;
  }
  function _rgbToCmyk (RGB){
    var result = new CMYK(0, 0, 0, 0);
 
    r = RGB.r / 255;
    g = RGB.g / 255;
    b = RGB.b / 255;
 
    result.k = Math.min( 1 - r, 1 - g, 1 - b );
    result.c = ( 1 - r - result.k ) / ( 1 - result.k );
    result.m = ( 1 - g - result.k ) / ( 1 - result.k );
    result.y = ( 1 - b - result.k ) / ( 1 - result.k );
 
    result.c = Math.round( result.c * 100 );
    result.m = Math.round( result.m * 100 );
    result.y = Math.round( result.y * 100 );
    result.k = Math.round( result.k * 100 );
 
    return result;
  }

  function _initIsotope() {
    $('.isotope-grid').each(function() {
      // Initi on imagesloaded
      var $grid = $(this).imagesLoaded(function() {
        $grid.addClass('-loaded');
        $grid.isotope({
          itemSelector: '.photo',
          masonry: {
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer'
          }
        });
      });
    });

    $('.in-use-grid').each(function() {
      // Initi on imagesloaded
      var $grid = $(this).imagesLoaded(function() {
        $grid.addClass('-loaded');
        $grid.isotope({
          itemSelector: '.photo',
          masonry: {
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer'
          }
        });
      });
    });
  }

  function _initLightbox() {
    $('.lightbox').Chocolat({
      afterMarkup: function () {
        console.log(this);
        this.elems.close.appendTo(this.elems.content);
        this.elems.content.append('<div class="lightbox-nav"></div>');
        this.elems.left.appendTo(this.elems.content.find('.lightbox-nav'));
        this.elems.right.appendTo(this.elems.content.find('.lightbox-nav'));
        this.elems.left.text('prev');
        this.elems.right.text('next');
      }
    });

    // Add supurfilous markup to lightbox images
    $('.lightbox .photo').each(function() {
      $(this).append('<div class="click-overlay"><span class="expand-text">View Larger Image</span><span class="expand-icon"><span class="expand-arrow"></span></span></div>');
    });
  }

  function _initPageNav() {
    $('.page-nav a').hover(function() {
      $('.page-nav .colorbar').addClass('background-' + $(this).data('color') + '-override');
    }, function() {
      $('.page-nav .colorbar').removeClass('background-' + $(this).data('color') + '-override');
    });
  }

  function _initBigClicky() {
    $(document).on('click', '.feature', function(e) {
      if (!$(e.target).is('a')) {
        e.preventDefault();
        var link = $(this).find('a');
        var href = link.attr('href');
        if (href) {
          if (e.metaKey || link.attr('target')) {
            window.open(href);
          } else {
            location.href = href;
          }
        }
      }
    });
  }

  // Track ajax pages in Analytics
  function _trackPage() {
    if (typeof ga !== 'undefined') { ga('send', 'pageview', document.location.href); }
  }

  // Track events in Analytics
  function _trackEvent(category, action) {
    if (typeof ga !== 'undefined') { ga('send', 'event', category, action); }
  }

  // Called in quick succession as window is resized
  function _resize() {
    screenWidth = document.documentElement.clientWidth;
    breakpoint_small = (screenWidth > breakpoint_array[0]);
    breakpoint_medium = (screenWidth > breakpoint_array[1]);
    breakpoint_large = (screenWidth > breakpoint_array[2]);
  }

  // Called on scroll
  // function _scroll(dir) {
  //   var wintop = $(window).scrollTop();
  // }

  // Public functions
  return {
    init: _init,
    resize: _resize,
    scrollBody: function(section, duration, delay) {
      _scrollBody(section, duration, delay);
    }
  };

})(jQuery);

// Fire up the mothership
jQuery(document).ready(FB.init);

// Zig-zag the mothership
jQuery(window).resize(FB.resize);
