BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Node extends Backbone.Model
    initialize: ->
      @collection = new Models.Nodes

    isDirectory: =>
      @ instanceof Models.Directory

    isFile: =>
      @ instanceof Models.File

    name: =>
      @get('path').split('/').last()

  class Models.Nodes extends Backbone.Collection
    comparator: (node) ->
      if node.isDirectory()
        sortPriority = 0
      else
        sortPriority = 1

      return sortPriority + node.name()

    model: Models.Node
