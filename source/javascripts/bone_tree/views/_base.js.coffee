BoneTree.namespace "BoneTree", (BoneTree) ->
  class BoneTree.View extends Backbone.View
    initialize: ->
      # Force jQuery Element
      @el = $(@el)

      # @settings and @editor now backbone special too
      @settings = @options.settings
      @editor = @options.editor

