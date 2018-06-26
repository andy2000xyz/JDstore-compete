Rails.application.routes.draw do
  devise_for :users

  namespace :admin do
    resources :blogs
    resources :categories

    resources :products
    resources :orders do
      member do
        post :cancel
        post :ship
        post :shipped
        post :return
     end
   end
  end

  resources :blogs do
    resources :comments, only: [:create, :destroy]
    collection do
      get :search
    end
  end


  resources :products do
    member do
      post :add_to_cart
    end
  end

  resources :cart_items

  resources :carts do
   collection do
      delete :clean
      post :checkout
    end
  end



  resources :orders do
    member do
      post :pay_with_alipay
      post :pay_with_wechat
      post :apply_to_cancel
    end
  end

  namespace :account do
    resources :orders
  end

  get "/echarts/chart-1" => "echarts#chart_1"
  get "/echarts/chart-2" => "echarts#chart_2"
  get "/echarts/chart-3" => "echarts#chart_3"
  get "/echarts/chart-4" => "echarts#chart_4"
  get "/echarts/chart-5" => "echarts#chart_5"


  root 'welcome#index'

end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
