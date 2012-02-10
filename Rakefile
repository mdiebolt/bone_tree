require 'fileutils'
include FileUtils

task :default => [:build]

task :build do
  # Remove all but .git from build directory
  rm_r Dir.glob("build/*")

  # Build static assets
  `middleman build`

  `cp -r app/assets/* build/`
  `gem build bone_tree.gemspec`
end

task :test do
  puts `bundle exec evergreen run`
end
