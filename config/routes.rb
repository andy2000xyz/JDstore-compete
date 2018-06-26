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

  get "echarts/echart-1" => "echarts#echart_1"
  get "echarts/echart-2" => "echarts#echart_2"
  get "echarts/echart-3" => "echarts#echart_3"
  get "echarts/echart-4" => "echarts#echart_4"
  get "echarts/echart-5" => "echarts#echart_5"

  root 'welcome#index'
end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
