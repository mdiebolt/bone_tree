BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Node extends Backbone.Model
    initialize: ->
      @collection = new Models.Nodes

    isDirectory: =>
      @ instanceof BoneTree.Models.Directory

    isFile: =>
      @ instanceof BoneTree.Models.File

    name: =>
      {extension, name} = @attributes

      extension ||= ""

      if extension isnt ""
        extension = "." + extension

      return name + extension

  class Models.Nodes extends Backbone.Collection
    comparator: (node) ->
      name = node.get 'name'

      if node.isDirectory()
        sortPriority = 0
      else
        sortPriority = 1

      return sortPriority + name

    model: Models.Node
