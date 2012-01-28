window.require = (file) ->
  document.write "<script type='text/javascript' src='http://localhost:4567/javascripts/#{file}'><\/script>"

require '_jquery.min.js'
require '_underscore.js'
require '_backbone.js'
require '_sinon.js'
require '_jasmine-jquery.js'
require '_jasmine-sinon.js'

