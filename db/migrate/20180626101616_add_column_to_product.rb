class AddColumnToProduct < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :sub_info, :text
  end
end
