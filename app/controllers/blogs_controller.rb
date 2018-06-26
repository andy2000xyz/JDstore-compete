class BlogsController < ApplicationController

before_action :validate_search_key, only: [:search]

  def index
    @blogs = Blog.order("id DESC").all
    
  end

  def show
    @blog = Blog.find(params[:id])
    @previous = @blog.previous_blog
    @next = @blog.next_blog
    @blogs = Blog.all
  end

  def search
    if @query_string.present?
      search_result = Blog.ransack(@search_criteria).result(:distinct => true)
      @blogs = search_result.paginate(:page => params[:page], :per_page => 20 )
    end

  end

  protected

  def validate_search_key
    @query_string = params[:q].gsub(/\\|\'|\/|\?/, "") if params[:q].present?
    @search_criteria = search_criteria(@query_string)
  end


  def search_criteria(query_string)
    { :title_or_content_cont => query_string }
  end

end
