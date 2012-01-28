require 'bone_tree/_namespace.js'
require 'bone_tree/models/_nodes.js'

beforeEach ->
  @file = new BoneTree.Models.Node
    type: 'file'
    name: 'config'
    extension: 'json'

  @directory = new BoneTree.Models.Node
    type: 'directory'
    name: 'src'

describe 'helper functions', ->
  it 'should return the correct constantized type', ->
    expect(@file.constantize()).toEqual('File')
    expect(@directory.constantize()).toEqual('Directory')

  it 'should return the full name with extension when appropriate', ->
    expect(@file.nameWithExtension()).toEqual('config.json')
    expect(@directory.nameWithExtension()).toEqual('src')
