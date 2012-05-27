BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.Menu extends Backbone.View
    className: 'filetree_context_menu'

    events:
      'contextmenu': 'contextMenu'
      'click .rename': 'rename'
      'click .delete': 'delete'

    initialize: (options) ->
      @settings = options.settings

    contextMenu: (e) =>
      e.preventDefault()
      e.stopPropagation()

    delete: (e) =>
      if @settings.get('confirmDeletes')
        if confirm "Are you sure you want to delete '#{@model.name()}'?"
          @model.destroy()
      else
        @model.destroy()

      @$el.hide()

    rename: (e) =>
      if newName = prompt("New Name", @model.name())
        [dirs..., fileName] = @model.get('path').split('/')

        @model.set
          path: "#{dirs.join('/')}/#{newName}"

      @$el.hide()

    render: =>
      @$el.html @template()

      return @

    template: ->
      """
        <ul>
          <li class='rename'>Rename</li>
          <hr/>
          <li class='delete'>Delete</li>
        </ul>
      """
