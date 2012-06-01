(function() {
  var __slice = [].slice;

  window.BoneTree || (window.BoneTree = {});

  BoneTree.namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref1;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref1 = name.split('.');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      item = _ref1[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Models", function(Models) {
    Models.Node = (function(_super) {

      __extends(Node, _super);

      function Node() {
        this.name = __bind(this.name, this);

        this.isFile = __bind(this.isFile, this);

        this.isDirectory = __bind(this.isDirectory, this);
        return Node.__super__.constructor.apply(this, arguments);
      }

      Node.prototype.initialize = function() {
        return this.collection = new Models.Nodes;
      };

      Node.prototype.isDirectory = function() {
        return this instanceof Models.Directory;
      };

      Node.prototype.isFile = function() {
        return this instanceof Models.File;
      };

      Node.prototype.name = function() {
        return this.get('path').split('/').last();
      };

      return Node;

    })(Backbone.Model);
    return Models.Nodes = (function(_super) {

      __extends(Nodes, _super);

      function Nodes() {
        return Nodes.__super__.constructor.apply(this, arguments);
      }

      Nodes.prototype.comparator = function(node) {
        var sortPriority;
        if (node.isDirectory()) {
          sortPriority = 0;
        } else {
          sortPriority = 1;
        }
        return sortPriority + node.name();
      };

      Nodes.prototype.model = Models.Node;

      return Nodes;

    })(Backbone.Collection);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  BoneTree.namespace("BoneTree.Models", function(Models) {
    return Models.Directory = (function(_super) {

      __extends(Directory, _super);

      function Directory() {
        this.updateChildren = __bind(this.updateChildren, this);

        this.toAscii = __bind(this.toAscii, this);

        this.toArray = __bind(this.toArray, this);

        this.getFile = __bind(this.getFile, this);

        this.files = __bind(this.files, this);

        this.getDirectory = __bind(this.getDirectory, this);

        this.directories = __bind(this.directories, this);

        this.remove = __bind(this.remove, this);

        this.add = __bind(this.add, this);
        return Directory.__super__.constructor.apply(this, arguments);
      }

      Directory.prototype.add = function(filePath, fileData) {
        var Directory, File, currentDirectory, dirs, file, fileName, _i, _ref;
        if (fileData == null) {
          fileData = {};
        }
        Directory = Models.Directory, File = Models.File;
        _ref = filePath.split('/'), dirs = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), fileName = _ref[_i++];
        currentDirectory = this;
        dirs.each(function(directoryName) {
          var directory;
          if (directoryName === '') {
            return;
          }
          directory = currentDirectory.directories().select(function(dir) {
            return dir.name() === directoryName;
          }).first();
          if (!directory) {
            directory = new Directory({
              path: filePath.substring(0, filePath.indexOf(directoryName) + directoryName.length)
            });
            currentDirectory.collection.add(directory);
          }
          return currentDirectory = directory;
        });
        if (file = currentDirectory.getFile(fileName)) {
          return file.set(fileData);
        } else {
          file = new File(_.extend(fileData, {
            path: filePath
          }));
          currentDirectory.collection.add(file);
          return file;
        }
      };

      Directory.prototype.remove = function(path) {
        var directory, file;
        if (file = this.getFile(path)) {
          return file.destroy();
        } else if (directory = this.getDirectory(path)) {
          return directory.destroy();
        }
      };

      Directory.prototype.directories = function() {
        return this.collection.filter(function(node) {
          return node.isDirectory();
        });
      };

      Directory.prototype.getDirectory = function(directoryPath) {
        var first, match, rest, _ref;
        _ref = directoryPath.split('/'), first = _ref[0], rest = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
        match = this.collection.find(function(node) {
          return node.name() === first;
        });
        if (match != null ? match.isDirectory() : void 0) {
          if (rest.length) {
            return match.getDirectory(rest.join('/'));
          } else {
            return match;
          }
        }
        return void 0;
      };

      Directory.prototype.files = function() {
        return this.collection.filter(function(node) {
          return node.isFile();
        });
      };

      Directory.prototype.getFile = function(filePath) {
        var first, match, rest, _ref;
        _ref = filePath.split('/'), first = _ref[0], rest = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
        match = this.collection.find(function(node) {
          return node.name() === first;
        });
        if (match != null ? match.isDirectory() : void 0) {
          if (rest.length) {
            return match.getFile(rest.join('/'));
          } else {
            return void 0;
          }
        } else {
          return match;
        }
      };

      Directory.prototype.toArray = function() {
        var results,
          _this = this;
        results = [this];
        this.collection.each(function(node) {
          return results = results.concat(node.toArray());
        });
        return results;
      };

      Directory.prototype.toAscii = function(indentation) {
        var nodeAscii;
        if (indentation == null) {
          indentation = '';
        }
        nodeAscii = ["" + indentation + "+" + (this.name())];
        this.collection.each(function(node) {
          return nodeAscii.push(node.toAscii(indentation + ' '));
        });
        return nodeAscii.join('\n');
      };

      Directory.prototype.updateChildren = function(previousPath, newPath) {
        var directoryPath,
          _this = this;
        this.directories().each(function(directory) {
          return directory.updateChildren(previousPath, newPath);
        });
        directoryPath = this.get('path');
        if (directoryPath.indexOf(newPath) === -1) {
          this.set({
            path: this.get('path').replace(previousPath, newPath)
          });
        }
        return this.files().each(function(file) {
          var filePath;
          filePath = file.get('path');
          if (filePath.indexOf(newPath) === -1) {
            return file.set({
              path: file.get('path').replace(previousPath, newPath)
            });
          }
        });
      };

      return Directory;

    })(Models.Node);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Models", function(Models) {
    return Models.File = (function(_super) {

      __extends(File, _super);

      function File() {
        this.toAscii = __bind(this.toAscii, this);

        this.toArray = __bind(this.toArray, this);
        return File.__super__.constructor.apply(this, arguments);
      }

      File.prototype.toArray = function() {
        return [this];
      };

      File.prototype.toAscii = function(indentation) {
        if (indentation == null) {
          indentation = '';
        }
        return "" + indentation + "-" + (this.name());
      };

      return File;

    })(Models.Node);
  });

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Models", function(Models) {
    return Models.Settings = (function(_super) {

      __extends(Settings, _super);

      function Settings() {
        return Settings.__super__.constructor.apply(this, arguments);
      }

      Settings.prototype.defaults = {
        confirmDeletes: false,
        showExtensions: false
      };

      return Settings;

    })(Backbone.Model);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Views", function(Views) {
    return Views.Directory = (function(_super) {

      __extends(Directory, _super);

      function Directory() {
        this.toggleOpen = __bind(this.toggleOpen, this);

        this.displayChildren = __bind(this.displayChildren, this);

        this.render = __bind(this.render, this);

        this.appendView = __bind(this.appendView, this);
        return Directory.__super__.constructor.apply(this, arguments);
      }

      Directory.prototype.className = 'directory';

      Directory.prototype.tagName = 'ul';

      Directory.prototype.initialize = function(options) {
        var _this = this;
        this.tree = options.tree;
        this.$el.attr('data-cid', this.model.cid);
        this.open = false;
        this.model.bind('change:path', function(model) {
          var newPath, path, previousPath;
          _this.tree.render().trigger('rename', model, name);
          previousPath = model.previous('path');
          if ((path = model.get('path')).indexOf('/') === 0) {
            newPath = path.replace('/', '');
          } else {
            newPath = path;
          }
          return model.updateChildren(previousPath, newPath);
        });
        this.model.collection.bind('add', this.render);
        this.model.collection.bind('remove', function(model, collection) {
          _this.tree.trigger('remove', model);
          return _this.render();
        });
        return this.displayChildren(this.open);
      };

      Directory.prototype.appendView = function(node) {
        var view;
        view = this.tree.findOrCreateView(node);
        return this.$el.append(view.render().$el);
      };

      Directory.prototype.render = function() {
        this.$el.text(this.model.name());
        this.model.collection.each(this.appendView);
        this.displayChildren(this.$el.hasClass('open'));
        return this;
      };

      Directory.prototype.displayChildren = function(open) {
        var fileDirChildren;
        fileDirChildren = this.$el.children('.directory, .file');
        this.$el.toggleClass('open', open);
        return fileDirChildren.toggle(open);
      };

      Directory.prototype.toggleOpen = function() {
        this.open = !this.open;
        return this.displayChildren(this.open);
      };

      return Directory;

    })(Backbone.View);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Views", function(Views) {
    return Views.File = (function(_super) {

      __extends(File, _super);

      function File() {
        this.render = __bind(this.render, this);
        return File.__super__.constructor.apply(this, arguments);
      }

      File.prototype.tagName = 'li';

      File.prototype.initialize = function(options) {
        var _this = this;
        this.settings = options.settings;
        this.tree = options.tree;
        return this.model.bind('change:path', function(model) {
          return _this.render();
        });
      };

      File.prototype.render = function() {
        var extension, name;
        name = this.model.name();
        extension = name.extension();
        this.$el.attr('data-cid', this.model.cid);
        this.$el.attr('class', "file " + extension);
        if (this.settings.get('showExtensions')) {
          this.$el.text(name);
        } else {
          this.$el.text(name.withoutExtension());
        }
        return this;
      };

      return File;

    })(Backbone.View);
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BoneTree.namespace("BoneTree.Views", function(Views) {
    var Models;
    Models = BoneTree.Models;
    return Views.Tree = (function(_super) {

      __extends(Tree, _super);

      function Tree() {
        this.render = __bind(this.render, this);

        this._openFile = __bind(this._openFile, this);

        this._openDirectory = __bind(this._openDirectory, this);

        this.getViewFromClick = __bind(this.getViewFromClick, this);

        this.toAscii = __bind(this.toAscii, this);

        this.getFile = __bind(this.getFile, this);

        this.getDirectory = __bind(this.getDirectory, this);

        this.toArray = __bind(this.toArray, this);

        this.findOrCreateView = __bind(this.findOrCreateView, this);

        this.remove = __bind(this.remove, this);

        this.add = __bind(this.add, this);
        return Tree.__super__.constructor.apply(this, arguments);
      }

      Tree.prototype.className = 'tree';

      Tree.prototype.events = {
        'mousedown .directory': '_openDirectory',
        'mousedown .file': '_openFile'
      };

      Tree.prototype.initialize = function() {
        var _this = this;
        this.viewCache = {};
        this.settings = new Models.Settings(this.options);
        this.root = new Models.Directory({
          path: '/'
        });
        this.root.collection.bind('add', this.render);
        return this.root.collection.bind('remove', function(model, collection) {
          _this.$("[data-cid='" + model.cid + "']").remove();
          _this.render();
          return _this.trigger('remove', model);
        });
      };

      Tree.prototype.add = function(filePath, fileData) {
        var file, _i, _len, _results;
        if (Object.isArray(filePath)) {
          _results = [];
          for (_i = 0, _len = filePath.length; _i < _len; _i++) {
            file = filePath[_i];
            _results.push(this.add(file.path, file));
          }
          return _results;
        } else {
          return this.root.add(filePath, fileData);
        }
      };

      Tree.prototype.remove = function(path) {
        return this.root.remove(path);
      };

      Tree.prototype.findOrCreateView = function(node) {
        var type, view;
        if (node.isDirectory()) {
          type = 'Directory';
        } else {
          type = 'File';
        }
        if (!(view = this.viewCache[node.cid])) {
          view = this.viewCache[node.cid] = new Views[type]({
            model: node,
            settings: this.settings,
            tree: this
          });
        }
        return view;
      };

      Tree.prototype.toArray = function() {
        return this.root.toArray();
      };

      Tree.prototype.getDirectory = function(directoryPath) {
        return this.root.getDirectory(directoryPath);
      };

      Tree.prototype.getFile = function(filePath) {
        return this.root.getFile(filePath);
      };

      Tree.prototype.toAscii = function() {
        return '\n' + this.root.toAscii();
      };

      Tree.prototype.getViewFromClick = function(e) {
        var cid;
        e.stopPropagation();
        cid = $(e.currentTarget).data('cid');
        return this.viewCache[cid];
      };

      Tree.prototype._openDirectory = function(e) {
        var view;
        e.stopPropagation();
        view = this.getViewFromClick(e);
        return view.toggleOpen();
      };

      Tree.prototype._openFile = function(e) {
        var view;
        view = this.getViewFromClick(e);
        return this.trigger('openFile', view.model);
      };

      Tree.prototype.render = function() {
        var _this = this;
        this.root.collection.each(function(node) {
          var view;
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
