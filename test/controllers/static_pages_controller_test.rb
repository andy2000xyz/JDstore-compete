require 'test_helper'

class StaticPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get blog" do
    get static_pages_home_url
    assert_response :success
  end

  test "should get echart" do
    get static_pages_help_url
    assert_response :success
  end
end
