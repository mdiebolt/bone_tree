root_dir = File.expand_path(File.dirname(File.dirname(File.dirname(__FILE__))))
Sprockets.paths << File.join(root_dir, "vendor", "assets")
Sprockets.paths << File.join(root_dir, "lib", "assets")
