BoneTree.namespace "BoneTree", (BoneTree) ->
  class BoneTree.View extends Backbone.View
    initialize: ->
      # @settings and @editor now backbone special too
      @settings = @options.settings
