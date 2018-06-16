class CommentsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]
  # before_action :set_comment, only: [:show, :edit, :update, :destroy]

  # GET /comments
  # GET /comments.json
  def index
    @comments = Comment.all
  end

  # GET /comments/1
  # GET /comments/1.json
  def show
    @blog =Blog.find(params[:blog_id])
    @comment = Comment.find(params[:id])
  end

  # GET /comments/new
  def new
    @comment = Comment.new
  end

  # GET /comments/1/edit
  def edit
  end

  # POST /comments
  # POST /comments.json
  def create
    @blog =Blog.find(params[:blog_id])
    @comment = @blog.comments.create(comment_params)
    @comment.user = current_user
    redirect_to blog_path(@blog)
  end

  # PATCH/PUT /comments/1
  # PATCH/PUT /comments/1.json
  def update
  end

  # DELETE /comments/1
  # DELETE /comments/1.json
  def destroy
    @blog =Blog.find(params[:blog_id])
    @comment = Comment.find(params[:id])
    @comment.destroy
    redirect_to blog_path(@blog), alert: "You have deleted the comment successfully."
  end

  private

  def comment_params
    params.require(:comment).permit(:blog_id, :body, :user_id)
  end
end
