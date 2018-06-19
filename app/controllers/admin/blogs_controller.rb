class Admin::BlogsController < ApplicationController

  layout "admin"

  before_action :authenticate_user!
  before_action :admin_required

  def index
    @blogs = Blog.all
  end

  def show
    @blog = Blog.find(params[:id])
  end

  def new
    @blog = Blog.new
  end

  def create
    @blog = Blog.new(blog_params)
    if @blog.save
      redirect_to admin_blogs_path
    else
      render "new"
    end
  end

  def edit
    @blog = Blog.find(params[:id])
  end

  def update
    @blog = Blog.find(params[:id])
    if @blog.update(blog_params)
      redirect_to admin_blogs_path
    else
      render "edit"
    end
  end

  def destroy
    @blog = Blog.find(params[:id])
    @blog.destroy
    redirect_to admin_blogs_path
  end

  # def bulk_update
  #   total = 0
  #   Array(params[:ids]).each do |blog_id|
  #     blog = Blog.find(blog_id)
  #     blog.destroy
  #     total += 1
  #   end

  #   flash[:alert] = "成功完成 #{total} 笔"
  #   redirect_to admin_blogs_path
  # end

  private

  def blog_params
    params.require(:blog).permit(:title, :author, :content, :category_id)
  end

end
