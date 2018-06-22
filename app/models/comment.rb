class Comment < ApplicationRecord

  validates :commenter, presence: true
  validates :body, presence: true

  belongs_to :blog

  scope :ordered_by_creation, -> { order("created_at DESC")}
end
