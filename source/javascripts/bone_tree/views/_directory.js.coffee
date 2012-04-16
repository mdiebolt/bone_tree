BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.Directory extends Backbone.View
    ###
    Internal: View that renders a Directory node and controls its behavior (class: 'directory', tag: 'ul').

    ###
    className: 'directory'
    tagName: 'ul'

    initialize: (options) ->
      ###
      Internal: Initialize a new directory node. Adds associated model cid to the
                view element. Binds change handler to the `change:open` event that
                toggles the display of directory contents. Binds change handler to
                the `change:name` event that re-renders a sorted file tree.

      * options - Passes in settings object, which is used for access to the
                  tree view root in order to proxy events to it.

      ###
      @settings = options.settings

      @$el.attr 'data-cid', @model.cid

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
      ###
      Internal: Appends a view based on the underlying node model to this view.

      node - A Node model. Either a File or a Directory. This is the model the
             created view will be associated with.

      ###
      view = @settings.get('treeView').findOrCreateView(node)

      @$el.append view.render().$el

    render: =>
      ###
      Internal: Set the text of the view element based on the underlying model name.

      Returns `this` view.
      ###
      @$el.text @model.get('name')

      @model.collection.sort().each @appendView

      return @

    displayChildren: (open) =>
      ###
      Internal: Toggles display of the children Files or Diretories of this view.

      ###
      fileDirChildren = @$el.children('.directory, .file')

      @$el.toggleClass('open', open)
      fileDirChildren.toggle(open)

