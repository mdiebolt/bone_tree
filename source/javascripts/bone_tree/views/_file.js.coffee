#= require ../models/_nodes

BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.File extends BoneTree.View
    className: 'file'
    tagName: 'li'

    initialize: ->
      super

      @el.attr('data-cid', @cid).addClass(@model.get('extension'))

      @model.bind 'change:name', (model, name) =>
        @settings.get('treeView').trigger 'rename', model, model.nameWithExtension()
        @settings.get('treeView').render()

      @model.bind 'change:extension', (model, extension) =>
        @el.attr('class', "file #{extension}")
        @settings.get('treeView').trigger 'rename', model, model.nameWithExtension()
        @settings.get('treeView').render()

    render: =>
      @el.text @model.nameWithExtension()

      return @

