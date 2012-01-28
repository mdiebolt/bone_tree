BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Settings extends Backbone.Model
    defaults:
      confirmDeletes: true
      showExtensions: true
      viewCache: {}

