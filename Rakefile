#!/usr/bin/env rake
require "bundler/gem_tasks"

task :build => [:compile]

task :compile do
  `middleman build`
end

task :default => [:spec, :build]

desc "Run jasmine specs"
task :spec do
  sh %[bundle exec jasmine-headless-webkit -cq]
end

