#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.File extends Models.Node
    defaults:
      name: "New File"
      sortPriority: "1"
      nodeType: "file"

  Models.File.createFromFileName = (fileName, fileData) ->
    [names..., extension] = fileName.split "."
    name = names.join('.')

    data = _.extend({}, fileData, {name: name, extension: extension})

    return new Models.File(data)

