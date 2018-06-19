class RemoveBlogIdFromBlog < ActiveRecord::Migration[5.0]
  def change
    remove_column :blogs, :blog_id, :integer
  end
end
