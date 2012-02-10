#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Directory extends Models.Node
    defaults:
      name: "New Directory"
      open: false
      sortPriority: "0"
      nodeType: "directory"

    toggleOpen: =>
      currentState = @get 'open'

      @set {open: not currentState}

  Models.Directory.find = (currentDirectory, name) ->
    currentDirectory.collection.find (dir) ->
      dir.get('name') is name


