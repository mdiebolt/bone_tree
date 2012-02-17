BoneTree.namespace "BoneTree.Models", (Models) ->
  # node model
  class Models.Node extends Backbone.Model
    initialize: ->
      @collection = new Models.Nodes

    constantize: =>
      nodeType = @get('nodeType')

      nodeType[0].toUpperCase() + nodeType.substring(1)

    nameWithExtension: =>
      {extension, name} = @attributes

      extension ||= ""

      if extension isnt ""
        extension = "." + extension

      return name + extension

  # nodes collection
  class Models.Nodes extends Backbone.Collection
    comparator: (node) ->
      {name, sortPriority} = node.attributes

      return sortPriority + name

    model: Models.Node



