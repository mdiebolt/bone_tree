BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.File extends Backbone.View
    className: 'file'
    tagName: 'li'

    initialize: (options) ->
      @settings = options.settings
      @tree = options.tree

      @$el.attr('data-cid', @model.cid)

      @model.bind 'change', (model, name) =>
        @$el.removeClass(model.previous('name').extension())

        @tree.render().trigger 'rename', model, model.get('name')

    render: =>
      name = @model.get('name')

      extension = name.extension()

      @$el.addClass(extension)

      if @settings.get('showExtensions')
        @$el.text name
      else
        @$el.text name.withoutExtension()

      return @
