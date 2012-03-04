#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.File extends Models.Node
    ###
    Public: Object representing file data in the tree.

    * defaults
      * name         - A String naming the file (default: "New File").
      * sortPriority - A String representing the priority with which the
                       node is sorted. Directories have sortPriority "0"
                       allowing them to be sorted before Files which have
                       sortPriority "1".
      * nodeType     - A String denoting what type of node this object is.
                       The two types are "file" and "directory".

    ###
    defaults:
      name: "New File"
      sortPriority: "1"
      nodeType: "file"

  Models.File.createFromFileName = (fileName, fileData) ->
    ###
    Public: Class method to create a new File object based on the fileName
            and fileData passed in.

    * fileName - A String representing the name of the file to be created.
                 files with '.' in the name will be parsed out and only the
                 string after the final '.' will be considered the extension.

    * fileData - An Object of attributes to associate with the file.

    Examples

        data = {
          contents: alert 'this is the code in the file'
          createdAt: 1330846900589
          language: 'CoffeeScript'
        }

        BoneTree.Models.File.createFromFileName('example.coffee', data)
        # => <File>

    Returns the File object just created.
    ###

    # Make sure that files like jquery.min.js work
    [names..., extension] = fileName.split "."
    name = names.join('.')

    data = _.extend({}, fileData, {name: name, extension: extension})

    return new Models.File(data)

