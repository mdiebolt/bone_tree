BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.File extends Backbone.View
    className: 'file'
    tagName: 'li'

    initialize: (options) ->
      @settings = options.settings
      @tree = options.tree

      @$el.attr('data-cid', @model.cid)

      @model.bind 'change:path', (model) =>
        @$el.removeClass(model.previous('path').split('/').last().extension())

        @tree.render().trigger 'rename', model, model.name()

    render: =>
      name = @model.name()

      extension = name.extension()

      @$el.addClass(extension)

      if @settings.get('showExtensions')
        @$el.text name
      else
        @$el.text name.withoutExtension()

      return @
