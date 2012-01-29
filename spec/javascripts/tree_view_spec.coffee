require 'bone_tree/_namespace.js'
require 'bone_tree/views/_tree.js'

beforeEach ->
  @tree = new BoneTree.Views.Tree

  $('#test').append @tree.el

describe "rendering", ->
  it "should render the correct DOM elements", ->
    expect($('#test .tree')).toExist()
    expect($('#test .tree').length).toEqual(1)
