((function(){var a=Array.prototype.slice;window.BoneTree={},BoneTree.namespace=function(b,c,d){var e,f,g,h,i,j;arguments.length<3&&(i=[typeof exports!="undefined"?exports:window].concat(a.call(arguments)),b=i[0],c=i[1],d=i[2]),f=b,j=c.split(".");for(g=0,h=j.length;g<h;g++)e=j[g],b=b[e]||(b[e]={});return d(b,f)}})).call(this),function(){var a=Object.prototype.hasOwnProperty,b=function(b,c){function e(){this.constructor=b}for(var d in c)a.call(c,d)&&(b[d]=c[d]);return e.prototype=c.prototype,b.prototype=new e,b.__super__=c.prototype,b};BoneTree.namespace("BoneTree",function(a){return a.View=function(a){function c(){c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.initialize=function(){return this.el=$(this.el),this.settings=this.options.settings,this.editor=this.options.editor},c}(Backbone.View)})}.call(this),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b=Object.prototype.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a};BoneTree.namespace("BoneTree.Models",function(b){return b.Node=function(d){function e(){this.nameWithExtension=a(this.nameWithExtension,this),this.constantize=a(this.constantize,this),e.__super__.constructor.apply(this,arguments)}return c(e,d),e.prototype.initialize=function(){return this.collection=new b.Nodes},e.prototype.constantize=function(){var a;return a=this.get("type"),a[0].toUpperCase()+a.slice(1,a.length+1||9e9)},e.prototype.nameWithExtension=function(){var a;return a=this.get("extension")?"."+this.get("extension"):"",this.get("name")+a},e}(Backbone.Model),b.Nodes=function(a){function d(){d.__super__.constructor.apply(this,arguments)}return c(d,a),d.prototype.comparator=function(a){var b,c;return b=a.get("name"),c=a.get("sortPriority"),c+b},d.prototype.model=b.Node,d}(Backbone.Collection)})}.call(this),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b=Object.prototype.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a};BoneTree.namespace("BoneTree.Models",function(b){return b.Directory=function(b){function d(){this.toggleOpen=a(this.toggleOpen,this),d.__super__.constructor.apply(this,arguments)}return c(d,b),d.prototype.defaults={name:"New Directory",sortPriority:"0",type:"directory"},d.prototype.toggleOpen=function(){var a;return a=this.get("open"),this.set({open:!a})},d}(b.Node)})}.call(this),function(){var a=Object.prototype.hasOwnProperty,b=function(b,c){function e(){this.constructor=b}for(var d in c)a.call(c,d)&&(b[d]=c[d]);return e.prototype=c.prototype,b.prototype=new e,b.__super__=c.prototype,b};BoneTree.namespace("BoneTree.Models",function(a){return a.File=function(a){function c(){c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.defaults={name:"New File",sortPriority:"1",type:"file"},c}(a.Node)})}.call(this),function(){var a=Object.prototype.hasOwnProperty,b=function(b,c){function e(){this.constructor=b}for(var d in c)a.call(c,d)&&(b[d]=c[d]);return e.prototype=c.prototype,b.prototype=new e,b.__super__=c.prototype,b};BoneTree.namespace("BoneTree.Models",function(a){return a.Settings=function(a){function c(){c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.defaults={confirmDeletes:!0,showExtensions:!0,viewCache:{}},c}(Backbone.Model)})}.call(this),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b=Object.prototype.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a};BoneTree.namespace("BoneTree.Views",function(b){var d;return d=BoneTree.Models,b.Directory=function(b){function d(){this.toggleSubfolders=a(this.toggleSubfolders,this),this.toggleOpen=a(this.toggleOpen,this),this.render=a(this.render,this),this.appendView=a(this.appendView,this),d.__super__.constructor.apply(this,arguments)}return c(d,b),d.prototype.className="directory",d.prototype.tagName="ul",d.prototype.initialize=function(){var a=this;return d.__super__.initialize.apply(this,arguments),this.el.attr("data-cid",this.cid),this.model.bind("change:open",function(b,c){return a.toggleSubfolders(c)}),this.model.bind("change:name",function(b,c){return a.render(),a.settings.get("treeView").trigger("rename",b,c)}),this.model.collection.bind("add",this.render),this.model.collection.bind("remove",function(b,c){return a.settings.get("treeView").trigger("remove",b),a.render()})},d.prototype.appendView=function(a){var b;return b=this.settings.get("treeView").findView(a),this.model.set({open:!0}),this.el.append(b.render().el)},d.prototype.render=function(){return this.el.text(this.model.get("name")),this.model.collection.each(this.appendView),this},d.prototype.toggleOpen=function(a){return this.model.toggleOpen()},d.prototype.toggleSubfolders=function(a){var b;return b=this.el.children(".directory, .file"),this.el.toggleClass("open",a),b.toggle(a)},d}(BoneTree.View)})}.call(this),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b=Object.prototype.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a};BoneTree.namespace("BoneTree.Views",function(b){return b.File=function(b){function d(){this.render=a(this.render,this),d.__super__.constructor.apply(this,arguments)}return c(d,b),d.prototype.className="file",d.prototype.tagName="li",d.prototype.initialize=function(){var a=this;return d.__super__.initialize.apply(this,arguments),this.el.attr("data-cid",this.cid).addClass(this.model.get("extension")),this.model.bind("change:name",function(b,c){return a.settings.get("treeView").trigger("rename",b,b.nameWithExtension()),a.render()}),this.model.bind("change:extension",function(b,c){return a.el.attr("class","file "+c),a.settings.get("treeView").trigger("rename",b,b.nameWithExtension()),a.render()})},d.prototype.render=function(){return this.el.text(this.model.nameWithExtension()),this},d}(BoneTree.View)})}.call(this),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b=Object.prototype.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a};BoneTree.namespace("BoneTree.Views",function(b){return b.Menu=function(b){function d(){this.render=a(this.render,this),this.rename=a(this.rename,this),this["delete"]=a(this["delete"],this),d.__super__.constructor.apply(this,arguments)}return c(d,b),d.prototype.className="menu",d.prototype.events={"click .rename":"rename","click .delete":"delete"},d.prototype.initialize=function(){return d.__super__.initialize.apply(this,arguments)},d.prototype["delete"]=function(a){return this.settings.get("confirmDeletes")?confirm("Are you sure you want to delete '"+this.model.nameWithExtension()+"'?")&&this.model.destroy():this.model.destroy(),this.el.hide()},d.prototype.rename=function(a){var b,c,d,e,f;if(e=prompt("New Name",this.model.nameWithExtension()))f=e.split("."),d=f[0],c=f[1],b={name:d},c&&(b.extension=c),this.model.set(b);return this.el.hide()},d.prototype.render=function(){return this.el.html(this.htmlTemplate()),this},d.prototype.htmlTemplate=function(){return"<ul>\n  <li class='rename'>Rename</li>\n  <hr/>\n  <li class='delete'>Delete</li>\n</ul>"},d}(BoneTree.View)})}.call(this),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b=Object.prototype.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a},d=Array.prototype.slice;BoneTree.namespace("BoneTree.Views",function(b){var e;return e=BoneTree.Models,b.Tree=function(f){function g(){this.render=a(this.render,this),this.openFile=a(this.openFile,this),this.openDirectory=a(this.openDirectory,this),this.toAscii=a(this.toAscii,this),this.contextMenu=a(this.contextMenu,this),this.closeMenu=a(this.closeMenu,this),this.appendNode=a(this.appendNode,this),this.findView=a(this.findView,this),this.addToTree=a(this.addToTree,this),this.addFile=a(this.addFile,this),g.__super__.constructor.apply(this,arguments)}return c(g,f),g.prototype.className="tree",g.prototype.events={"contextmenu .file":"contextMenu","contextmenu .directory":"contextMenu","click .directory":"openDirectory","click .file":"openFile"},g.prototype.initialize=function(){var a=this;return g.__super__.initialize.apply(this,arguments),$(document).click(function(b){return a.closeMenu(b)}),this.settings=new e.Settings({treeView:this}),this.menuView=new b.Menu({settings:this.settings}),this.menuView.render().el.appendTo(this.el),this.root=new e.Node,this.root.collection.bind("add",this.render),this.root.collection.bind("remove",function(b,c){return a.settings.get("treeView").trigger("remove",b),a.render()})},g.prototype.addFile=function(a){var b,c,e,f;return a[0]==="/"&&(a=a.replace("/","")),f=a.split("/"),b=2<=f.length?d.call(f,0,e=f.length-1):(e=0,[]),c=f[e++],this.addToTree(this.root,b,c)},g.prototype.addToTree=function(a,b,c){var d,f,g,h,i,j,k;if(b.length)return j=b.shift(),(f=a.collection.find(function(a){return a.get("name")===j}))?this.addToTree(f,b,c):(i=new e.Directory({name:j}),h=a.collection.add(i),this.addToTree(i,b,c));if(c==="")return;return k=c.split("."),g=k[0],d=k[1],a.collection.add(new e.File({name:g,extension:d}))},g.prototype.findView=function(a){var c,d,e;return c=a.constantize(),e=this.settings.get("viewCache"),(d=e[a.cid])||(d=e[a.cid]=new b[c]({model:a,settings:this.settings})),d},g.prototype.appendNode=function(a){var b;return b=this.findView(a),this.el.append(b.render().el)},g.prototype.cacheFindByViewCid=function(a){var b,c,d;d=this.settings.get("viewCache");for(b in d){c=d[b];if(a===c.cid)return c}},g.prototype.closeMenu=function(a){if(!$(a.currentTarget).is(".menu"))return this.menuView.el.hide()},g.prototype.contextMenu=function(a){var b,c;return a.preventDefault(),a.stopPropagation(),b=$(a.currentTarget).data("cid"),c=this.cacheFindByViewCid(b),this.menuView.model=c.model,this.menuView.el.css({left:a.pageX,top:a.pageY}).show()},g.prototype.toAscii=function(a,b,c,d){var e,f,g,h=this;return c==null&&(c=0),d==null&&(d="\n"),f=a||this.root.collection,e=b||this.root,g="",c.times(function(){return g+=" "}),f.each(function(a){var b;return b=a.get("type")==="directory"?"+":"-",d+=g+b+a.nameWithExtension()+"\n",d=h.toAscii(a.collection,a,c+1,d)}),d},g.prototype.openDirectory=function(a){var b,c;return a.stopPropagation(),this.menuView.el.hide(),b=$(a.currentTarget).data("cid"),c=this.cacheFindByViewCid(b),c.toggleOpen()},g.prototype.openFile=function(a){var b,c;return a.stopPropagation(),this.menuView.el.hide(),b=$(a.currentTarget).data("cid"),c=this.cacheFindByViewCid(b),this.trigger("openFile",c.model)},g.prototype.render=function(){return this.$(".directory, .file").remove(),this.root.collection.each(this.appendNode)},g}(BoneTree.View)})}.call(this),function(){}.call(this)