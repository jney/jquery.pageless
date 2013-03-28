// =======================================================================
// PageLess - endless page
//
// Pageless is a jQuery plugin.
// As you scroll down you see more results coming back at you automatically.
// It provides an automatic pagination in an accessible way : if javascript
// is disabled your standard pagination is supposed to work.
//
// Licensed under the MIT:
// http://www.opensource.org/licenses/mit-license.php
//
// Parameters:
//    currentPage: current page (string or function; e.g. <%= params[:page] %>)
//    distance: distance to the end of page in px when ajax query is fired
//    loader: selector of the loader div (ajax activity indicator)
//    loaderHtml: html code of the div if loader not used
//    loaderImage: image inside the loader
//    loaderMsg: displayed ajax message
//    pagination: selector of the paginator divs.
//                if javascript is disabled paginator is provided
//    params: paramaters for the ajax query (hash or function), you can pass auth_token here
//    totalPages: total number of pages (integer or function)
//    url: URL used to request more data (string or function)
//    method: HTML method for call URL, default - get
//
// Callback Parameters:
//    scrape: A function to modify the incoming data.
//    complete: A function to call when a new page has been loaded (optional)
//    end: A function to call when the last page has been loaded (optional)
//
// Usage:
//   $('#results').pageless({ totalPages: 10
//                          , url: '/articles/'
//                          , loaderMsg: 'Loading more results'
//                          });
//
// Requires: jquery
//
// Author: Jean-Sébastien Ney (https://github.com/jney)
//
// Contributors:
//   Alexander Lang (https://github.com/langalex)
//   Lukas Rieder (https://github.com/Overbryd)
//   Kathryn Reeve (https://github.com/BinaryKitten)
//
// Thanks to:
//  * codemonky.com/post/34940898
//  * www.unspace.ca/discover/pageless/
//  * famspam.com/facebox
// =======================================================================

(function($) {

  var FALSE = !1
    , TRUE = !FALSE
    , element
    , isLoading = FALSE
    , loader
    , namespace = '.pageless'
    , SCROLL = 'scroll' + namespace
    , RESIZE = 'resize' + namespace
    , settings = { container: window
                 , currentPage: 1
                 , distance: 100
                 , pagination: '.pagination'
                 , params: {}
                 , url: location.href
                 , loaderImage: "/images/load.gif"
                 , method: 'get'
                 }
    , container
    , $container;

  $.pageless = function(opts) {
    $.isFunction(opts) ? opts.call() : init(opts);
  };

  $.pagelessReset = function() {
    settings = { container: window
                 , currentPage: 1
                 , distance: 100
                 , pagination: '.pagination'
                 , params: {}
                 , url: location.href
                 , loaderImage: "/images/load.gif"
                 , method: 'get'
                 };
    stopListener();
      // if there is a afterStopListener callback we call it
    if (settings.end) settings.end.call();
  };

  var loaderHtml = function () {
    return settings.loaderHtml || '\
<div id="pageless-loader" style="display:none;text-align:center;width:100%;">\
  <div class="msg" style="color:#e9e9e9;font-size:2em"></div>\
  <img src="' + settings.loaderImage + '" alt="loading more results" style="margin:10px auto" />\
</div>';
  };

  // settings params: totalPages
  var init = function (opts) {
    if (settings.inited) return;
    settings.inited = TRUE;

    if (opts) $.extend(settings, opts);

    container = settings.container;
    $container = $(container);

    // for accessibility we can keep pagination links
    // but since we have javascript enabled we remove pagination links
    if(settings.pagination) $(settings.pagination).remove();

    // start the listener
    startListener();
  };

  $.fn.pageless = function (opts) {
    var $el = $(this);
    var $loader = $(opts.loader, $el);

    init(opts);
    element = $el;

    // loader element
    if (opts.loader && $loader.length) {
      loader = $loader;
    } else {
      loader = $(loaderHtml());
      $el.append(loader);
      // if we use the default loader, set the message
      if (!opts.loaderHtml) {
        $('#pageless-loader .msg').html(opts.loaderMsg).css(opts.msgStyles || {});
      }
    }
  };

  //
  var loading = function (bool) {
    (isLoading = bool)
    ? (loader && loader.fadeIn('normal'))
    : (loader && loader.fadeOut('normal'));
  };

  // distance to end of the container
  var distanceToBottom = function () {
    return (container === window)
         ? $(document).height()
         - $container.scrollTop()
         - $container.height()
         : $container[0].scrollHeight
         - $container.scrollTop()
         - $container.height();
  };

  var stopListener = function() {
    $container.unbind(namespace);
  };

  // * bind a scroll event
  // * trigger is once in case of reload
  var startListener = function() {
    $container.bind(SCROLL+' '+RESIZE, watch)
              .trigger(SCROLL);
  };

  var watch = function() {
    var currentPage = $.isFunction(settings.currentPage) ? settings.currentPage() : settings.currentPage;
    var requestParams = $.isFunction(settings.params) ? settings.params() : settings.params;
    var totalPages = $.isFunction(settings.totalPages) ? settings.totalPages() : settings.totalPages;
    var url = $.isFunction(settings.url) ? settings.url() : settings.url;

    // listener was stopped or we've run out of pages
    if (totalPages <= currentPage) {
      if (!$.isFunction(settings.currentPage) && !$.isFunction(settings.totalPages)) {
        stopListener();
        // if there is a afterStopListener callback we call it
        if (settings.end) settings.end.call();
      }
      return;
    }

    // if slider past our scroll offset, then fire a request for more data
    if(!isLoading && (distanceToBottom() < settings.distance)) {
      loading(TRUE);
      // move to next page
      currentPage++;
      if (!$.isFunction(settings.currentPage)) { 
        settings.currentPage = currentPage; 
      }

      // set up ajax query params
      $.extend( requestParams, { page: currentPage });
      // finally ajax query
      if (settings.method == 'post') {
        $.post(url, requestParams, 
          function (data) {
                 $.isFunction(settings.scrape) ? settings.scrape(data) : data;
                 loader ? loader.before(data) : element.append(data);
                loading(FALSE);
               // if there is a complete callback we call it
                if (settings.complete) settings.complete.call();
            }, 'html');
      } else {
        $.get( settings.url
            , settings.params
            , function (data) {
                $.isFunction(settings.scrape) ? settings.scrape(data) : data;
                loader ? loader.before(data) : element.append(data);
               loading(FALSE);
               if (settings.complete) settings.complete.call();
           }, 'html');
      }
    }
  };
})(jQuery);
