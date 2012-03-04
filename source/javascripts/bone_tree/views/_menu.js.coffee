BoneTree.namespace "BoneTree.Views", (Views) ->
  class Views.Menu extends Backbone.View
    ###
    Internal: View that controls the context menu (class: 'filetree\_context\_menu').

    Events

    * contextMenu   - Prevents the standard browser context menu from appearing
                      when right clicking within the file tree context menu.

    * click .rename - Prompts the user to rename a file.

    * click .delete - Deletes a node from the file tree.

    ###
    className: 'filetree_context_menu'

    events:
      'contextmenu': 'contextMenu'
      'click .rename': 'rename'
      'click .delete': 'delete'

    initialize: (options) ->
      ###
      Internal: Initialize a new menu widget.

      * options - An Object. Internally used to pass the settings configuration
                  into the menu. This controls whether or not the user is
                  prompted to confirm deleting a file.

      ###
      @settings = options.settings

    contextMenu: (e) =>
      ###
      Internal: Kill the default browser behavior for the contextmenu event.

      ###
      e.preventDefault()
      e.stopPropagation()

    delete: (e) =>
      ###
      Internal: Deletes a node from the file tree. If the confirmDeletes setting
                is set, prompts the user for delete confirmation.

      ###
      if @settings.get('confirmDeletes')
        if confirm "Are you sure you want to delete '#{@model.nameWithExtension()}'?"
          @model.destroy()
      else
        @model.destroy()

      @$el.hide()

    rename: (e) =>
      ###
      Internal: Prompts the user to rename a File or Directory.

      ###
      if newName = prompt "New Name", @model.nameWithExtension()
        [fileName, extension] = newName.split "."

        extension ?= ""

        @model.set
          name: fileName
          extension: extension

      @$el.hide()

    render: =>
      ###
      Internal: Renders the <ul> that contains the context menu choices
                'Rename' and 'Delete'.

      Returns `this`, the menu view.
      ###

      @$el.html @template()

      return @

    template: ->
      ###
      Internal: html template for the context menu.

      ###
      """
        <ul>
          <li class='rename'>Rename</li>
          <hr/>
          <li class='delete'>Delete</li>
        </ul>
      """


