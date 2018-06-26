# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# u = User.new
# u.email = "admin@test.com"           # 可以改成自己的 email
#
# u.password = "123456"                # 最少要六码
#
# u.password_confirmation = "123456"   # 最少要六码
#
# u.is_admin = true
# u.save

Echart.create!([
  {
   :number => "603605.SH",
   :stock_name => "珀莱雅",
   :stock_industry  => "日用化学品",
   :holders_change_q1  => -43.4,
   :top10_holders_change_q1  => 0.55,
   :net_profit_inc_3  => 8.27,
   :rev_inc_3  => 0.82,
   :ROE_last_FS  => 19.89,
   :sales_mg_q1  => 63.1,
   :sales_nmg_q1  => 13.9,
   :rev_inc_q1  => 10.93,
   :amount_of_inc  => 25.24
 },
 {
   :number  => "603665.SH",
   :stock_name  => "康隆达",
   :stock_industry  => "其他纺织",
   :holders_change_q1  => -38.35,
   :top10_holders_change_q1  => 3.1,
   :net_profit_inc_3  => 14.59,
   :rev_inc_3  => 6.71,
   :ROE_last_FS  => 11.13,
   :sales_mg_q1  => 25.18,
   :sales_nmg_q1  => 8.37,
   :rev_inc_q1  => 15.66,
   :amount_of_inc  => 2.21
 }
])
