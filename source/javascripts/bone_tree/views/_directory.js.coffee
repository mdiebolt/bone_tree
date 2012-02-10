BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.Directory extends Backbone.View
    className: 'directory'
    tagName: 'ul'

    initialize: (options) ->
      @settings = options.settings

      @$el.attr('data-cid', @model.cid)

      @model.bind 'change:open', (model, open) =>
        @displayChildren(open)

      @model.bind 'change:name', (model, name) =>
        treeView = @settings.get 'treeView'
        treeView.render().trigger 'rename', model, name

      @model.collection.bind 'add', @render

      @model.collection.bind 'remove', (model, collection) =>
        @settings.get('treeView').trigger 'remove', model
        @render()

      @displayChildren(@model.get('open'))

    appendView: (node) =>
      view = @settings.get('treeView').findOrCreateView(node)

      @$el.append view.render().$el

    render: =>
      @$el.text @model.get('name')

      @model.collection.sort().each @appendView

      return @

    displayChildren: (open) =>
      fileDirChildren = @$el.children('.directory, .file')

      @$el.toggleClass('open', open)
      fileDirChildren.toggle(open)

