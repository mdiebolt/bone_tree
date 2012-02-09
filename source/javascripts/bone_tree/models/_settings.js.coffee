BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Settings extends Backbone.Model
    defaults:
      confirmDeletes: false
      showExtensions: false
      viewCache: {}

