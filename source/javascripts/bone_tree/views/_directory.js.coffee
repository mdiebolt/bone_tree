#= require ../models/_nodes

BoneTree.namespace "BoneTree.Views", (Views) ->
  {Models} = BoneTree

  class Views.Directory extends BoneTree.View
    className: 'directory'
    tagName: 'ul'

    initialize: ->
      super

      @$el.attr('data-cid', @cid)

      @model.bind 'change:open', (model, open) =>
        @displayChildren(open)

      @model.bind 'change:name', (model, name) =>
        @settings.get('treeView').trigger 'rename', model, name

        @render()
        @settings.get('treeView').trigger 'sortOrderRender'

      @model.collection.bind 'add', =>
        @render()

      @model.collection.bind 'remove', (model, collection) =>
        @settings.get('treeView').trigger 'remove', model
        @render()

      @displayChildren(@model.get('open'))

    appendView: (node) =>
      view = @settings.get('treeView').findView(node)

      @$el.append view.render().$el

    render: =>
      @$el.text @model.get('name')

      @model.collection.each @appendView

      return @

    toggleOpen: (e) =>
      @model.toggleOpen()

    displayChildren: (open) =>
      fileDirChildren = @$el.children('.directory, .file')

      @$el.toggleClass('open', open)
      fileDirChildren.toggle(open)



