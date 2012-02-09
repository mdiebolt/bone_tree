BoneTree.namespace "BoneTree.Models", (Models) ->
  # node model
  class Models.Node extends Backbone.Model
    initialize: ->
      @collection = new Models.Nodes

    constantize: =>
      nodeType = @get('nodeType')

      nodeType[0].toUpperCase() + nodeType[1..nodeType.length]

    nameWithExtension: =>
      extension = if @get('extension') then "." + @get('extension') else ""

      return @get('name') + extension

  # nodes collection
  class Models.Nodes extends Backbone.Collection
    comparator: (file) ->
      name = file.get 'name'
      sortIndex = file.get 'sortPriority'

      return sortIndex + name

    model: Models.Node



