class Blog < ApplicationRecord
  # include RankedModel
  # ranks :row_order

  validates :title, presence: true, length: { minimum: 3 }
  has_many :comments, dependent: :destroy

  def previous_blog
    previous_blogs = Blog.where [ 'created_at < ?', self.created_at ]
    previous_blog = previous_blogs.all.order('created_at DESC').first

    previous_blog.nil? ? Blog.all.order('created_at DESC').first : previous_blog
  end

  def next_blog
    next_blogs = Blog.where [ 'created_at > ?', self.created_at ]
    next_blog = next_blogs.all.order('created_at ASC').first

    next_blog.nil? ? Blog.all.order('created_at ASC').first : next_blog
  end
end
