class CommentsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]
  # before_action :set_comment, only: [:show, :edit, :update, :destroy]

  def create
    @blog =Blog.find(params[:blog_id])
    @comment = @blog.comments.create(comment_params)
    redirect_to blog_path(@blog)
  end

  def destroy
    @blog =Blog.find(params[:blog_id])
    @comment = @blog.comments.find(params[:id])
    @comment.destroy
    redirect_to blog_path(@blog), alert: "You have deleted the comment successfully."
  end

  private

  def comment_params
    params.require(:comment).permit(:commenter, :body)
  end
end
