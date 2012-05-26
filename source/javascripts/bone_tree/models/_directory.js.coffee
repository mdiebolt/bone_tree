#= require ./_nodes

BoneTree.namespace "BoneTree.Models", (Models) ->
  class Models.Directory extends Models.Node
    defaults:
      name: "New Directory"

    add: (filePath, fileData={}) =>
      {Directory, File} = Models

      [dirs..., fileName] = filePath.split('/')

      currentDirectory = @

      dirs.each (directoryName) ->
        return if directoryName is ''

        directory = currentDirectory.directories().select (dir) ->
          dir.get('name') is directoryName
        .first()

        unless directory
          directory = new Directory
            name: directoryName
            path: filePath.substring(0, filePath.indexOf(directoryName) + directoryName.length)

          currentDirectory.collection.add(directory)

        currentDirectory = directory

      if file = currentDirectory.getFile(fileName)
        file.set(fileData)
      else
        currentDirectory.collection.add new File(_.extend(fileData, {name: fileName, path: filePath}))

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
        node.get('name') is first

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
        node.get('name') is first

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
      name = @get('name')

      nodeAscii = ["#{indentation}+#{name}"]

      @collection.each (node) ->
        nodeAscii.push node.toAscii(indentation + ' ')

      nodeAscii.join('\n')
