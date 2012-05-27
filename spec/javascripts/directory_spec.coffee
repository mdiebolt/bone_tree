#= require bone_tree/_namespace
#= require bone_tree/models/_directory

describe 'BoneTree.Models.Directory', ->
  it 'should be able to visualize the tree structure with Ascii characters', ->
    tree = new BoneTree.Views.Tree

    tree.add('src/main.coffee', { description: 'Entry point' })
    tree.add('src/player.coffee', { description: 'The hero' })
    tree.add('src/enemy.coffee', { description: 'The baddy' })

    expect(tree.toAscii()).toEqual """

    +
     +src
      -enemy.coffee
      -main.coffee
      -player.coffee
    """

  it 'should be able to return all files it contains', ->
    tree = new BoneTree.Views.Tree

    tree.add('src/main.coffee', { description: 'Entry point' })
    tree.add('src/player.coffee', { description: 'The hero' })
    tree.add('src/enemy.coffee', { description: 'The baddy' })

    # extra +1 in the length from the root directory
    expect(tree.toArray().length).toEqual(5)
