require "bone_tree/version"

# Sneaky require for Rails engine environment
if defined? ::Rails::Engine
  require "bone_tree/rails"
elsif defined? ::Sprockets
  require "bone_tree/sprockets"
end

module BoneTree

end
