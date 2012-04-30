#= require ../_namespace

#= require_tree ../models
#= require_tree ../views

BoneTree.namespace "BoneTree.Views", (Views) ->
  {Models} = BoneTree

  class Views.Tree extends Backbone.View
    ###
    Public: The base tree object. Events from other objects are proxied to the tree
            so API consumers only need to know about this top level object.

    ###
    className: 'tree'

    events:
      'contextmenu .file': '_contextMenu'
      'contextmenu .directory': '_contextMenu'
      'click .directory': '_openDirectory'
      'click .file': '_openFile'

    initialize: ->
      ###
      Public: Initialize a new filetree widget

      * options          - An Object of global configuration options for the file tree.
        * confirmDeletes - A Boolean. If true, the tree will prompt the user, making
                           sure they want to delete the file (default: false).
        * showExtensions - A Boolean. If true, files display their extensions. Internally,
                           extensions are always kept track of but by default they are
                           hidden (default: false).

      ###
      $(document).click @_closeMenu

      @_currentFileData = null

      settingsConfig = _.extend({}, @options, {treeView: @})

      @settings = new Models.Settings(settingsConfig)

      @menuView = new Views.Menu
        settings: @settings
      @menuView.render().$el.appendTo $('body')

      @root = new Models.Node

      @root.collection.bind 'add', @render

      @root.collection.bind 'remove', (model, collection) =>
        @$("[data-cid='#{model.cid}']").remove()

        @render()

        @trigger 'remove', model

    file: (filePath, fileData) =>
      filePath = filePath.replace('/', '') if filePath[0] is '/'

      if fileData?
        @_currentFileData = _.extend(fileData, path: filePath)

        @_currentFileData.autoOpen = true unless @_currentFileData.autoOpen?
        @_currentFileData.hidden = false unless @_currentFileData.hidden?
      else
        return @_getFile(filePath)

      [dirs..., fileName] = filePath.split '/'

      if file = @_getFile(filePath)
        file.set(@_currentFileData)
      else
        @addToTree(@root, dirs, fileName)

    addFromJSON: (data, currentPath="") =>
      ###
      Public: Creates a file tree from a JSON representation. Expects the
              JSON object to have a `name` property at each level, specifying
              the name of the file or directory, and a files array if the
              current node has child directories or files.

      * data        - An Object that represents hierarchical file data.

      * currentPath - A String representing the current location in the tree.
                      Defaults to the file tree root. (default: "")

      Examples

          data = {
            name: "My Project"
            files: [
              { name: "Empty Folder" }
              { name: "SomeFile.coffee" }
              { name: "AnotherFile.coffee" }
              {
                name: "Folder with Files inside"
                files: [
                  { name: "NestedFile.coffee" }
                ]
              }
            ]
          }

          tree.addFromJSON(data)
          # => <Tree>

      Returns the Tree view object.
      ###
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
        @file(currentPath, data)

      return @

    addToTree: (currentDirectory, remainingDirectories, fileName) =>
      ###
      Internal: Recursive method that traverses nodes, creating
                Files and Directories.

      * currentDirectory     - A Node object representing which directory we are
                               adding the current Directory or File to.
      * remainingDirectories - A '/' separated String representing the remaining
                               directories to add.
      * fileName             - The String name of the file to be added. This can
                               include the extension name separated by a '.'.

      Examples

          tree.addToTree(@root, '/source/subdirectory/', 'main.coffee')
          # => <File>

      Returns the File object if it was created and null if no file was given.
      ###
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
        return null if fileName is ""

        file = Models.File.createFromFileName(fileName, @_currentFileData)
        @_currentFileData = null

        currentDirectory.collection.add file

        if file.get('autoOpen')
          @trigger 'openFile', file

        return file

    findOrCreateView: (node) =>
      ###
      Internal: Look up existing view in the view cache or Create a new view
                of the correct type (either File or Directory).

      * node - A Node object. Either a File object or a Directory object.
               This is the model that the view will be associated with.

      Examples

          file = new BoneTree.Models.File

          # This will create a new view since we just created the File
          tree.findOrCreateView(file)
          # => <FileView>

      Returns the view corresponding to the model passed in.
      ###
      type = node.constantize()
      viewCache = @settings.get 'viewCache'

      unless view = viewCache[node.cid]
        view = viewCache[node.cid] = new Views[type]
          model: node
          settings: @settings

      return view

    # TODO this seems unneeded and backward. I shouldn't need to look up
    # a model from the view cache. I should be able to just find it in
    # the collection.
    getModelByCid: (cid) =>
      viewCache = @settings.get 'viewCache'

      for modelCid, view of viewCache
        return view.model if modelCid is cid

    closeDirectories: =>
      ###
      Public: Close all the directories in the file tree.

      Examples

          tree.closeDirectories()
          # => <Tree>

      Returns the Tree view object.
      ###
      directories = _.filter(@flatten(), (node) ->
        node.get('nodeType') is 'directory'
      )

      _.invoke(directories, 'set', {open: false})

      return @

    _closeMenu: (e) =>
      ###
      Internal: Close the context menu. This is called every click on
                the document and closes the menu unless you are clicking
                within it. This shouldn't be called directly, it is called
                automatically by Backbone from user interactions.

      Returns the Menu view object.
      ###
      @menuView.$el.hide() unless $(e.currentTarget).is('.menu')

      return @menuView

    _contextMenu: (e) =>
      ###
      Internal: Open the context menu. This prevents the default browser
                context menu event. This shouldn't be called directly, it is
                called automatically by Backbone from user interations.

      Returns the Menu view object.
      ###
      e.preventDefault()

      model = @getModelFromClick(e)

      @menuView.model = model

      @menuView.$el.css(
        left: e.pageX
        top: e.pageY
      ).show()

      return @menuView

    filterNodes: (nodeType, nodeName) =>
      ###
      Internal: Returns file tree nodes that match the nodeType and nodeName.

      * nodeType - A String that represents the nodeType to match. Choices are
                   'file' or 'directory'.
      * nodeName - A String that represents the name of the node to match.

      Examples

          # Add some files to the tree
          tree.file('/source/main.coffee')
          tree.file('/source/player.coffee')

          # returns an array containing the File 'main.coffee'
          tree.filterNodes('file', 'main')
          # => [<File>]

      Returns an Array of nodes that match the filter criteria.
      ###
      results = _.filter @flatten(), (node) =>
        node.get('nodeType') is nodeType and node.get('name') is nodeName

      return results

    flatten: (currentNode=@root, results=[]) =>
      ###
      Internal: Returns a one dimensional ordered array representing the
                Directory and File nodes in the tree.

      * currentNode - The node to start at when flattening
      * nodeName - A String that represents the name of the node to match.

      Examples

          # Add some files to the tree
          tree.file('/source/main.coffee', {aFile: true})
          tree.file('/source/player.coffee', {playerData: {x: 50, y: 30}})

          # returns an array containing the File 'main.coffee'
          tree.filterNodes('file', 'main')
          # => [<File>]

      Returns an Array of nodes that match the filter criteria.
      ###
      currentNode.collection.each (node) =>
        results.push node

        @flatten(node, results) if node.collection.length

      return results

    getDirectory: (directoryName) =>
      ###
      Public: Returns an array of directories matching the given directoryName.

      * directoryName - A String naming the directory to match.

      Examples

          # Add some files to the tree
          tree.file('/source/main.coffee', {size: 4039})
          tree.file('/source/player.coffee', {size: 399})
          tree.file('/directory2/file.coffee', {size: 23})

          # returns an array containing the Directory 'source'
          tree.getDirectory('source')
          # => [<Directory>]

      Returns an Array of Directory nodes that match directoryName.
      ###
      @filterNodes('directory', directoryName)

    _getFile: (filePath) =>
      ###
      Internal: Returns a file at the specified location.

      * fileName - A String describing the file path.

      Examples

          # Add some files to the tree
          tree.file('/source/main.coffee', {size: 30459})
          tree.file('/source/player.coffee', {size: 943})
          tree.file('/directory2/main.coffee', {size: 4945})

          # returns an array containing both the files named main.
          tree._getFile('source/main.coffee')
          # => <File>

      Returns a File at the given location.
      ###

      filePath = filePath.replace('/', '') if filePath[0] is '/'

      nodes = @flatten()

      filtered = _.filter(nodes, (node) ->
        return node.get('nodeType') is 'file' and node.get('path') is filePath
      )

      return filtered[0]

    files: (directoryName) =>
      ###
      Public: Returns an array of files contained within the directory
              matching directoryName.

      * directoryName - A String naming the directory to look inside.

      Examples

          # Add some files to the tree
          tree.file('/source/main.coffee', {main: true})
          tree.file('/source/player.coffee', {active: true})
          tree.file('/directory2/main.coffee', {active: true})

          # returns an array containing the files 'player.coffee' and 'main.coffee'
          tree.files('source')
          # => [<File>, <File>]

      Returns an Array of File nodes that are contained in the
      Directory matching directoryName.
      ###

      # return all files if no directory is provided
      unless directoryName?
        return _.filter(@flatten(), (node) ->
          return node.get('nodeType') is 'file'
        )

      directory = @getDirectory(directoryName)[0]

      # short circuit if directory name isn't in the tree
      # Otherwise flatten will return all the files in
      # the filetree
      return [] unless directory

      nodesInDirectory = @flatten(directory)

      return _.filter nodesInDirectory, (node) ->
        node.get('nodeType') is 'file'

    toAscii: (collection, indentation=0, output="\n") =>
      ###
      Internal: A String representation of the filetree.

      * collection  - A NodeCollection object describing which folder to start at.
      * indentation - A Number describing how many spaces to indent the next filetree element (default: 0).
      * output      - A String representing the current filetree output (default: "\n").

      Examples

          # Add some files to the tree
          tree.file('/source/main.coffee', {main: true})
          tree.file('/source/player.coffee', {active: true})
          tree.file('/directory2/main.coffee', {active: false})

          tree.toAscii()
          # => "
            -directory2
             -main.coffee
            -source
             -main.coffee
             -player.coffee
          "

      Returns a String representation of the sorted nodes of the file tree.
      ###
      rootCollection = collection || @root.collection

      spaces = ""

      for n in [0..indentation]
        spaces += " "

      rootCollection.each (nodes) =>
        typeChar = if nodes.get('type') is 'directory' then '+' else '-'

        output += (spaces + typeChar + nodes.nameWithExtension() + '\n')

        output = @toAscii(nodes.collection, indentation + 1, output)

      return output

    getModelFromClick: (e) =>
      ###
      Internal: Look up a model based on the cid of the clicked view element.

      Returns the Node corresponding to the view element that the user clicked on.
      ###
      e.stopPropagation()
      @menuView.$el.hide()

      cid = $(e.currentTarget).data('cid')

      return @getModelByCid(cid)

    _openDirectory: (e) =>
      ###
      Internal: Toggle the directory icon and display the contents of the clicked Directory.

      ###
      model = @getModelFromClick(e)

      model.toggleOpen()

    _openFile: (e) =>
      ###
      Internal: Trigger the 'openFile' event, passing in the file corresponding
                to the view element that the user clicked.

      ###
      model = @getModelFromClick(e)

      # events are emitted by the filetree itself. This way API
      # consumers don't have to know anything about the internals.
      @trigger 'openFile', model

    render: =>
      ###
      Internal: Call render on each of the nodes underneath the root node.
                Also calls sort on each of the subcollections.


      ###
      @root.collection.sort().each (node) =>
        node.collection.sort()
        view = @findOrCreateView(node)

        @$el.append view.render().$el unless view.model.get('hidden')

      return @

