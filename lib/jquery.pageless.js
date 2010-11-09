// =======================================================================
// PageLess - endless page
//
// Author: Jean-Sébastien Ney (jeansebastien.ney@gmail.com)
// Contributors:
//	Alexander Lang (langalex)
// 	Lukas Rieder (Overbryd)
//
// Parameters:
//    currentPage: current page (params[:page])
//    distance: distance to the end of page in px when ajax query is fired
//    loader: selector of the loader div (ajax activity indicator)
//    loaderHtml: html code of the div if loader not used
//    loaderImage: image inside the loader
//    loaderMsg: displayed ajax message
//    pagination: selector of the paginator divs. 
//                if javascript is disabled paginator is provided
//    params: paramaters for the ajax query, you can pass auth_token here
//    totalPages: total number of pages
//    url: URL used to request more data
// Callback Parameters:
//    scrape: A function to modify the incoming data.
//    complete: A function to call when a new page has been loaded (optional)
//    end: A function to call when the last page has been loaded (optional)
//
// Requires: jquery
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
    , settings = { container: window
                 , currentPage: 1
                 , distance: 100
                 , pagination: '.pagination'
                 , params: {}
                 , url: location.href
                 , loaderImage: "/images/load.gif"
                 , scrape: function(data) { return data; }
                 };
    
  $.pageless = function(opts) {
    $.isFunction(opts) ? settings.call() : init(opts);
  };
  
  var loaderHtml = function () {
    return settings.loaderHtml || '\
<div id="pageless-loader" style="display:none;text-align:center;width:100%;">\
  <div class="msg" style="color:#e9e9e9;font-size:2em"></div>\
  <img src="' + settings.loaderImage + '" title="load" alt="loading more results" style="margin: 10px auto" />\
</div>';
  };
 
  // settings params: totalPages
  var init = function (opts) {
    if (settings.inited) return;
    settings.inited = TRUE;
    
    if (opts) $.extend(settings, opts);
    
    // for accessibility we can keep pagination links
    // but since we have javascript enabled we remove pagination links 
    if(settings.pagination) $(settings.pagination).remove();
    
    // start the listener
    startListener();
  };
  
  $.fn.pageless = function (opts) {
    var $el = $(this)
      , $loader = $(opts.loader, $el);
      
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
        $('#pageless-loader .msg').html(opts.loaderMsg);
      }
    }
  };
  
  //
  var loading = function (bool) {
    (isLoading = bool)
    ? (loader && loader.fadeIn('normal'))
    : (loader && loader.fadeOut('normal'));
  };
  
  // an object will reach 
  var distanceToBottom = function () {
    var container = settings.container;
    return (settings.container === window)
    ? $(document).height() - $(container).scrollTop() - $(container).height()
    : $(container)[0].scrollHeight - $(container).scrollTop() - $(container).height();
  };

  var stopListener = function() {
    $(settings.container).unbind('.pageless');
  };
  
  // * bind a scroll event
  // * trigger is once in case of reload
  var startListener = function() {
    $(settings.container).bind('scroll.pageless', scroll)
                         .trigger('scroll.pageless');
  };
  
  var scroll = function() {
    // listener was stopped or we've run out of pages
    if (settings.totalPages <= settings.currentPage) {
      stopListener();
      // if there is a afterStopListener callback we call it
      if (settings.end) { 
        settings.end.call(); 
      }
      return;
    }
    
    // distance to end of page
    var distance = distanceToBottom();
    
    // if slider past our scroll offset, then fire a request for more data
    if(!isLoading && (distance < settings.distance)) {
      loading(TRUE);
      // move to next page
      settings.currentPage++;
      // set up ajax query params
      $.extend( settings.params
              , { page: settings.currentPage });
      // finally ajax query
      $.get( settings.url
           , settings.params
           , function (data) {
               var data = settings.scrape(data);
               loader ? loader.before(data) : element.append(data);
               loading(FALSE);
               // if there is a complete callback we call it
               if (settings.complete) settings.complete.call();
           });
    }
  };
})(jQuery);