require 'fileutils'
include FileUtils

task :default => [:build]

task :build => [:spec] do
  `middleman build`

  `cp build/javascripts/bone_tree.js lib/assets/javascripts/bone_tree.js`
  `gem build bone_tree.gemspec`
  `git commit -am 'building static assets and gem'`
  `git push origin master`
end

desc "Run jasmine specs"
task :spec do
  sh %[bundle exec jasmine-headless-webkit -cq]
end

