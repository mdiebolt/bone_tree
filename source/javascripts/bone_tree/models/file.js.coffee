#= require ./node

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.File extends Models.Node
    extension: =>
      @name().extension()

    toArray: =>
      [@]

    toAscii: (indentation='') =>
      "#{indentation}-#{@name()}"
