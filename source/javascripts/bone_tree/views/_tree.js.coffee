#= require ../_corelib
#= require ../_base64

#= require ../_namespace

#= require ../_github

#= require_tree ../models
#= require_tree ../views


BoneTree.namespace "BoneTree.Views", (Views) ->
  {Models} = BoneTree

  class Views.Tree extends Backbone.View
    className: 'tree'

    events:
      'contextmenu .file': '_contextMenu'
      'contextmenu .directory': '_contextMenu'
      'click .directory': '_openDirectory'
      'click .file': '_openFile'

    initialize: ->
      $(document).click @_closeMenu

      settingsConfig = _.extend({}, @options, {treeView: @})

      @settings = new Models.Settings(settingsConfig)

      @menuView = new Views.Menu
        settings: @settings
      @menuView.render().$el.appendTo $('body')

      @root = new Models.Directory {name: '/'}

      @root.collection.bind 'add', @render

      @root.collection.bind 'remove', (model, collection) =>
        @$("[data-cid='#{model.cid}']").remove()

        @render()

        @trigger 'remove', model

    add: (filePath, fileData) =>
      @root.add(filePath, fileData)

    addFromArray: (data) =>
      for file in data
        @add(file.path, file)

    findOrCreateView: (node) =>
      if node.isDirectory()
        type = 'Directory'
      else
        type = 'File'

      viewCache = @settings.get 'viewCache'

      unless view = viewCache[node.cid]
        view = viewCache[node.cid] = new Views[type]
          model: node
          settings: @settings

      return view

    _closeMenu: (e) =>
      @menuView.$el.hide() unless $(e.currentTarget).is('.menu')

      return @menuView

    # TODO new project for context menu
    _contextMenu: (e) =>
      e.preventDefault()

      model = @getViewFromClick(e)

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

    getViewByCid: (cid) =>
      viewCache = @settings.get 'viewCache'

      viewCache[cid]

    getViewFromClick: (e) =>
      e.stopPropagation()
      @menuView.$el.hide()

      cid = $(e.currentTarget).data('cid')

      return @getViewByCid(cid)

    _openDirectory: (e) =>
      e.stopPropagation()

      view = @getViewByCid($(e.currentTarget).data('cid'))

      view.toggleOpen()

    _openFile: (e) =>
      view = @getViewFromClick(e)

      # events are emitted by the filetree itself. This way API
      # consumers don't have to know anything about the internals.
      @trigger 'openFile', view.model

    render: =>
      @root.collection.each (node) =>
        view = @findOrCreateView(node)

        @$el.append view.render().$el

      return @
