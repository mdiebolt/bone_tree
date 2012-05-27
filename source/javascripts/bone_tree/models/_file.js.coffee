#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.File extends Models.Node
    toArray: =>
      [@]

    toAscii: (indentation='') =>
      "#{indentation}-#{@name()}"
