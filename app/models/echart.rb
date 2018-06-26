class Echart < ApplicationRecord
  validates_presence_of :number, :stock_name, :stock_industry, :holders_change_q1,
  :top10_holders_change_q1,
  :net_profit_inc_3,
  :net_profit_inc_3,
  :ROE_last_FS,
  :sales_mg_q1,
  :sales_nmg_q1,
  :rev_inc_q1,
  :amount_of_inc
end
