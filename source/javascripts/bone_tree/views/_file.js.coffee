BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.File extends Backbone.View
    ###
    Internal: View that renders a File node and controls its behavior (class: 'file', tag: 'li').

    ###
    className: 'file'
    tagName: 'li'

    initialize: (options) ->
      @settings = options.settings

      @$el.attr('data-cid', @model.cid).addClass(@model.get('extension'))

      @model.bind 'change:name', (model, name) =>
        treeView = @settings.get('treeView')
        treeView.render().trigger 'rename', model, model.get('name')

      @model.bind 'change:extension', (model, extension) =>
        @$el.attr('class', "file #{extension}")

        treeView = @settings.get('treeView')
        treeView.render().trigger 'rename', model, model.get('name')

    render: =>
      name = @model.get('name')

      extension = name.extension()

      @$el.addClass(extension)

      if @settings.get('showExtensions')
        @$el.text name
      else
        @$el.text name.withoutExtension()

      return @

