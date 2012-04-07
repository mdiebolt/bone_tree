#= require bone_tree/_namespace
#= require bone_tree/views/_file

beforeEach ->
  @settings = new Backbone.Model
    treeView: new Backbone.View
    showExtensions: true

  @model = new Backbone.Model
    name: "Testing"
    extension: "exe"

  @model.nameWithExtension = =>
    @model.get('name') + "." + @model.get('extension')

  @view = new BoneTree.Views.File
    model: @model
    settings: @settings

  $('#test').append @view.render().el

describe 'rendering', ->
  it 'should render the correct element', ->
    expect($('#test li.file')).toExist()
    expect($('#test li.file').length).toEqual(1)

  it 'should have the extension as a class name', ->
    expect($('#test li.file')).toHaveClass('exe')

  it 'should have the filename as the text of the node', ->
    expect($('#test li.file').text()).toEqual('Testing.exe')

  it 'should exclude the extension if that option is set', ->
    @settings.set
      showExtensions: false

    @view.render()

    expect($('#test li.file').text()).toEqual('Testing')

describe 'events', ->
  it 'should trigger a change event on the file tree when the name has changed', ->
    spy = sinon.spy()

    @settings.get('treeView').bind 'rename', spy

    @model.set
      name: 'new name'

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith(@model, @model.nameWithExtension())

  it 'should trigger a change event on the file tree when the extension has changed', ->
    spy = sinon.spy()

    @settings.get('treeView').bind 'rename', spy

    @model.set
      extension: 'js'

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith(@model, @model.nameWithExtension())
