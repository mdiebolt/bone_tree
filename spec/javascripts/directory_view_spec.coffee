require 'bone_tree/_namespace.js'
require 'bone_tree/views/_base.js'
require 'bone_tree/views/_directory.js'

beforeEach ->
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

  @view = new BoneTree.Views.Directory
    model: @model
    settings: @settings

  $('#test').append @view.render().el

describe 'rendering', ->
  it 'should render the correct element', ->
    expect($('#test ul.directory')).toExist()
    expect($('#test ul.directory').length).toEqual(1)

  it 'should render the directory name as the DOM text', ->
    expect($('#test ul.directory').text()).toEqual(@model.get('name'))

  it 'should change the directory name in the DOM when the model name is updated', ->
    @model.set
      name: "NewDir"

    expect($('#test ul.directory').text()).toEqual(@model.get('name'))

  it 'should toggle the open class based on the model state', ->
    #TODO this should be the case. Change it so that appendView doesn't automatically open the dir
    # expect($('#test ul.directory')).not.toHaveClass('open')

    @model.set
      open: false

    expect($('#test ul.directory')).not.toHaveClass('open')

    @model.set
      open: true

    expect($('#test ul.directory')).toHaveClass('open')

  #TODO mock findView properly so you can test this
  #it 'should render new directories to the DOM', ->
  #  newDir = new Backbone.Model
  #    name: 'newDir'
  #    open: false

  #  @model.collection.add newDir

  #  expect($('#test ul.directory ul.directory').length).toEqual(1)

  #TODO tests around hiding children directories

  it 'should trigger a rename event on the tree when the directory name is changed', ->
    spy = sinon.spy()

    @settings.get('treeView').bind 'rename', spy

    @model.set
      name: 'dir2'

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith(@model, @model.get('name'))
