BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Node extends Backbone.Model
    initialize: ->
      @collection = new Models.Nodes

    isDirectory: =>
      @ instanceof BoneTree.Models.Directory

    isFile: =>
      @ instanceof BoneTree.Models.File

  class Models.Nodes extends Backbone.Collection
    comparator: (node) ->
      name = node.get 'name'

      if node.isDirectory()
        sortPriority = 0
      else
        sortPriority = 1

      return sortPriority + name

    model: Models.Node
