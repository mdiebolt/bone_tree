#= require bone_tree/_namespace
#= require bone_tree/models/_nodes

describe "sorting behavior", ->
  it 'should sort collections correctly according to the comparator', ->
    {Models} = BoneTree

    nodes = new Models.Nodes

    nodes.add(new Models.Node {path: 'aaa'})
    nodes.add(new Models.Node {path: 'zzz'})

    expect(nodes.sort().map (node) ->
      node.name()
    ).toEqual(['aaa', 'zzz'])
