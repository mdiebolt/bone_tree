BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.File extends Backbone.View
    className: 'file'
    tagName: 'li'

    initialize: (options) ->
      @settings = options.settings

      @$el.attr('data-cid', @model.cid).addClass(@model.get('extension'))

      @model.bind 'change:name', (model, name) =>
        treeView = @settings.get('treeView')
        treeView.render().trigger 'rename', model, model.nameWithExtension()

      @model.bind 'change:extension', (model, extension) =>
        @$el.attr('class', "file #{extension}")

        treeView = @settings.get('treeView')
        treeView.render().trigger 'rename', model, model.nameWithExtension()

    render: =>
      if @settings.get('showExtensions')
        @$el.text @model.nameWithExtension()
      else
        @$el.text @model.get('name')

      return @

