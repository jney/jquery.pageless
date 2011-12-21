# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def pageless(total_pages, url=nil, parent_container=nil, container=nil)
    opts = {
      :totalPages => total_pages,
      :url        => url,
      :loaderMsg  => 'Cargando más resultados',
      # parent_container is the parent div of your list
      :parent_container => parent_container,
      :distance => 20,
      :params => params
    }

    container && opts[:container] ||= container

    javascript_tag("$('#{container}').pageless(#{opts.to_json});")
  end
end
