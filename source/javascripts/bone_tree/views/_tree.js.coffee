#= require ../_namespace
#= require ./_base

#= require_tree ../models
#= require_tree ../views

BoneTree.namespace "BoneTree.Views", (Views) ->
  {Models} = BoneTree

  class Views.Tree extends BoneTree.View
    className: 'tree'

    events:
      'contextmenu .file': 'contextMenu'
      'contextmenu .directory': 'contextMenu'
      'click .directory': 'openDirectory'
      'click .file': 'openFile'

    initialize: ->
      super

      $(document).click (e) =>
        @closeMenu(e)

      @settings = new Models.Settings
        treeView: @

      @menuView = new Views.Menu
        settings: @settings
      @menuView.render().el.appendTo @el

      @root = new Models.Node

      @root.collection.bind 'add', @render

      @root.collection.bind 'remove', (model, collection) =>
        @settings.get('treeView').trigger 'remove', model

        @render()

    addFile: (filePath) =>
      # remove first slash, if it exists, so we don't end up with a blank directory
      filePath = filePath.replace('/', '') if filePath[0] == '/'

      [dirs..., fileName] = filePath.split "/"

      @addToTree(@root, dirs, fileName)

    addToTree: (currentDirectory, remainingDirectories, fileName) =>
      if remainingDirectories.length
        nextDirectoryName = remainingDirectories.shift()

        if matchingDirectory = (currentDirectory.collection.find (dir) -> dir.get('name') == nextDirectoryName)
          @addToTree(matchingDirectory, remainingDirectories, fileName)
        else
          newNode = new Models.Directory {name: nextDirectoryName}

          newDirectory = currentDirectory.collection.add newNode
          @addToTree(newNode, remainingDirectories, fileName)
      else
        return if fileName is ""
        [name, extension] = fileName.split "."

        currentDirectory.collection.add new Models.File
          name: name
          extension: extension

    findView: (node) =>
      type = node.constantize()
      viewCache = @settings.get 'viewCache'

      unless view = viewCache[node.cid]
        view = viewCache[node.cid] = new Views[type]
          model: node
          settings: @settings

      return view

    appendNode: (node) =>
      view = @findView node

      @el.append view.render().el

    cacheFindByViewCid: (cid) ->
      viewCache = @settings.get 'viewCache'

      for key, value of viewCache
        return value if cid == value.cid

    closeMenu: (e) =>
      @menuView.el.hide() unless $(e.currentTarget).is('.menu')

    contextMenu: (e) =>
      e.preventDefault()
      e.stopPropagation()

      cid = $(e.currentTarget).data('cid')

      view = @cacheFindByViewCid(cid)

      @menuView.model = view.model

      @menuView.el.css(
        left: e.pageX
        top: e.pageY
      ).show()

    toAscii: (collection, node, indentation=0, output="\n") =>
      rootCollection = collection || @root.collection
      prevNode = node || @root

      spaces = ""

      indentation.times ->
        spaces += " "

      rootCollection.each (nodes) =>
        typeChar = if nodes.get('type') is 'directory' then '+' else '-'

        output += (spaces + typeChar + nodes.nameWithExtension() + '\n')

        output = @toAscii(nodes.collection, nodes, indentation + 1, output)

      return output

    openDirectory: (e) =>
      e.stopPropagation()
      @menuView.el.hide()

      cid = $(e.currentTarget).data('cid')

      view = @cacheFindByViewCid(cid)

      view.toggleOpen()

    openFile: (e) =>
      e.stopPropagation()
      @menuView.el.hide()

      cid = $(e.currentTarget).data('cid')

      view = @cacheFindByViewCid(cid)

      # events are emitted by the filetree itself. This way API
      # consumers don't have to know anything about the internals.
      @trigger 'openFile', view.model

    render: =>
      @$('.directory, .file').remove()

      @root.collection.each @appendNode


