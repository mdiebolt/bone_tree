BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Settings extends Backbone.Model
    defaults:
      autoOpenFiles: true
      confirmDeletes: false
      showExtensions: false
      viewCache: {}

