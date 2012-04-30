#= require bone_tree/_namespace
#= require bone_tree/views/_tree

describe "BoneTree.Views.Tree", ->
  beforeEach ->
    setFixtures("<div id='test'></div>")

    @tree = new BoneTree.Views.Tree

    $('#test').append @tree.render().el

  afterEach ->
    @tree.remove()
    $('#test').empty()

  describe "rendering", ->
    it "should render the correct DOM elements", ->
      expect($('#test .tree')).toExist()
      expect($('#test .tree').length).toEqual(1)

  describe "configuration", ->
    it "should pass options through to the settings object", ->
      @tree = new BoneTree.Views.Tree
        confirmDeletes: true

      expect(@tree.settings.get('confirmDeletes')).toBeTruthy()

      @tree = new BoneTree.Views.Tree
        showExtensions: true

      expect(@tree.settings.get('showExtensions')).toBeTruthy()

  describe 'API', ->
    it 'should be able to find files by their path', ->
      @tree = new BoneTree.Views.Tree

      srcMain = @tree.file('src/main.coffee', {added: true})

      expect(@tree.file('src/main.coffee')).toEqual(srcMain)
