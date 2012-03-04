BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Settings extends Backbone.Model
    ###
    Internal: A configuration object. Consumers of the API don't need to
              worry about this. It is used internally to manage the options
              passed into the file tree.

    * defaults
      * autoOpenFiles  - A Boolean. If true, each file that is added to the tree
                         immediately triggers an `openFile` event (default: true).
      * beforeAdd      - A Function that is invoked before each file is added to the tree.
                         It is passed the raw file attributes and should return true if
                         that file should be added to the tree and false if not. The
                         default implementation is to return true.
      * confirmDeletes - A Boolean. If true, the tree will prompt the user, making
                         sure they want to delete the file (default: false).
      * showExtensions - A Boolean. If true, files display their extensions. Internally,
                         extensions are always kept track of but by default they are
                         hidden (default: false).
      * viewCache      - An Object that stores views when they are created and is used
                         to look them up to prevent extra views from being created.
    ###
    defaults:
      autoOpenFiles: true
      confirmDeletes: false
      showExtensions: false
      viewCache: {}

