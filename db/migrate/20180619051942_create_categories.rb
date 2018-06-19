class CreateCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :categories do |t|
      t.string :name

      t.timestamps
    end
      add_column :blogs, :category_id, :integer
      add_index :blogs, :category_id
  end
end
