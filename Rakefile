require 'fileutils'
include FileUtils

task :default => [:build]

task :build => [:spec] do
  `middleman build`

  `cp build/javascripts/bone_tree.js lib/assets/javascripts/bone_tree.js`
  `gem build bone_tree.gemspec`
end

desc "Run jasmine specs"
task :spec do
  sh %[bundle exec jasmine-headless-webkit -cq]
end

