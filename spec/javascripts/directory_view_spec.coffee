#= require bone_tree/_namespace
#= require bone_tree/views/_directory

describe 'BoneTree.Views.Directory', ->
  beforeEach ->
    setFixtures("<div id='test'></div>")

    treeView = new Backbone.View
    treeView.findView = (model) ->
      @view.model = model

      return @view

    treeView.settings = @settings

    @settings = new Backbone.Model
      treeView: treeView

    @model = new Backbone.Model
      name: "TestDir"
      open: false

    @model.collection = new Backbone.Collection
    @model.collection.comparator = (item) =>
      return item.get('name')

    @view = new BoneTree.Views.Directory
      model: @model
      settings: @settings

    $('#test').append @view.render().$el

  afterEach ->
    @view.remove()
    $('#test').empty()

  describe 'rendering', ->
    it 'should render the correct element', ->
      expect($('#test ul.directory')).toExist()
      expect($('#test ul.directory').length).toEqual(1)

    it 'should render the directory name as the DOM text', ->
      expect($('#test ul.directory').text()).toEqual(@model.get('name'))

    it 'should change the directory name in the DOM when the model name is updated', ->
      renameSpy = sinon.spy()

      @settings.get('treeView').bind 'rename', renameSpy

      @model.set
        name: "NewDir"

      expect(renameSpy).toHaveBeenCalledOnce()
      expect(renameSpy).toHaveBeenCalledWith(@model, @model.get('name'))

    it 'should trigger a rename event on the tree when the directory name is changed', ->
      spy = sinon.spy()

      @settings.get('treeView').bind 'rename', spy

      @model.set
        name: 'dir2'

      expect(spy).toHaveBeenCalledOnce()
      expect(spy).toHaveBeenCalledWith(@model, @model.get('name'))
