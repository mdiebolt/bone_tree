#= require ../_namespace

#= require_tree ../models
#= require_tree ../views

BoneTree.namespace "BoneTree.Views", (Views) ->
  {Models} = BoneTree

  class Views.Tree extends Backbone.View
    className: 'tree'

    events:
      'contextmenu .file': 'contextMenu'
      'contextmenu .directory': 'contextMenu'
      'click .directory': 'openDirectory'
      'click .file': 'openFile'

    initialize: ->
      $(document).click @closeMenu

      @_currentFileData = null

      settingsConfig = _.extend({}, @options, {treeView: @})

      @settings = new Models.Settings(settingsConfig)

      @menuView = new Views.Menu
        settings: @settings
      @menuView.render().$el.appendTo $('body')

      @root = new Models.Node

      @root.collection.bind 'add', @render

      @root.collection.bind 'remove', (model, collection) =>
        @render()

        @trigger 'remove', model

    addFile: (filePath, fileData) =>
      @_currentFileData = fileData

      # remove first slash, if it exists, so we don't end up with a blank directory
      filePath = filePath.replace('/', '') if filePath[0] is '/'

      [dirs..., fileName] = filePath.split "/"

      @addToTree(@root, dirs, fileName)

    addFromJSON: (data, currentPath="") =>
      name = ""

      if data.name?
        name = data.name + '/'
        delete data.name

      if data.extension?
        name = name.replace('/', '.' + data.extension)
        delete data.extension

      currentPath += name

      if data.files?
        for file in data.files
          @addFromJSON(file, currentPath)
      else
        @addFile(currentPath, data) unless @beforeAddFilter(data)

    addToTree: (currentDirectory, remainingDirectories, fileName) =>
      if remainingDirectories.length
        nextDirectoryName = remainingDirectories.shift()

        if matchingDirectory = Models.Directory.find(currentDirectory, nextDirectoryName)
          matchingDirectory.set
            open: true

          @addToTree(matchingDirectory, remainingDirectories, fileName)
        else
          newNode = new Models.Directory {name: nextDirectoryName, open: true}

          newDirectory = currentDirectory.collection.add newNode
          @addToTree(newNode, remainingDirectories, fileName)
      else
        return if fileName is ""
        file = Models.File.createFromFileName(fileName, @_currentFileData)
        @_currentFileData = null

        currentDirectory.collection.add file

        if @settings.get('autoOpenFile')
          @trigger 'openFile', file

        return file

    beforeAddFilter: (fileData) ->
      true

    findOrCreateView: (node) =>
      type = node.constantize()
      viewCache = @settings.get 'viewCache'

      unless view = viewCache[node.cid]
        view = viewCache[node.cid] = new Views[type]
          model: node
          settings: @settings

      return view

    getModelByCid: (cid) =>
      viewCache = @settings.get 'viewCache'

      for modelCid, view of viewCache
        return view.model if modelCid is cid

    closeMenu: (e) =>
      @menuView.$el.hide() unless $(e.currentTarget).is('.menu')

    contextMenu: (e) =>
      e.preventDefault()
      e.stopPropagation()

      target = $(e.currentTarget)

      cid = target.data('cid')
      model = @getModelByCid(cid)

      @menuView.model = model

      @menuView.$el.css(
        left: e.pageX
        top: e.pageY
      ).show()

    flatten: (currentNode=@root, results=[]) =>
      currentNode.collection.each (node) =>
        results.push node

        @flatten(node, results) if node.collection.length

      return results

    getDirectory: (directoryName) =>
      _.filter @flatten(), (node) =>
        node.get('nodeType') is 'directory' and node.get('name') is directoryName

    getFile: (fileName) =>
      _.filter @flatten(), (node) =>
        node.get('nodeType') is 'file' and node.get('name') is fileName

    # TODO get files within a directory
    getFiles: (directoryName) =>
      [directory] = @getDirectory(directoryName)

      nodesInDirectory = @flatten(directory)

      return _.filter nodesInDirectory, (node) ->
        node.get('nodeType') is 'file'

    toAscii: (collection, indentation=0, output="\n") =>
      rootCollection = collection || @root.collection

      spaces = ""

      for n in [0..indentation]
        spaces += " "

      rootCollection.each (nodes) =>
        typeChar = if nodes.get('type') is 'directory' then '+' else '-'

        output += (spaces + typeChar + nodes.nameWithExtension() + '\n')

        output = @toAscii(nodes.collection, indentation + 1, output)

      return output

    openDirectory: (e) =>
      e.stopPropagation()
      @menuView.$el.hide()

      cid = $(e.currentTarget).data('cid')
      model = @getModelByCid(cid)

      model.toggleOpen()

    openFile: (e) =>
      e.stopPropagation()
      @menuView.$el.hide()

      cid = $(e.currentTarget).data('cid')
      model = @getModelByCid(cid)

      # events are emitted by the filetree itself. This way API
      # consumers don't have to know anything about the internals.
      @trigger 'openFile', model

    render: =>
      @root.collection.sort()
      @root.collection.each (node) =>
        node.collection.sort()
        view = @findOrCreateView(node)

        @$el.append view.render().$el

      return @

