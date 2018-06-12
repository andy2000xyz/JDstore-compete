class Blog < ApplicationRecord
  include RankedModel
  ranks :row_order
end
