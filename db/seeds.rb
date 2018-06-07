# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

u = User.new
u.email = "admin@test.com"           # 可以改成自己的 email

u.password = "123456"                # 最少要六码

u.password_confirmation = "123456"   # 最少要六码

u.is_admin = true
u.save


products = [{title:"Power BI 实战",
	        description: "用Power BI解决商业问题.",
	        image_path: "#{Rails.root}/public/images/datalab-1.jpg"},

					{title:"Power BI 实战",
	        description: "用Power BI解决商业问题.",
	        image_path: "#{Rails.root}/public/images/datalab-2.jpg"},

					{title:"Power BI 实战",
	        description: "用Power BI解决商业问题.",
	        image_path: "#{Rails.root}/public/images/datalab-3.jpg"},

					{title:"Power BI 实战",
	        description: "用Power BI解决商业问题.",
	        image_path: "#{Rails.root}/public/images/datalab-4.jpg"},

					{title:"Power BI 实战",
	        description: "用Power BI解决商业问题.",
	        image_path: "#{Rails.root}/public/images/datalab-5.jpg"},

					{title:"Power BI 实战",
	        description: "用Power BI解决商业问题.",
	        image_path: "#{Rails.root}/public/images/datalab-6.jpg"}]



p1 = Product.create([title:products[0][:title],description:products[0][:description],quantity:20,price:12000,image:open(products[0][:image_path])])
p2 = Product.create([title:products[1][:title],description:products[1][:description],quantity:20,price:10000,image:open(products[1][:image_path])])
p3 = Product.create([title:products[2][:title],description:products[2][:description],quantity:20,price:8000,image:open(products[2][:image_path])])
p4 = Product.create([title:products[3][:title],description:products[3][:description],quantity:20,price:15000,image:open(products[3][:image_path])])
p5 = Product.create([title:products[4][:title],description:products[4][:description],quantity:20,price:24000,image:open(products[4][:image_path])])
p6 = Product.create([title:products[5][:title],description:products[5][:description],quantity:20,price:18000,image:open(products[5][:image_path])])


puts "create products"
