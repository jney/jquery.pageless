# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def pageless(total_pages, url=nil)
    javascript_tag(
      "$('#results').pageless({" \
        "totalPages:#{total_pages}," \
        "url:'#{url}'," \
        "params:{without_layout: true}, " \
        "loaderMsg:'Loading more results'" \
      "});"
    )
  end
end
