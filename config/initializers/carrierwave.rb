CarrierWave.configure do |config|
  if Rails.env.production?
    config.fog_provider = "fog"
    config.fog_credentials = {
      provider:              'AWS',
      aws_access_key_id:     ENV["AKIAIOE5M2ROO4P5PZDQ"],      # 你的 key


      aws_secret_access_key: ENV["yvwN2pv9fOa5/t7ibMRGb78dJlv7QZy4RpvWbdkM"],      # 你的 secret key


      region:                'ap-northeast-1' # 你的 S3 bucket 的 Region 位置


    }
    config.fog_directory  = ENV["alex-jdstore"] # 你设定的 bucket name



  else
    config.storage :file
  end
end
