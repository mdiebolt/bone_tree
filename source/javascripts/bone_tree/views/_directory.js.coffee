#= require ../models/_nodes

BoneTree.namespace "BoneTree.Views", (Views) ->
  {Models} = BoneTree

  class Views.Directory extends BoneTree.View
    className: 'directory'
    tagName: 'ul'

    initialize: ->
      super

      @el.attr('data-cid', @cid)

      @model.bind 'change:open', (model, open) =>
        @toggleSubfolders(open)

      @model.bind 'change:name', (model, name) =>
        @settings.get('treeView').trigger 'rename', model, name
        @settings.get('treeView').render()

      @model.collection.bind 'add', =>
        @settings.get('treeView').render()

      @model.collection.bind 'remove', (model, collection) =>
        @settings.get('treeView').trigger 'remove', model
        @settings.get('treeView').render()

    appendView: (node) =>
      view = @settings.get('treeView').findView(node)

      @model.set {open: true}

      @el.append view.render().el

    render: =>
      @el.text @model.get('name')

      @model.collection.each @appendView

      return @

    toggleOpen: (e) =>
      @model.toggleOpen()

    toggleSubfolders: (open) =>
      fileDirChildren = @el.children('.directory, .file')

      @el.toggleClass('open', open)
      fileDirChildren.toggle(open)



