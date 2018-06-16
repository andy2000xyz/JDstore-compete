class AddBlogIdToBlog < ActiveRecord::Migration[5.0]
  def change
    add_column :blogs, :blog_id, :integer
  end
end
