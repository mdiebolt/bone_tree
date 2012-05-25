#= require bone_tree/_namespace
#= require bone_tree/models/_nodes

describe "sorting behavior", ->
  it 'should sort collections correctly according to the comparator', ->
    {Models} = BoneTree

    nodes = new Models.Nodes

    nodes.add(new Models.Node {name: 'zzz'})
    nodes.add(new Models.Node {name: 'aaa'})

    expect(nodes.sort().pluck('name')).toEqual(['aaa', 'zzz'])
