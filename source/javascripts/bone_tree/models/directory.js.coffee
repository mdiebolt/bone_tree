#= require ./node

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Directory extends Models.Node
    add: (filePath, fileData={}) =>
      {Directory, File} = Models

      [dirs..., fileName] = filePath.split('/')

      currentDirectory = @

      dirs.each (directoryName) ->
        return if directoryName is ''

        directory = currentDirectory.directories().select (dir) ->
          dir.name() is directoryName
        .first()

        unless directory
          directory = new Directory
            path: filePath.substring(0, filePath.indexOf(directoryName) + directoryName.length)

          currentDirectory.collection.add(directory)

        currentDirectory = directory

      if file = currentDirectory.getFile(fileName)
        file.set(fileData)
      else
        file = new File(_.extend(fileData, {path: filePath}))

        currentDirectory.collection.add file

        return file

    remove: (path) =>
      if file = @getFile(path)
        file.destroy()
      else if directory = @getDirectory(path)
        directory.destroy()

    directories: =>
      @collection.filter (node) ->
        node.isDirectory()

    getDirectory: (directoryPath) =>
      [first, rest...] = directoryPath.split('/')

      match = @collection.find (node) ->
        node.name() is first

      if match?.isDirectory()
        if rest.length
          return match.getDirectory(rest.join('/'))
        else
          return match

      return undefined

    files: =>
      @collection.filter (node) ->
        node.isFile()

    getFile: (filePath) =>
      [first, rest...] = filePath.split '/'

      match = @collection.find (node) ->
        node.name() is first

      if match?.isDirectory()
        if rest.length
          return match.getFile(rest.join('/'))
        else
          return undefined
      else
        return match

    toArray: =>
      results = [@]

      @collection.each (node) =>
        results = results.concat node.toArray()

      results

    toAscii: (indentation='') =>
      nodeAscii = ["#{indentation}+#{@name()}"]

      @collection.each (node) ->
        nodeAscii.push node.toAscii(indentation + ' ')

      nodeAscii.join('\n')

    updateChildren: (previousPath, newPath) =>
      @directories().each (directory) =>
        directory.updateChildren(previousPath, newPath)

      directoryPath = @get('path')

      if directoryPath.indexOf(newPath) is -1
        @set
          path: @get('path').replace(previousPath, newPath)

      @files().each (file) =>
        filePath = file.get('path')

        if filePath.indexOf(newPath) is -1
          file.set
            path: file.get('path').replace(previousPath, newPath)
