class ChangeDetailsFromEcharts < ActiveRecord::Migration[5.0]
  def change
    change_table :echarts do |t|
      t.string :stock_name
      t.string :stock_industry
      t.string :holders_change_q1
      t.string :top10_holders_change_q1
      t.string :net_profit_inc_3
      t.string :rev_inc_3
      t.string :ROE_last_FS
      t.string :sales_mg_q1
      t.string :sales_nmg_q1
      t.string :rev_inc_q1
      t.string :amount_of_inc
    end
  end
end
