# -*- encoding: utf-8 -*-
require File.expand_path('../lib/bone_tree/version', __FILE__)

Gem::Specification.new do |gem|
  gem.name        = "bone_tree"
  gem.version     = BoneTree::VERSION
  gem.authors     = ["Matt Diebolt"]
  gem.email       = ["mdiebolt@gmail.com"]
  gem.homepage    = "http://mdiebolt.github.com/bone_tree"
  gem.summary     = "A backbone filetree widget"
  gem.description = "This is a filetree, written with Backbone. It is meant to be tree that will update your file nodes live and sort them when the node state is changed."

  gem.rubyforge_project = "bone_tree"

  gem.files         = `git ls-files`.split("\n")
  gem.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  gem.require_paths = ["lib"]

  gem.add_dependency 'jquery-source'
  gem.add_dependency 'cornerstone-source'
  gem.add_dependency 'underscore-source'

  %w[
    jasmine-spec-extras
    rake
    rb-fsevent
    therubyracer
    rack-codehighlighter
    haml-coderay
    coffee-filter
    jasmine
  ].each do |gem_name|
    gem.add_development_dependency gem_name
  end
end
