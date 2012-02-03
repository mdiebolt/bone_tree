BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.Menu extends BoneTree.View
    className: 'menu'

    events:
      'click .rename': 'rename'
      'click .delete': 'delete'

    initialize: ->
      super

    delete: (e) =>
      if @settings.get('confirmDeletes')
        if confirm "Are you sure you want to delete '#{@model.nameWithExtension()}'?"
          @model.destroy()
      else
        @model.destroy()

      @$el.hide()

    rename: (e) =>
      if newName = prompt "New Name", @model.nameWithExtension()
        [fileName, extension] = newName.split "."

        extension ?= ""

        @model.set
          name: fileName
          extension: extension

      @$el.hide()

    render: =>
      @$el.html @htmlTemplate()

      return @

    htmlTemplate: ->
      """
        <ul>
          <li class='rename'>Rename</li>
          <hr/>
          <li class='delete'>Delete</li>
        </ul>
      """


