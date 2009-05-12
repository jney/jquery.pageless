class ArticlesController < ApplicationController
  # GET /articles
  # GET /articles.xml
  def index
    @articles = Article.all.paginate(:per_page => 10, :page => params[:page])
    if request.xhr?
      render(:partial => "article", :collection => @articles)
    end
  end
end
