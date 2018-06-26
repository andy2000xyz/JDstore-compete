class Api::V1::EchartsController < ApiController

 def index
   @echarts = Echart.all
   render :json => {
     :data => @echarts.map{ |echart|
       { :number => echart.number,
         :stock_name => echart.stock_name,
         :stock_industry  => echart.stock_industry,
         :holders_change_q1  => echart.holders_change_q1,
         :top10_holders_change_q1  => echart.top10_holders_change_q1,
         :net_profit_inc_3  => echart.net_profit_inc_3,

       }
     }
   }
 end

end
