module ApplicationHelper
  def pageless(total_pages, url=nil, container=nil)
    opts = {
      :totalPages => total_pages,
      :url        => url,
      :loaderMsg  => 'Loading more results'
    }
    
    container && opts[:container] ||= container
    
    javascript_tag("$('#results').pageless(#{opts.to_json});")
  end
end
