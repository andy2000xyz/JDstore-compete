class BlogsController < ApplicationController
  def index
    @blogs = Blog.rank(:row_order).all
  end

  def show
    @blog = Blog.find(params[:id])
    @previous = @blog.previous_blog
    @next = @blog.next_blog
    # @blog_list =@blog.blog_list
  end
end
