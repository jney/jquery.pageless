# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def pageless(total_pages, url=nil)
    opts = {
      :totalPages => total_pages,
      :url        => url,
      :loaderMsg  => 'Loading more results'
    }
    
    javascript_tag("$('#results').pageless(#{opts.to_json});")
  end
end
