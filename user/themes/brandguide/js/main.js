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

  function _scrollBody(element, duration=250, delay=0,offset=0) {

    element.velocity("scroll", {
      duration: duration,
      delay: delay,
      offset: -offset
    }, "easeOutSine");
  }

  // Handles main nav
  function _initNav() {
    // SEO-useless nav toggler
    if (!$body.is('.homepage')) {    
      $('<button class="menu-toggle"><span class="menu-icon"></span><span class="label">Table of Contents</span></button>')
        .prependTo('.nav-wrap')
        .on('click', function(e) {
          if (!$('.main-nav').is('.active')) {
            _showMobileNav();
          } else {
            _hideMobileNav();
          }
      });

      $document.on('click', 'body.menu-open', function(e) {
        if (!isNav($(e.target))) {
          _hideMobileNav();
        }
      });
    }

    function isNav(target) {
      if (target.is('.menu-toggle') || target.parents('.menu-toggle').length || target.is('.main-nav') || target.parents('.main-nav').length) {
        return true;
      }
    }

    // var mobileSearch = $('.search-form').clone().addClass('mobile-search');
    // mobileSearch.prependTo('.site-nav');

    $('.main-nav a').on('click', function() {
      if (this.hash) {
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
