#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Directory extends Models.Node
    defaults:
      name: "New Directory"

    files: =>
      @collection.filter (node) ->
        node.isFile()

    toArray: =>
      results = [@]

      @collection.each (node) =>
        results.push node.toArray()

      return _.flatten(results)

    toAscii: (indentation='') =>
      nodeAscii = ["#{indentation}+#{@nameWithExtension()}"]

      @collection.each (node) ->
        nodeAscii.push node.toAscii(indentation + ' ')

      nodeAscii.join('\n')

  Models.Directory.find = (currentDirectory, name) ->
    ###
    Internal: Check to see if there is a directory with the matching name
              contained within currentDirectory.

    * currentDirectory - A Directory object to search for the matching directory name.

    * name             - A String name used to check for matching directory
                         names in currentDirectory.

    Returns The Directory object with the matching name if it exists and undefined otherwise.
    ###
    currentDirectory.collection.find (dir) ->
      dir.get('name') is name


