#= require ../_namespace

#= require_tree ../models
#= require_tree ../views

BoneTree.namespace "BoneTree.Views", (Views) ->
  {Models} = BoneTree

  class Views.Tree extends Backbone.View
    className: 'tree'

    events:
      'contextmenu .file': '_contextMenu'
      'contextmenu .directory': '_contextMenu'
      'mousedown .directory': '_openDirectory'
      'mousedown .file': '_openFile'

    initialize: ->
      $(document).click @_closeMenu

      @viewCache = {}

      @settings = new Models.Settings(@options)

      @menuView = new Views.Menu
        settings: @settings
      @menuView.render().$el.appendTo $('body')

      @root = new Models.Directory {path: '/'}

      @root.collection.bind 'add', @render

      @root.collection.bind 'remove', (model, collection) =>
        @$("[data-cid='#{model.cid}']").remove()

        @render()

        @trigger 'remove', model

    add: (filePath, fileData) =>
      if Object.isArray(filePath)
        @add(file.path, file) for file in filePath
      else
        @root.add(filePath, fileData)

    remove: (path) =>
      @root.remove(path)

    findOrCreateView: (node) =>
      if node.isDirectory()
        type = 'Directory'
      else
        type = 'File'

      unless view = @viewCache[node.cid]
        view = @viewCache[node.cid] = new Views[type]
          model: node
          settings: @settings
          tree: @

      return view

    _closeMenu: (e) =>
      @menuView.$el.hide() unless $(e.currentTarget).is('.menu')

      return @menuView

    # TODO new project for context menu
    _contextMenu: (e) =>
      e.preventDefault()

      model = @getViewFromClick(e).model

      @menuView.model = model

      @menuView.$el.css(
        left: e.pageX
        top: e.pageY
      ).show()

      return @menuView

    toArray: =>
      @root.toArray()

    getDirectory: (directoryPath) =>
      @root.getDirectory(directoryPath)

    getFile: (filePath) =>
      @root.getFile(filePath)

    toAscii: =>
      '\n' + @root.toAscii()

    getViewFromClick: (e) =>
      e.stopPropagation()
      @menuView.$el.hide()

      cid = $(e.currentTarget).data('cid')

      return @viewCache[cid]

    _openDirectory: (e) =>
      e.stopPropagation()

      view = @getViewFromClick(e)

      view.toggleOpen()

    _openFile: (e) =>
      view = @getViewFromClick(e)

      @trigger 'openFile', view.model

    render: =>
      @root.collection.each (node) =>
        view = @findOrCreateView(node)

        @$el.append view.render().$el

      return @
