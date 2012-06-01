#!/usr/bin/env rake
require "bundler/gem_tasks"

task :build => [:spec, :compile]

task :compile do
  `bundle exec middleman build`
end

task :default => [:build]

desc "Run jasmine specs"
task :spec do
  sh %[bundle exec jasmine-headless-webkit -cq]
end

