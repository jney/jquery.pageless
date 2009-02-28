// =======================================================================
// PageLess - endless page
//
// Author: Jean-Sébastien Ney (jeansebastien.ney@gmail.com)
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
//    totalPage: total number of pages
//    url: URL used to request more data
//
// Requires: jquery + jquery dimensions
//
// Thanks to:
//  * codemonky.com/post/34940898
//  * www.unspace.ca/discover/pageless/
//  * famspam.com/facebox
// =======================================================================

(function($) {
  $.pageless = function(settings) {
    $.isFunction(settings) ? settings.call() : $.pageless.init(settings);
  };
  
  // available params
  // loader: loading div
  // pagination: div selector for the pagination links
  // loaderMsg:
  // loaderImage:
  // loaderHtml:
  $.pageless.settings = {
    currentPage:  1,
    pagination:   '.pagination',
    url:          location.href,
    params:       {}, // params of the query you can pass auth_token here
    distance:     100, // page distance in px to the end when the ajax function is launch
    loaderImage:  "/images/load.gif"
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
    $.pageless.settings.inited = true;
    
    if (settings) $.extend($.pageless.settings, settings);
    
    // for accessibility we can keep pagination links
    // but since we have javascript enabled we remove pagination links 
    if($.pageless.settings.pagination)
      $($.pageless.settings.pagination).remove();
    
    // start the listener
    $.pageless.startListener();
  };
  
  // init loader val
  $.pageless.isLoading = false;
  
  $.fn.pageless = function(settings) {
    $.pageless.init(settings);
    $.pageless.el = $(this);
    
    // loader element
    if(settings.loader && $(this).find(settings.loader).length){
      $.pageless.loader = $(this).find(settings.loader);
    } else {
      $(this).append($.pageless.loaderHtml());
      $.pageless.loader = $('#pageless-loader');
      $('#pageless-loader .msg').html(settings.loaderMsg);
    }
  };
  
  //
  $.pageless.loading = function(bool){
    if(bool === true){
      $.pageless.isLoading = true;
      if($.pageless.loader)
        $.pageless.loader.fadeIn('normal');
    } else {
      $.pageless.isLoading = false;
      if($.pageless.loader)
        $.pageless.loader.fadeOut('normal');
    }
  };
  
  $.pageless.stopListener = function() {
    $(window).unbind('.pageless');
  };
  
  $.pageless.startListener = function() {
    $(window).bind('scroll.pageless', $.pageless.scroll);
  };
  
  $.pageless.scroll = function() {
    // listener was stopped or we've run out of pages
    if($.pageless.settings.totalPages <= $.pageless.settings.currentPage){
      $.pageless.stopListener();
      return;
    }
    
    // distance to end of page
    var distance = $(document).height()-$(window).scrollTop()-$(window).height();
    // if slider past our scroll offset, then fire a request for more data
    if(!$.pageless.isLoading && (distance < $.pageless.settings.distance)) {
      $.pageless.loading(true);
      // move to next page
      $.pageless.settings.currentPage++;
      // set up ajax query params
      $.extend($.pageless.settings.params, {page: $.pageless.settings.currentPage});
      // finally ajax query
      $.get($.pageless.settings.url, $.pageless.settings.params, function(data){
        $.pageless.loader ?
          $.pageless.loader.before(data) :
          $.pageless.el.append(data);
        $.pageless.loading(false);
        // if there is a callback we call it
        if($.pageless.settings.complete) $.pageless.settings.complete.call();
      });
    }
  };
})(jQuery);