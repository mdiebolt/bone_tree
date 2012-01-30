#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.File extends Models.Node
    defaults:
      name: "New File"
      sortPriority: "1"
      type: "file"

  Models.File.createFromFileName = (fileName) ->
    [name, extension] = fileName.split "."

    return new Models.File
      name: name
      extension: extension

