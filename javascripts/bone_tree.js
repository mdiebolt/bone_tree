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

      Node.prototype.initialize = function() {
        return this.collection = new Models.Nodes;
      };

      Node.prototype.constantize = function() {
        var nodeType;
        nodeType = this.get('nodeType');
        return nodeType[0].toUpperCase() + nodeType.substring(1);
      };

      Node.prototype.nameWithExtension = function() {
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

      Nodes.prototype.comparator = function(node) {
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

      Directory.prototype.defaults = {
        name: "New Directory",
        open: false,
        sortPriority: "0",
        nodeType: "directory"
      };

      Directory.prototype.toggleOpen = function() {
        var currentState;
        currentState = this.get('open');
        return this.set({
          open: !currentState
        });
      };

      return Directory;

    })(Models.Node);
    return Models.Directory.find = function(currentDirectory, name) {
      return currentDirectory.collection.find(function(dir) {
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

      File.prototype.defaults = {
        name: "New File",
        sortPriority: "1",
        nodeType: "file"
      };

      return File;

    })(Models.Node);
    return Models.File.createFromFileName = function(fileName, fileData) {
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

      Directory.prototype.className = 'directory';

      Directory.prototype.tagName = 'ul';

      Directory.prototype.initialize = function(options) {
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
        var view;
        view = this.settings.get('treeView').findOrCreateView(node);
        return this.$el.append(view.render().$el);
      };

      Directory.prototype.render = function() {
        this.$el.text(this.model.get('name'));
        this.model.collection.sort().each(this.appendView);
        return this;
      };

      Directory.prototype.displayChildren = function(open) {
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

      File.prototype.className = 'file';

      File.prototype.tagName = 'li';

      File.prototype.initialize = function(options) {
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
        if (this.settings.get('showExtensions')) {
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

      Menu.prototype.className = 'filetree_context_menu';

      Menu.prototype.events = {
        'contextmenu': 'contextMenu',
        'click .rename': 'rename',
        'click .delete': 'delete'
      };

      Menu.prototype.initialize = function(options) {
        return this.settings = options.settings;
      };

      Menu.prototype.contextMenu = function(e) {
        e.preventDefault();
        return e.stopPropagation();
      };

      Menu.prototype["delete"] = function(e) {
        if (this.settings.get('confirmDeletes')) {
          if (confirm("Are you sure you want to delete '" + (this.model.nameWithExtension()) + "'?")) {
            this.model.destroy();
          }
        } else {
          this.model.destroy();
        }
        return this.$el.hide();
      };

      Menu.prototype.rename = function(e) {
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
        this.$el.html(this.template());
        return this;
      };

      Menu.prototype.template = function() {
        return "<ul>\n  <li class='rename'>Rename</li>\n  <hr/>\n  <li class='delete'>Delete</li>\n</ul>";
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

      Tree.prototype.className = 'tree';

      Tree.prototype.events = {
        'contextmenu .file': 'contextMenu',
        'contextmenu .directory': 'contextMenu',
        'click .directory': 'openDirectory',
        'click .file': 'openFile'
      };

      Tree.prototype.initialize = function() {
        var settingsConfig,
          _this = this;
        $(document).click(this.closeMenu);
        this._currentFileData = null;
        if (this.options.beforeAddFilter != null) {
          this.beforeAddFilter = this.options.beforeAddFilter;
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
          _this.render();
          return _this.trigger('remove', model);
        });
      };

      Tree.prototype.addFile = function(filePath, fileData) {
        var dirs, fileName, _i, _ref;
        this._currentFileData = fileData;
        if (filePath[0] === '/') filePath = filePath.replace('/', '');
        _ref = filePath.split("/"), dirs = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), fileName = _ref[_i++];
        return this.addToTree(this.root, dirs, fileName);
      };

      Tree.prototype.addFromJSON = function(data, currentPath) {
        var file, name, _i, _len, _ref, _results;
        if (currentPath == null) currentPath = "";
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
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            _results.push(this.addFromJSON(file, currentPath));
          }
          return _results;
        } else {
          return this.addFile(currentPath, data);
        }
      };

      Tree.prototype.addToTree = function(currentDirectory, remainingDirectories, fileName) {
        var file, matchingDirectory, newDirectory, newNode, nextDirectoryName;
        if (remainingDirectories.length) {
          nextDirectoryName = remainingDirectories.shift();
          if (matchingDirectory = Models.Directory.find(currentDirectory, nextDirectoryName)) {
            matchingDirectory.set({
              open: true
            });
            return this.addToTree(matchingDirectory, remainingDirectories, fileName);
          } else {
            newNode = new Models.Directory({
              name: nextDirectoryName,
              open: true
            });
            newDirectory = currentDirectory.collection.add(newNode);
            return this.addToTree(newNode, remainingDirectories, fileName);
          }
        } else {
          if (fileName === "") return null;
          if (this.beforeAddFilter(this._currentFileData)) {
            file = Models.File.createFromFileName(fileName, this._currentFileData);
            this._currentFileData = null;
            currentDirectory.collection.add(file);
            if (this.settings.get('autoOpenFiles')) this.trigger('openFile', file);
            return file;
          }
        }
      };

      Tree.prototype.beforeAddFilter = function(fileData) {
        return true;
      };

      Tree.prototype.findOrCreateView = function(node) {
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
        var directories;
        directories = _.filter(this.flatten(), function(node) {
          return node.get('nodeType') === 'directory';
        });
        return _.invoke(directories, 'set', {
          open: false
        });
      };

      Tree.prototype.closeMenu = function(e) {
        if (!$(e.currentTarget).is('.menu')) return this.menuView.$el.hide();
      };

      Tree.prototype.contextMenu = function(e) {
        var model;
        e.preventDefault();
        model = this.getModelFromClick(e);
        this.menuView.model = model;
        return this.menuView.$el.css({
          left: e.pageX,
          top: e.pageY
        }).show();
      };

      Tree.prototype.filterNodes = function(nodeType, nodeName) {
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
        currentNode.collection.each(function(node) {
          results.push(node);
          if (node.collection.length) return _this.flatten(node, results);
        });
        return results;
      };

      Tree.prototype.getDirectory = function(directoryName) {
        return this.filterNodes('directory', directoryName);
      };

      Tree.prototype.getFile = function(fileName) {
        return this.filterNodes('file', fileName);
      };

      Tree.prototype.getFiles = function(directoryName) {
        var directory, nodesInDirectory;
        directory = this.getDirectory(directoryName).first();
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
        var cid;
        e.stopPropagation();
        this.menuView.$el.hide();
        cid = $(e.currentTarget).data('cid');
        return this.getModelByCid(cid);
      };

      Tree.prototype.openDirectory = function(e) {
        var model;
        model = this.getModelFromClick(e);
        return model.toggleOpen();
      };

      Tree.prototype.openFile = function(e) {
        var model;
        model = this.getModelFromClick(e);
        return this.trigger('openFile', model);
      };

      Tree.prototype.render = function() {
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
