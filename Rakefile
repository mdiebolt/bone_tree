task :default => [:build]

task :build do
  `middleman build`
  `gem build bone_tree.gemspec`
end

task :test do
  puts `bundle exec evergreen run`
end
