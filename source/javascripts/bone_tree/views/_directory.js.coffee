BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.Directory extends Backbone.View
    className: 'directory'
    tagName: 'ul'

    initialize: (options) ->
      @tree = options.tree

      @$el.attr 'data-cid', @model.cid

      @open = false

      @model.bind 'change', (model) =>
        @tree.render().trigger 'rename', model, name

        previousPath = model.previous('path')

        if (path = model.get('path')).indexOf('/') is 0
          newPath = path.replace('/', '')
        else
          newPath = path

        model.updateChildren(previousPath, newPath)

      @model.collection.bind 'add', @render

      @model.collection.bind 'remove', (model, collection) =>
        @tree.trigger 'remove', model
        @render()

      @displayChildren(@open)

    appendView: (node) =>
      view = @tree.findOrCreateView(node)

      @$el.append view.render().$el

    render: =>
      @$el.text @model.name()

      @model.collection.each @appendView

      @displayChildren(@$el.hasClass('open'))

      return @

    displayChildren: (open) =>
      fileDirChildren = @$el.children('.directory, .file')

      @$el.toggleClass('open', open)
      fileDirChildren.toggle(open)

    toggleOpen: =>
      @open = not @open

      @displayChildren(@open)
