BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Node extends Backbone.Model
    ###
    Internal: An abstract super class for File and Directory objects to inherit from.

    ###
    initialize: ->
      ###
      Internal: Initialize a new Node object. Set it up to contain a collection of
                children nodes.

      ###
      @collection = new Models.Nodes

    constantize: =>
      ###
      Public: Returns a String with the nodeType capitalized so that it may be used
              to instatiate the appropriate view type

      Examples

          file = new BoneTree.Models.File
          directory = new BoneTree.Models.Directory

          file.constantize()
          # => 'File'

          directory.constantize()
          # => 'Directory'

          # use it to create a new view of the appropriate type
          view = new BoneTree.Views[file.constantize()]

      Returns a String of the nodeType with the first letter capitalized.
      ###
      nodeType = @get('nodeType')

      nodeType[0].toUpperCase() + nodeType.substring(1)

    nameWithExtension: =>
      ###
      Public: Returns the node name with the extension if it has
              one and just the node name if there is no extension.

      Examples

          file = new BoneTree.Models.File
            name: "file"
            extension: "coffee"

          noExt = new BoneTree.Models.File
            name: "file2"

          directory = new BoneTree.Model.Directory
            name: "source"

          file.nameWithExtension()
          # => "file.coffee"

          noExt.nameWithExtension()
          # => "file2"

          directory.nameWithExtension()
          # => "source"

      Returns a String. If the extension exists then the node name plus the extension
      are returned. If there is no extension, then just the node name is returned.
      ###
      {extension, name} = @attributes

      extension ||= ""

      if extension isnt ""
        extension = "." + extension

      return name + extension

  class Models.Nodes extends Backbone.Collection
    ###
    Internal: A collection of node models. Since Node is an abstract super
              class, in practice this collection will hold File objects
              and Directory objects.

    ###
    comparator: (node) ->
      ###
      Internal: Function that determines how the file tree is sorted. Directories
                are sorted before files. After node type sort
                priority, nodes are sorted by name.

      Examples

          tree.addFile('/source/file1.coffee')
          tree.addFile('/source/file2.coffee')
          tree.addFile('main.coffee')

          tree.render()

          # even though 'main' comes before 'source' alphabetically it is placed
          # after the 'source' directory due to the sortPriority of the Directory object.
          tree.toAscii()
          # => "
            -source
             -file1.coffee
             -file2.coffee
            -main.coffee
          "

      ###
      {name, sortPriority} = node.attributes

      return sortPriority + name

    model: Models.Node



