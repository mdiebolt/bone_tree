#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Directory extends Models.Node
    ###
    Public: Object representing a directory.

    * defaults
      * name         - A String naming the directory (default: "New Directory").
      * sortPriority - A String representing the priority with which the
                       node is sorted. Directories have sortPriority "0"
                       allowing them to be sorted before Files which have
                       sortPriority "1".
      * nodeType     - A String denoting what type of node this object is.
                       The two types are "file" and "directory".
      * open         - The state of the directory. Controls whether or not
                       to display files and directories contained within this
                       Directory (default: false).

    ###
    defaults:
      name: "New Directory"
      open: false
      sortPriority: "0"
      nodeType: "directory"

    toggleOpen: =>
      ###
      Public: Toggle the open state of this Directory.

      Examples

          dir = new BoneTree.Models.Directory

          dir.get('open')
          # => false

          dir.toggleOpen()
          dir.get('open')
          # => true

      Returns this Directory.
      ###
      currentState = @get 'open'

      @set {open: not currentState}

  Models.Directory.find = (currentDirectory, name) ->
    ###
    Internal: Check to see if there is a directory with the matching name
              contained within currentDirectory.

    * currentDirectory - A Directory object to search for the matching directory name.

    * name             - A String name used to check for matching directory
                         names in currentDirectory.

    Returns The Directory object with the matching name if it exists and undefined otherwise.
    ###
    currentDirectory.collection.find (dir) ->
      dir.get('name') is name


