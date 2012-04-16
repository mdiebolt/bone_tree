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
      'contextmenu .file': 'contextMenu'
      'contextmenu .directory': 'contextMenu'
      'click .directory': 'openDirectory'
      'click .file': 'openFile'

    initialize: ->
      ###
      Public: Initialize a new filetree widget

      * options          - An Object of global configuration options for the file tree.
        * autoOpenFiles  - A Boolean. If true, each file that is added to the tree
                           immediately triggers an `openFile` event (default: true).
        * beforeAdd      - A Function that is invoked before each file is added to the tree.
                           It is passed the raw file attributes and should return true if
                           that file should be added to the tree and false if not. The
                           default implementation is to return true.
        * confirmDeletes - A Boolean. If true, the tree will prompt the user, making
                           sure they want to delete the file (default: false).
        * showExtensions - A Boolean. If true, files display their extensions. Internally,
                           extensions are always kept track of but by default they are
                           hidden (default: false).

      ###
      $(document).click @closeMenu

      @_currentFileData = null

      if @options.beforeAdd?
        @beforeAdd = @options.beforeAdd

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

    addFile: (filePath, fileData={}, triggerAutoOpen=true) =>
      ###
      Public: Method to add files and associated file data to the tree.

      * filePath - A String that represents the directory path to the file.
                   Directories that don't yet exist will be created. If no
                   file is specified, eg. '/dir1/dir2/' then only the directories
                   will be created and this method will return null.
      * fileData - An Object of attributes to store in the File object. This
                   could represent information such as lastModified, fileContents,
                   fileCreator, etc.

      Examples

          tree.addFile '/source/main.coffee',
            contents: "alert('hello world.')"
            lastModified: 1330725130170
          # => <File>

      Returns the File object if it was created and null if no file was given.
      ###

      # remove first slash, if it exists, so we don't end up with a blank directory
      filePath = filePath.replace('/', '') if filePath[0] is '/'

      @_currentFileData = _.extend(fileData, _path: filePath)

      [dirs..., fileName] = filePath.split "/"

      @addToTree(@root, dirs, fileName, triggerAutoOpen)

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
        @addFile(currentPath, data)

      return @

    addToTree: (currentDirectory, remainingDirectories, fileName, triggerAutoOpen=true) =>
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

          @addToTree(matchingDirectory, remainingDirectories, fileName, triggerAutoOpen)
        else
          newNode = new Models.Directory {name: nextDirectoryName, open: true}

          newDirectory = currentDirectory.collection.add newNode
          @addToTree(newNode, remainingDirectories, fileName, triggerAutoOpen)
      else
        return null if fileName is ""

        if @beforeAdd(@_currentFileData)
          file = Models.File.createFromFileName(fileName, @_currentFileData)
          @_currentFileData = null

          currentDirectory.collection.add file

          if @settings.get('autoOpenFiles') and triggerAutoOpen
            @trigger 'openFile', file

          return file

    beforeAdd: (fileData) ->
      ###
      Internal: This function provides a filter to exclude files from the
                file tree based on conditions from their raw data. This function
                shouldn't be modified directly, it should instead by passed in
                as an option when instantiating the file tree. The default
                implementation is to return true and allow all files to be
                added to the tree.

      * fileData - An Object containing the raw attributes of the file to be
                   created. Use these to determine conditions to allow or
                   exclude files from the tree.

      Examples

          # set up a beforeAdd filter on the tree view
          tree = new BoneTree.Views.Tree
            beforeAdd: (fileData) ->
              if fileData.extension is 'wav'
                return false
              else
                return true

      Returns true if the file should be added to the tree and false otherwise.
      ###
      true

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

    closeMenu: (e) =>
      ###
      Internal: Close the context menu. This is called every click on
                the document and closes the menu unless you are clicking
                within it. This shouldn't be called directly, it is called
                automatically by Backbone from user interactions.

      Returns the Menu view object.
      ###
      @menuView.$el.hide() unless $(e.currentTarget).is('.menu')

      return @menuView

    contextMenu: (e) =>
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
          tree.addFile('/source/main.coffee')
          tree.addFile('/source/player.coffee')

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
          tree.addFile('/source/main.coffee')
          tree.addFile('/source/player.coffee')

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
          tree.addFile('/source/main.coffee')
          tree.addFile('/source/player.coffee')
          tree.addFile('/directory2/file.coffee')

          # returns an array containing the Directory 'source'
          tree.getDirectory('source')
          # => [<Directory>]

      Returns an Array of Directory nodes that match directoryName.
      ###
      @filterNodes('directory', directoryName)

    getFile: (filePath) =>
      ###
      Public: Returns a file at the specified location.

      * fileName - A String describing the file path.

      Examples

          # Add some files to the tree
          tree.addFile('/source/main.coffee')
          tree.addFile('/source/player.coffee')
          tree.addFile('/directory2/main.coffee')

          # returns an array containing both the files named main.
          tree.getFile('source/main.coffee')
          # => <File>

      Returns a File at the given location.
      ###

      filePath = filePath.replace('/', '') if filePath[0] is '/'

      nodes = @flatten()

      filtered = _.filter(nodes, (node) ->
        return node.get('nodeType') is 'file' and node.get('_path') is filePath
      )

      return filtered[0]

    getFiles: (directoryName) =>
      ###
      Public: Returns an array of files contained within the directory
              matching directoryName.

      * directoryName - A String naming the directory to look inside.

      Examples

          # Add some files to the tree
          tree.addFile('/source/main.coffee')
          tree.addFile('/source/player.coffee')
          tree.addFile('/directory2/main.coffee')

          # returns an array containing the files 'player.coffee' and 'main.coffee'
          tree.getFiles('source')
          # => [<File>, <File>]

      Returns an Array of File nodes that are contained in the
      Directory matching directoryName.
      ###
      directory = @getDirectory(directoryName)[0]

      # short circuit if your directory list is empty.
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
          tree.addFile('/source/main.coffee')
          tree.addFile('/source/player.coffee')
          tree.addFile('/directory2/main.coffee')

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

    openDirectory: (e) =>
      ###
      Internal: Toggle the directory icon and display the contents of the clicked Directory.

      ###
      model = @getModelFromClick(e)

      model.toggleOpen()

    openFile: (e) =>
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

        @$el.append view.render().$el

      return @

