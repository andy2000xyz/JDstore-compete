class CreateEcharts < ActiveRecord::Migration[5.0]
  def change
    create_table :echarts do |t|
      t.string :number, :index => true # 编号
      t.timestamps
    end
  end
end
