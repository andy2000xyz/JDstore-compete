class Product < ApplicationRecord
  mount_uploader :image, ImageUploader
  has_many :photos
  has_many :likes, :dependent => :destroy
  has_many :liked_users, :through => :likes, :source => :user
  belongs_to :user
  def find_like(user)
    self.likes.where( :user_id => user.id ).first
  end

  accepts_nested_attributes_for :photos
end
