namespace :dev do
  task :fake => :environment do
    users = []
    10.times do
      users << User.create!( :email => Faker::Internet.email, :password => "12345678")
    end

    10.times do |i|
      blog = Blog.create!(:title => "test",
                          :content => Faker::Lorem.paragraph,
                          :author => "李剑" )
    end
  end
 end
