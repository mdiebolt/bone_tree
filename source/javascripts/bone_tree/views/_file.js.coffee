BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.File extends Backbone.View
    ###
    Internal: View that renders a File node and controls its behavior (class: 'file', tag: 'li').

    ###
    className: 'file'
    tagName: 'li'

    initialize: (options) ->
      ###
      Internal: Initialize a new file node. Adds associated model cid to the
                view element. Binds change handlers to the `change:name` and
                `change:extension` events. These take care of resorting the file
                nodes.

      * options - Passes in settings object, which is used to control
                  whether or not file extensions are shown.

      ###
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
      ###
      Internal: Sets the text of the file node according to the underlying model
                name. If the 'showExtensions' setting is set, renders the
                full file name with extension, otherwise renders just the file
                name attribute.

      ###
      return "" if @model.get('hidden')

      if @settings.get('showExtensions')
        @$el.text @model.nameWithExtension()
      else
        @$el.text @model.get('name')

      return @

