#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.File extends Models.Node
    defaults:
      name: "New File.coffee"

    toArray: =>
      [@]

    toAscii: (indentation='') =>
      name = @get('name')

      "#{indentation}-#{name}"
