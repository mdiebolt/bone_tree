require 'bone_tree/_namespace.js'
require 'bone_tree/views/_tree.js'

beforeEach ->
  @tree = new BoneTree.Views.Tree

  $('#test').append @tree.el

describe "rendering", ->
  it "should render the correct DOM elements", ->
    expect($('#test .tree')).toExist()
    expect($('#test .tree').length).toEqual(1)

describe "configuration", ->
  it "should pass options through to the settings object", ->
    @tree = new BoneTree.Views.Tree
      autoOpenFiles: false

    expect(@tree.settings.get('autoOpenFiles')).toBeFalsy()

    @tree = new BoneTree.Views.Tree
      confirmDeletes: true

    expect(@tree.settings.get('confirmDeletes')).toBeTruthy()

    @tree = new BoneTree.Views.Tree
      showExtensions: true

    expect(@tree.settings.get('showExtensions')).toBeTruthy()
