require 'test_helper'

class StaticPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get blog" do
    get static_pages_blog_url
    assert_response :success
  end

  test "should get echart" do
    get static_pages_echart_url
    assert_response :success
  end
end
