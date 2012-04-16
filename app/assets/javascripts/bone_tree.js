(function() {
  var __slice = Array.prototype.slice;

  window.BoneTree = {};

  BoneTree.namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref2;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref2 = name.split('.');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      item = _ref2[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Models", function(Models) {
    Models.Node = (function(_super) {

      __extends(Node, _super);

      function Node() {
        this.nameWithExtension = __bind(this.nameWithExtension, this);
        this.constantize = __bind(this.constantize, this);
        Node.__super__.constructor.apply(this, arguments);
      }

      /*
          Internal: An abstract super class for File and Directory objects to inherit from.
      */

      Node.prototype.initialize = function() {
        /*
              Internal: Initialize a new Node object. Set it up to contain a collection of
                        children nodes.
        */        return this.collection = new Models.Nodes;
      };

      Node.prototype.constantize = function() {
        /*
              Public: Returns a String with the nodeType capitalized so that it may be used
                      to instatiate the appropriate view type
        
              Examples
        
                  file = new BoneTree.Models.File
                  directory = new BoneTree.Models.Directory
        
                  file.constantize()
                  # => 'File'
        
                  directory.constantize()
                  # => 'Directory'
        
                  # use it to create a new view of the appropriate type
                  view = new BoneTree.Views[file.constantize()]
        
              Returns a String of the nodeType with the first letter capitalized.
        */
        var nodeType;
        nodeType = this.get('nodeType');
        return nodeType[0].toUpperCase() + nodeType.substring(1);
      };

      Node.prototype.nameWithExtension = function() {
        /*
              Public: Returns the node name with the extension if it has
                      one and just the node name if there is no extension.
        
              Examples
        
                  file = new BoneTree.Models.File
                    name: "file"
                    extension: "coffee"
        
                  noExt = new BoneTree.Models.File
                    name: "file2"
        
                  directory = new BoneTree.Model.Directory
                    name: "source"
        
                  file.nameWithExtension()
                  # => "file.coffee"
        
                  noExt.nameWithExtension()
                  # => "file2"
        
                  directory.nameWithExtension()
                  # => "source"
        
              Returns a String. If the extension exists then the node name plus the extension
              are returned. If there is no extension, then just the node name is returned.
        */
        var extension, name, _ref;
        _ref = this.attributes, extension = _ref.extension, name = _ref.name;
        extension || (extension = "");
        if (extension !== "") extension = "." + extension;
        return name + extension;
      };

      return Node;

    })(Backbone.Model);
    return Models.Nodes = (function(_super) {

      __extends(Nodes, _super);

      function Nodes() {
        Nodes.__super__.constructor.apply(this, arguments);
      }

      /*
          Internal: A collection of node models. Since Node is an abstract super
                    class, in practice this collection will hold File objects
                    and Directory objects.
      */

      Nodes.prototype.comparator = function(node) {
        /*
              Internal: Function that determines how the file tree is sorted. Directories
                        are sorted before files. After node type sort
                        priority, nodes are sorted by name.
        
              Examples
        
                  tree.addFile('/source/file1.coffee')
                  tree.addFile('/source/file2.coffee')
                  tree.addFile('main.coffee')
        
                  tree.render()
        
                  # even though 'main' comes before 'source' alphabetically it is placed
                  # after the 'source' directory due to the sortPriority of the Directory object.
                  tree.toAscii()
                  # => "
                    -source
                     -file1.coffee
                     -file2.coffee
                    -main.coffee
                  "
        */
        var name, sortPriority, _ref;
        _ref = node.attributes, name = _ref.name, sortPriority = _ref.sortPriority;
        return sortPriority + name;
      };

      Nodes.prototype.model = Models.Node;

      return Nodes;

    })(Backbone.Collection);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Models", function(Models) {
    Models.Directory = (function(_super) {

      __extends(Directory, _super);

      function Directory() {
        this.toggleOpen = __bind(this.toggleOpen, this);
        Directory.__super__.constructor.apply(this, arguments);
      }

      /*
          Public: Object representing a directory.
      
          * defaults
            * name         - A String naming the directory (default: "New Directory").
            * sortPriority - A String representing the priority with which the
                             node is sorted. Directories have sortPriority "0"
                             allowing them to be sorted before Files which have
                             sortPriority "1".
            * nodeType     - A String denoting what type of node this object is.
                             The two types are "file" and "directory".
            * open         - The state of the directory. Controls whether or not
                             to display files and directories contained within this
                             Directory (default: false).
      */

      Directory.prototype.defaults = {
        name: "New Directory",
        open: false,
        sortPriority: "0",
        nodeType: "directory"
      };

      Directory.prototype.toggleOpen = function() {
        /*
              Public: Toggle the open state of this Directory.
        
              Examples
        
                  dir = new BoneTree.Models.Directory
        
                  dir.get('open')
                  # => false
        
                  dir.toggleOpen()
                  dir.get('open')
                  # => true
        
              Returns this Directory.
        */
        var currentState;
        currentState = this.get('open');
        return this.set({
          open: !currentState
        });
      };

      return Directory;

    })(Models.Node);
    return Models.Directory.find = function(currentDirectory, name) {
      /*
          Internal: Check to see if there is a directory with the matching name
                    contained within currentDirectory.
      
          * currentDirectory - A Directory object to search for the matching directory name.
      
          * name             - A String name used to check for matching directory
                               names in currentDirectory.
      
          Returns The Directory object with the matching name if it exists and undefined otherwise.
      */      return currentDirectory.collection.find(function(dir) {
        return dir.get('name') === name;
      });
    };
  });

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  BoneTree.namespace("BoneTree.Models", function(Models) {
    Models.File = (function(_super) {

      __extends(File, _super);

      function File() {
        File.__super__.constructor.apply(this, arguments);
      }

      /*
          Public: Object representing file data in the tree.
      
          * defaults
            * name         - A String naming the file (default: "New File").
            * sortPriority - A String representing the priority with which the
                             node is sorted. Directories have sortPriority "0"
                             allowing them to be sorted before Files which have
                             sortPriority "1".
            * nodeType     - A String denoting what type of node this object is.
                             The two types are "file" and "directory".
      */

      File.prototype.defaults = {
        name: "New File",
        sortPriority: "1",
        nodeType: "file"
      };

      return File;

    })(Models.Node);
    return Models.File.createFromFileName = function(fileName, fileData) {
      /*
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
      */
      var data, extension, name, names, _i, _ref;
      _ref = fileName.split("."), names = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), extension = _ref[_i++];
      name = names.join('.');
      data = _.extend({}, fileData, {
        name: name,
        extension: extension
      });
      return new Models.File(data);
    };
  });

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Models", function(Models) {
    return Models.Settings = (function(_super) {

      __extends(Settings, _super);

      function Settings() {
        Settings.__super__.constructor.apply(this, arguments);
      }

      /*
          Internal: A configuration object. Consumers of the API don't need to
                    worry about this. It is used internally to manage the options
                    passed into the file tree.
      
          * defaults
            * autoOpenFiles  - A Boolean. If true, each file that is added to the tree
                               immediately triggers an `openFile` event (default: true).
            * beforeAdd      - A Function that is invoked before each file is added to the tree.
                               It is passed the raw file attributes and should return true if
                               that file should be added to the tree and false if not. The
                               default implementation is to return true.
            * confirmDeletes - A Boolean. If true, the tree will prompt the user, making
                               sure they want to delete the file (default: false).
            * showExtensions - A Boolean. If true, files display their extensions. Internally,
                               extensions are always kept track of but by default they are
                               hidden (default: false).
            * viewCache      - An Object that stores views when they are created and is used
                               to look them up to prevent extra views from being created.
      */

      Settings.prototype.defaults = {
        autoOpenFiles: true,
        confirmDeletes: false,
        showExtensions: false,
        viewCache: {}
      };

      return Settings;

    })(Backbone.Model);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Views", function(Views) {
    return Views.Directory = (function(_super) {

      __extends(Directory, _super);

      function Directory() {
        this.displayChildren = __bind(this.displayChildren, this);
        this.render = __bind(this.render, this);
        this.appendView = __bind(this.appendView, this);
        Directory.__super__.constructor.apply(this, arguments);
      }

      /*
          Internal: View that renders a Directory node and controls its behavior (class: 'directory', tag: 'ul').
      */

      Directory.prototype.className = 'directory';

      Directory.prototype.tagName = 'ul';

      Directory.prototype.initialize = function(options) {
        /*
              Internal: Initialize a new directory node. Adds associated model cid to the
                        view element. Binds change handler to the `change:open` event that
                        toggles the display of directory contents. Binds change handler to
                        the `change:name` event that re-renders a sorted file tree.
        
              * options - Passes in settings object, which is used for access to the
                          tree view root in order to proxy events to it.
        */
        var _this = this;
        this.settings = options.settings;
        this.$el.attr('data-cid', this.model.cid);
        this.model.bind('change:open', function(model, open) {
          return _this.displayChildren(open);
        });
        this.model.bind('change:name', function(model, name) {
          var treeView;
          treeView = _this.settings.get('treeView');
          return treeView.render().trigger('rename', model, name);
        });
        this.model.collection.bind('add', this.render);
        this.model.collection.bind('remove', function(model, collection) {
          _this.settings.get('treeView').trigger('remove', model);
          return _this.render();
        });
        return this.displayChildren(this.model.get('open'));
      };

      Directory.prototype.appendView = function(node) {
        /*
              Internal: Appends a view based on the underlying node model to this view.
        
              node - A Node model. Either a File or a Directory. This is the model the
                     created view will be associated with.
        */
        var view;
        view = this.settings.get('treeView').findOrCreateView(node);
        return this.$el.append(view.render().$el);
      };

      Directory.prototype.render = function() {
        /*
              Internal: Set the text of the view element based on the underlying model name.
        
              Returns `this` view.
        */        this.$el.text(this.model.get('name'));
        this.model.collection.sort().each(this.appendView);
        return this;
      };

      Directory.prototype.displayChildren = function(open) {
        /*
              Internal: Toggles display of the children Files or Diretories of this view.
        */
        var fileDirChildren;
        fileDirChildren = this.$el.children('.directory, .file');
        this.$el.toggleClass('open', open);
        return fileDirChildren.toggle(open);
      };

      return Directory;

    })(Backbone.View);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Views", function(Views) {
    return Views.File = (function(_super) {

      __extends(File, _super);

      function File() {
        this.render = __bind(this.render, this);
        File.__super__.constructor.apply(this, arguments);
      }

      /*
          Internal: View that renders a File node and controls its behavior (class: 'file', tag: 'li').
      */

      File.prototype.className = 'file';

      File.prototype.tagName = 'li';

      File.prototype.initialize = function(options) {
        /*
              Internal: Initialize a new file node. Adds associated model cid to the
                        view element. Binds change handlers to the `change:name` and
                        `change:extension` events. These take care of resorting the file
                        nodes.
        
              * options - Passes in settings object, which is used to control
                          whether or not file extensions are shown.
        */
        var _this = this;
        this.settings = options.settings;
        this.$el.attr('data-cid', this.model.cid).addClass(this.model.get('extension'));
        this.model.bind('change:name', function(model, name) {
          var treeView;
          treeView = _this.settings.get('treeView');
          return treeView.render().trigger('rename', model, model.nameWithExtension());
        });
        return this.model.bind('change:extension', function(model, extension) {
          var treeView;
          _this.$el.attr('class', "file " + extension);
          treeView = _this.settings.get('treeView');
          return treeView.render().trigger('rename', model, model.nameWithExtension());
        });
      };

      File.prototype.render = function() {
        /*
              Internal: Sets the text of the file node according to the underlying model
                        name. If the 'showExtensions' setting is set, renders the
                        full file name with extension, otherwise renders just the file
                        name attribute.
        */        if (this.settings.get('showExtensions')) {
          this.$el.text(this.model.nameWithExtension());
        } else {
          this.$el.text(this.model.get('name'));
        }
        return this;
      };

      return File;

    })(Backbone.View);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Views", function(Views) {
    return Views.Menu = (function(_super) {

      __extends(Menu, _super);

      function Menu() {
        this.render = __bind(this.render, this);
        this.rename = __bind(this.rename, this);
        this["delete"] = __bind(this["delete"], this);
        this.contextMenu = __bind(this.contextMenu, this);
        Menu.__super__.constructor.apply(this, arguments);
      }

      /*
          Internal: View that controls the context menu (class: 'filetree\_context\_menu').
      
          Events
      
          * contextMenu   - Prevents the standard browser context menu from appearing
                            when right clicking within the file tree context menu.
      
          * click .rename - Prompts the user to rename a file.
      
          * click .delete - Deletes a node from the file tree.
      */

      Menu.prototype.className = 'filetree_context_menu';

      Menu.prototype.events = {
        'contextmenu': 'contextMenu',
        'click .rename': 'rename',
        'click .delete': 'delete'
      };

      Menu.prototype.initialize = function(options) {
        /*
              Internal: Initialize a new menu widget.
        
              * options - An Object. Internally used to pass the settings configuration
                          into the menu. This controls whether or not the user is
                          prompted to confirm deleting a file.
        */        return this.settings = options.settings;
      };

      Menu.prototype.contextMenu = function(e) {
        /*
              Internal: Kill the default browser behavior for the contextmenu event.
        */        e.preventDefault();
        return e.stopPropagation();
      };

      Menu.prototype["delete"] = function(e) {
        /*
              Internal: Deletes a node from the file tree. If the confirmDeletes setting
                        is set, prompts the user for delete confirmation.
        */        if (this.settings.get('confirmDeletes')) {
          if (confirm("Are you sure you want to delete '" + (this.model.nameWithExtension()) + "'?")) {
            this.model.destroy();
          }
        } else {
          this.model.destroy();
        }
        return this.$el.hide();
      };

      Menu.prototype.rename = function(e) {
        /*
              Internal: Prompts the user to rename a File or Directory.
        */
        var extension, fileName, newName, _ref;
        if (newName = prompt("New Name", this.model.nameWithExtension())) {
          _ref = newName.split("."), fileName = _ref[0], extension = _ref[1];
          if (extension == null) extension = "";
          this.model.set({
            name: fileName,
            extension: extension
          });
        }
        return this.$el.hide();
      };

      Menu.prototype.render = function() {
        /*
              Internal: Renders the <ul> that contains the context menu choices
                        'Rename' and 'Delete'.
        
              Returns `this`, the menu view.
        */        this.$el.html(this.template());
        return this;
      };

      Menu.prototype.template = function() {
        /*
              Internal: html template for the context menu.
        */        return "<ul>\n  <li class='rename'>Rename</li>\n  <hr/>\n  <li class='delete'>Delete</li>\n</ul>";
      };

      return Menu;

    })(Backbone.View);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  BoneTree.namespace("BoneTree.Views", function(Views) {
    var Models;
    Models = BoneTree.Models;
    return Views.Tree = (function(_super) {

      __extends(Tree, _super);

      function Tree() {
        this.render = __bind(this.render, this);
        this.openFile = __bind(this.openFile, this);
        this.openDirectory = __bind(this.openDirectory, this);
        this.getModelFromClick = __bind(this.getModelFromClick, this);
        this.toAscii = __bind(this.toAscii, this);
        this.getFiles = __bind(this.getFiles, this);
        this.getFile = __bind(this.getFile, this);
        this.getDirectory = __bind(this.getDirectory, this);
        this.flatten = __bind(this.flatten, this);
        this.filterNodes = __bind(this.filterNodes, this);
        this.contextMenu = __bind(this.contextMenu, this);
        this.closeMenu = __bind(this.closeMenu, this);
        this.closeDirectories = __bind(this.closeDirectories, this);
        this.getModelByCid = __bind(this.getModelByCid, this);
        this.findOrCreateView = __bind(this.findOrCreateView, this);
        this.addToTree = __bind(this.addToTree, this);
        this.addFromJSON = __bind(this.addFromJSON, this);
        this.addFile = __bind(this.addFile, this);
        Tree.__super__.constructor.apply(this, arguments);
      }

      /*
          Public: The base tree object. Events from other objects are proxied to the tree
                  so API consumers only need to know about this top level object.
      */

      Tree.prototype.className = 'tree';

      Tree.prototype.events = {
        'contextmenu .file': 'contextMenu',
        'contextmenu .directory': 'contextMenu',
        'click .directory': 'openDirectory',
        'click .file': 'openFile'
      };

      Tree.prototype.initialize = function() {
        /*
              Public: Initialize a new filetree widget
        
              * options          - An Object of global configuration options for the file tree.
                * autoOpenFiles  - A Boolean. If true, each file that is added to the tree
                                   immediately triggers an `openFile` event (default: true).
                * beforeAdd      - A Function that is invoked before each file is added to the tree.
                                   It is passed the raw file attributes and should return true if
                                   that file should be added to the tree and false if not. The
                                   default implementation is to return true.
                * confirmDeletes - A Boolean. If true, the tree will prompt the user, making
                                   sure they want to delete the file (default: false).
                * showExtensions - A Boolean. If true, files display their extensions. Internally,
                                   extensions are always kept track of but by default they are
                                   hidden (default: false).
        */
        var settingsConfig,
          _this = this;
        $(document).click(this.closeMenu);
        this._currentFileData = null;
        if (this.options.beforeAdd != null) {
          this.beforeAdd = this.options.beforeAdd;
        }
        settingsConfig = _.extend({}, this.options, {
          treeView: this
        });
        this.settings = new Models.Settings(settingsConfig);
        this.menuView = new Views.Menu({
          settings: this.settings
        });
        this.menuView.render().$el.appendTo($('body'));
        this.root = new Models.Node;
        this.root.collection.bind('add', this.render);
        return this.root.collection.bind('remove', function(model, collection) {
          _this.$("[data-cid='" + model.cid + "']").remove();
          _this.render();
          return _this.trigger('remove', model);
        });
      };

      Tree.prototype.addFile = function(filePath, fileData, triggerAutoOpen) {
        var dirs, fileName, _i, _ref;
        if (fileData == null) fileData = {};
        if (triggerAutoOpen == null) triggerAutoOpen = true;
        /*
              Public: Method to add files and associated file data to the tree.
        
              * filePath - A String that represents the directory path to the file.
                           Directories that don't yet exist will be created. If no
                           file is specified, eg. '/dir1/dir2/' then only the directories
                           will be created and this method will return null.
              * fileData - An Object of attributes to store in the File object. This
                           could represent information such as lastModified, fileContents,
                           fileCreator, etc.
        
              Examples
        
                  tree.addFile '/source/main.coffee',
                    contents: "alert('hello world.')"
                    lastModified: 1330725130170
                  # => <File>
        
              Returns the File object if it was created and null if no file was given.
        */
        this._currentFileData = _.extend(fileData, {
          _path: filePath
        });
        if (filePath[0] === '/') filePath = filePath.replace('/', '');
        _ref = filePath.split("/"), dirs = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), fileName = _ref[_i++];
        return this.addToTree(this.root, dirs, fileName, triggerAutoOpen);
      };

      Tree.prototype.addFromJSON = function(data, currentPath) {
        var file, name, _i, _len, _ref;
        if (currentPath == null) currentPath = "";
        /*
              Public: Creates a file tree from a JSON representation. Expects the
                      JSON object to have a `name` property at each level, specifying
                      the name of the file or directory, and a files array if the
                      current node has child directories or files.
        
              * data        - An Object that represents hierarchical file data.
        
              * currentPath - A String representing the current location in the tree.
                              Defaults to the file tree root. (default: "")
        
              Examples
        
                  data = {
                    name: "My Project"
                    files: [
                      { name: "Empty Folder" }
                      { name: "SomeFile.coffee" }
                      { name: "AnotherFile.coffee" }
                      {
                        name: "Folder with Files inside"
                        files: [
                          { name: "NestedFile.coffee" }
                        ]
                      }
                    ]
                  }
        
                  tree.addFromJSON(data)
                  # => <Tree>
        
              Returns the Tree view object.
        */
        name = "";
        if (data.name != null) {
          name = data.name + '/';
          delete data.name;
        }
        if (data.extension != null) {
          name = name.replace('/', '.' + data.extension);
          delete data.extension;
        }
        currentPath += name;
        if (data.files != null) {
          _ref = data.files;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            this.addFromJSON(file, currentPath);
          }
        } else {
          this.addFile(currentPath, data);
        }
        return this;
      };

      Tree.prototype.addToTree = function(currentDirectory, remainingDirectories, fileName, triggerAutoOpen) {
        var file, matchingDirectory, newDirectory, newNode, nextDirectoryName;
        if (triggerAutoOpen == null) triggerAutoOpen = true;
        /*
              Internal: Recursive method that traverses nodes, creating
                        Files and Directories.
        
              * currentDirectory     - A Node object representing which directory we are
                                       adding the current Directory or File to.
              * remainingDirectories - A '/' separated String representing the remaining
                                       directories to add.
              * fileName             - The String name of the file to be added. This can
                                       include the extension name separated by a '.'.
        
              Examples
        
                  tree.addToTree(@root, '/source/subdirectory/', 'main.coffee')
                  # => <File>
        
              Returns the File object if it was created and null if no file was given.
        */
        if (remainingDirectories.length) {
          nextDirectoryName = remainingDirectories.shift();
          if (matchingDirectory = Models.Directory.find(currentDirectory, nextDirectoryName)) {
            matchingDirectory.set({
              open: true
            });
            return this.addToTree(matchingDirectory, remainingDirectories, fileName, triggerAutoOpen);
          } else {
            newNode = new Models.Directory({
              name: nextDirectoryName,
              open: true
            });
            newDirectory = currentDirectory.collection.add(newNode);
            return this.addToTree(newNode, remainingDirectories, fileName, triggerAutoOpen);
          }
        } else {
          if (fileName === "") return null;
          if (this.beforeAdd(this._currentFileData)) {
            file = Models.File.createFromFileName(fileName, this._currentFileData);
            this._currentFileData = null;
            currentDirectory.collection.add(file);
            if (this.settings.get('autoOpenFiles') && triggerAutoOpen) {
              this.trigger('openFile', file);
            }
            return file;
          }
        }
      };

      Tree.prototype.beforeAdd = function(fileData) {
        /*
              Internal: This function provides a filter to exclude files from the
                        file tree based on conditions from their raw data. This function
                        shouldn't be modified directly, it should instead by passed in
                        as an option when instantiating the file tree. The default
                        implementation is to return true and allow all files to be
                        added to the tree.
        
              * fileData - An Object containing the raw attributes of the file to be
                           created. Use these to determine conditions to allow or
                           exclude files from the tree.
        
              Examples
        
                  # set up a beforeAdd filter on the tree view
                  tree = new BoneTree.Views.Tree
                    beforeAdd: (fileData) ->
                      if fileData.extension is 'wav'
                        return false
                      else
                        return true
        
              Returns true if the file should be added to the tree and false otherwise.
        */        return true;
      };

      Tree.prototype.findOrCreateView = function(node) {
        /*
              Internal: Look up existing view in the view cache or Create a new view
                        of the correct type (either File or Directory).
        
              * node - A Node object. Either a File object or a Directory object.
                       This is the model that the view will be associated with.
        
              Examples
        
                  file = new BoneTree.Models.File
        
                  # This will create a new view since we just created the File
                  tree.findOrCreateView(file)
                  # => <FileView>
        
              Returns the view corresponding to the model passed in.
        */
        var type, view, viewCache;
        type = node.constantize();
        viewCache = this.settings.get('viewCache');
        if (!(view = viewCache[node.cid])) {
          view = viewCache[node.cid] = new Views[type]({
            model: node,
            settings: this.settings
          });
        }
        return view;
      };

      Tree.prototype.getModelByCid = function(cid) {
        var modelCid, view, viewCache;
        viewCache = this.settings.get('viewCache');
        for (modelCid in viewCache) {
          view = viewCache[modelCid];
          if (modelCid === cid) return view.model;
        }
      };

      Tree.prototype.closeDirectories = function() {
        /*
              Public: Close all the directories in the file tree.
        
              Examples
        
                  tree.closeDirectories()
                  # => <Tree>
        
              Returns the Tree view object.
        */
        var directories;
        directories = _.filter(this.flatten(), function(node) {
          return node.get('nodeType') === 'directory';
        });
        _.invoke(directories, 'set', {
          open: false
        });
        return this;
      };

      Tree.prototype.closeMenu = function(e) {
        /*
              Internal: Close the context menu. This is called every click on
                        the document and closes the menu unless you are clicking
                        within it. This shouldn't be called directly, it is called
                        automatically by Backbone from user interactions.
        
              Returns the Menu view object.
        */        if (!$(e.currentTarget).is('.menu')) this.menuView.$el.hide();
        return this.menuView;
      };

      Tree.prototype.contextMenu = function(e) {
        /*
              Internal: Open the context menu. This prevents the default browser
                        context menu event. This shouldn't be called directly, it is
                        called automatically by Backbone from user interations.
        
              Returns the Menu view object.
        */
        var model;
        e.preventDefault();
        model = this.getModelFromClick(e);
        this.menuView.model = model;
        this.menuView.$el.css({
          left: e.pageX,
          top: e.pageY
        }).show();
        return this.menuView;
      };

      Tree.prototype.filterNodes = function(nodeType, nodeName) {
        /*
              Internal: Returns file tree nodes that match the nodeType and nodeName.
        
              * nodeType - A String that represents the nodeType to match. Choices are
                           'file' or 'directory'.
              * nodeName - A String that represents the name of the node to match.
        
              Examples
        
                  # Add some files to the tree
                  tree.addFile('/source/main.coffee')
                  tree.addFile('/source/player.coffee')
        
                  # returns an array containing the File 'main.coffee'
                  tree.filterNodes('file', 'main')
                  # => [<File>]
        
              Returns an Array of nodes that match the filter criteria.
        */
        var results,
          _this = this;
        results = _.filter(this.flatten(), function(node) {
          return node.get('nodeType') === nodeType && node.get('name') === nodeName;
        });
        return results;
      };

      Tree.prototype.flatten = function(currentNode, results) {
        var _this = this;
        if (currentNode == null) currentNode = this.root;
        if (results == null) results = [];
        /*
              Internal: Returns a one dimensional ordered array representing the
                        Directory and File nodes in the tree.
        
              * currentNode - The node to start at when flattening
              * nodeName - A String that represents the name of the node to match.
        
              Examples
        
                  # Add some files to the tree
                  tree.addFile('/source/main.coffee')
                  tree.addFile('/source/player.coffee')
        
                  # returns an array containing the File 'main.coffee'
                  tree.filterNodes('file', 'main')
                  # => [<File>]
        
              Returns an Array of nodes that match the filter criteria.
        */
        currentNode.collection.each(function(node) {
          results.push(node);
          if (node.collection.length) return _this.flatten(node, results);
        });
        return results;
      };

      Tree.prototype.getDirectory = function(directoryName) {
        /*
              Public: Returns an array of directories matching the given directoryName.
        
              * directoryName - A String naming the directory to match.
        
              Examples
        
                  # Add some files to the tree
                  tree.addFile('/source/main.coffee')
                  tree.addFile('/source/player.coffee')
                  tree.addFile('/directory2/file.coffee')
        
                  # returns an array containing the Directory 'source'
                  tree.getDirectory('source')
                  # => [<Directory>]
        
              Returns an Array of Directory nodes that match directoryName.
        */        return this.filterNodes('directory', directoryName);
      };

      Tree.prototype.getFile = function(filePath) {
        /*
              Public: Returns a file at the specified location.
        
              * fileName - A String describing the file path.
        
              Examples
        
                  # Add some files to the tree
                  tree.addFile('/source/main.coffee')
                  tree.addFile('/source/player.coffee')
                  tree.addFile('/directory2/main.coffee')
        
                  # returns an array containing both the files named main.
                  tree.getFile('source/main.coffee')
                  # => <File>
        
              Returns a File at the given location.
        */
        var filtered, nodes;
        if (filePath[0] === '/') filePath = filePath.replace('/', '');
        nodes = this.flatten();
        filtered = _.filter(nodes, function(node) {
          return node.get('nodeType') === 'file' && node.get('_path') === filePath;
        });
        return filtered[0];
      };

      Tree.prototype.getFiles = function(directoryName) {
        /*
              Public: Returns an array of files contained within the directory
                      matching directoryName.
        
              * directoryName - A String naming the directory to look inside.
        
              Examples
        
                  # Add some files to the tree
                  tree.addFile('/source/main.coffee')
                  tree.addFile('/source/player.coffee')
                  tree.addFile('/directory2/main.coffee')
        
                  # returns an array containing the files 'player.coffee' and 'main.coffee'
                  tree.getFiles('source')
                  # => [<File>, <File>]
        
              Returns an Array of File nodes that are contained in the
              Directory matching directoryName.
        */
        var directory, nodesInDirectory;
        directory = this.getDirectory(directoryName)[0];
        if (!directory) return [];
        nodesInDirectory = this.flatten(directory);
        return _.filter(nodesInDirectory, function(node) {
          return node.get('nodeType') === 'file';
        });
      };

      Tree.prototype.toAscii = function(collection, indentation, output) {
        var n, rootCollection, spaces,
          _this = this;
        if (indentation == null) indentation = 0;
        if (output == null) output = "\n";
        /*
              Internal: A String representation of the filetree.
        
              * collection  - A NodeCollection object describing which folder to start at.
              * indentation - A Number describing how many spaces to indent the next filetree element (default: 0).
              * output      - A String representing the current filetree output (default: "\n").
        
              Examples
        
                  # Add some files to the tree
                  tree.addFile('/source/main.coffee')
                  tree.addFile('/source/player.coffee')
                  tree.addFile('/directory2/main.coffee')
        
                  tree.toAscii()
                  # => "
                    -directory2
                     -main.coffee
                    -source
                     -main.coffee
                     -player.coffee
                  "
        
        
              Returns a String representation of the sorted nodes of the file tree.
        */
        rootCollection = collection || this.root.collection;
        spaces = "";
        for (n = 0; 0 <= indentation ? n <= indentation : n >= indentation; 0 <= indentation ? n++ : n--) {
          spaces += " ";
        }
        rootCollection.each(function(nodes) {
          var typeChar;
          typeChar = nodes.get('type') === 'directory' ? '+' : '-';
          output += spaces + typeChar + nodes.nameWithExtension() + '\n';
          return output = _this.toAscii(nodes.collection, indentation + 1, output);
        });
        return output;
      };

      Tree.prototype.getModelFromClick = function(e) {
        /*
              Internal: Look up a model based on the cid of the clicked view element.
        
              Returns the Node corresponding to the view element that the user clicked on.
        */
        var cid;
        e.stopPropagation();
        this.menuView.$el.hide();
        cid = $(e.currentTarget).data('cid');
        return this.getModelByCid(cid);
      };

      Tree.prototype.openDirectory = function(e) {
        /*
              Internal: Toggle the directory icon and display the contents of the clicked Directory.
        */
        var model;
        model = this.getModelFromClick(e);
        return model.toggleOpen();
      };

      Tree.prototype.openFile = function(e) {
        /*
              Internal: Trigger the 'openFile' event, passing in the file corresponding
                        to the view element that the user clicked.
        */
        var model;
        model = this.getModelFromClick(e);
        return this.trigger('openFile', model);
      };

      Tree.prototype.render = function() {
        /*
              Internal: Call render on each of the nodes underneath the root node.
                        Also calls sort on each of the subcollections.
        */
        var _this = this;
        this.root.collection.sort().each(function(node) {
          var view;
          node.collection.sort();
          view = _this.findOrCreateView(node);
          return _this.$el.append(view.render().$el);
        });
        return this;
      };

      return Tree;

    })(Backbone.View);
  });

}).call(this);
(function() {



}).call(this);
