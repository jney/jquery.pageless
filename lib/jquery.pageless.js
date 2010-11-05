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
//    pagination: selector of the paginator divs. (if javascript is disabled paginator is required)
//    params: paramaters for the ajax query, you can pass auth_token here
//    totalPages: total number of pages
//    url: URL used to request more data
// Callback Parameters:
//    scrape: A function to modify the incoming data. (Doesn't do anything by default)
//    complete: A function to call when a new page has been loaded (optional)
//    afterStopListener: A function to call when the last page has been loaded (optional)
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
    , TRUE = !FALSE;
    
  $.pageless = function(settings) {
    $.isFunction(settings) ? settings.call() : $.pageless.init(settings);
  };
  
  // available params
  // distance: page distance in px to the end when the ajax function is launch
  // loader: loading div
  // loaderMsg:
  // loaderImage:
  // loaderHtml:
  // pagination: div selector for the pagination links
  // params: params of the query you can pass auth_token here
  $.pageless.settings = { container: window
                        , currentPage: 1
                        , distance: 100
                        , pagination: '.pagination'
                        , params: {}
                        , url: location.href
                        , loaderImage: "/images/load.gif"
                        , scrape: function(data) { return data; }
                        };
  
  $.pageless.loaderHtml = function(){
    return $.pageless.settings.loaderHtml || '\
<div id="pageless-loader" style="display:none;text-align:center;width:100%;">\
  <div class="msg" style="color:#e9e9e9;font-size:2em"></div>\
  <img src="' + $.pageless.settings.loaderImage + '" title="load" alt="loading more results" style="margin: 10px auto" />\
</div>';
  };
 
  // settings params: totalPages
  $.pageless.init = function(settings) {
    if ($.pageless.settings.inited) return;
    $.pageless.settings.inited = TRUE;
    
    if (settings) $.extend($.pageless.settings, settings);
    
    // for accessibility we can keep pagination links
    // but since we have javascript enabled we remove pagination links 
    if($.pageless.settings.pagination)
      $($.pageless.settings.pagination).remove();
    
    // start the listener
    $.pageless.startListener();
  };
  
  // init loader val
  $.pageless.isLoading = FALSE;
  
  $.fn.pageless = function(settings) {
    var $el = $(this)
      , $loader = $el.find(settings.loader);
      
    $.pageless.init(settings);
    $.pageless.el = $el;
    
    // loader element
    if(settings.loader && $loader.length){
      $.pageless.loader = $loader;
    } else {
      $.pageless.loader = $($.pageless.loaderHtml());
      $el.append($.pageless.loader);
      // if we use the default loader, set the message
      if(!settings.loaderHtml) {
        $('#pageless-loader .msg').html(settings.loaderMsg);
      }
    }
  };
  
  //
  $.pageless.loading = function (bool) {
    ($.pageless.isLoading = bool)
    ? ($.pageless.loader && $.pageless.loader.fadeIn('normal'))
    : ($.pageless.loader && $.pageless.loader.fadeOut('normal'));
  };
  
  // an object will reach 
  var distanceToBottom = function () {
    return (container[0] === window)
    ? $(document).height() - $(container).scrollTop() - $(container).height()
    : $(container)[0].scrollHeight - $(container).scrollTop() - $(container).height();
  };

  $.pageless.stopListener = function() {
    $(container).unbind('.pageless');
  };
  
  $.pageless.startListener = function() {
    $(container).bind('scroll.pageless', $.pageless.scroll);
  };
  
  $.pageless.scroll = function() {
    // listener was stopped or we've run out of pages
    if($.pageless.settings.totalPages <= $.pageless.settings.currentPage){
      $.pageless.stopListener();
      // if there is a afterStopListener callback we call it
      if ($.pageless.settings.afterStopListener) { 
        $.pageless.settings.afterStopListener.call(); 
      }
      return;
    }
    
    // distance to end of page
    var distance = distanceToBottom();
    // if slider past our scroll offset, then fire a request for more data
    if(!$.pageless.isLoading && (distance < $.pageless.settings.distance)) {
      $.pageless.loading(true);
      // move to next page
      $.pageless.settings.currentPage++;
      // set up ajax query params
      $.extend( $.pageless.settings.params
              , { page: $.pageless.settings.currentPage });
      // finally ajax query
      $.get( $.pageless.settings.url
           , $.pageless.settings.params
           , function (data) {
               var data = $.pageless.settings.scrape(data);
               
               $.pageless.loader 
               ? $.pageless.loader.before(data) 
               : $.pageless.el.append(data);
               
               $.pageless.loading(false);
               // if there is a complete callback we call it
               if ($.pageless.settings.complete) $.pageless.settings.complete.call();
           });
    }
  };
})(jQuery);