class CreateBlogs < ActiveRecord::Migration[5.0]
  def change
    create_table :blogs do |t|
      t.string :title
      t.string :author
      t.string :category
      t.text :content

      t.timestamps
    end
  end
end
