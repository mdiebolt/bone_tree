BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.File extends Backbone.View
    tagName: 'li'

    initialize: (options) ->
      @settings = options.settings
      @tree = options.tree

      @model.bind 'change:path', (model) =>
        @render()

    render: =>
      name = @model.name()

      extension = name.extension()

      @$el.attr('data-cid', @model.cid)
      @$el.attr('class', "file #{extension}")

      if @settings.get('showExtensions')
        @$el.text name
      else
        @$el.text name.withoutExtension()

      return @
