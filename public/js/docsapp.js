jQuery(function($){
  
  (function(docsapp){

    var Doc = Backbone.Model.extend({
      defaults: {
        code: 0,
        title: '',
        
        toDelete: false //not to be saved on server
      },
      
      validate: function(attrs, options) {
        var errors = [];
        
        if (attrs.code == '') {        
          errors.push({type: 'code', message: 'Введите "Код"'});
        }  
        if (isNaN(attrs.code)) {
          errors.push({type: 'code', message: 'Код должен быть числом'});          
        }
        if (attrs.title == '') {        
          errors.push({type: 'title', message: 'Введите "Наименование"'});
        }        
        
        return errors.length ? errors : false ;        
      },
      
      toggleDelete: function() {
        this.set({toDelete: !this.get("toDelete")});
      }    
    });
    
    var DocsList = Backbone.Collection.extend({
      model: Doc,
      sortField: 'code',
      codeSortOrder: 'asc',
      titleSortOrder: 'asc',      
      searchText: '',
      
      localStorage: new Store("docs"),
  
      toDelete: function() {
        return this.filter(function(model){ return model.get('toDelete'); });
      },
      
      search: function() {
        return this.filter(function(model){ return model.get('title').indexOf(this.searchText) == -1 ? false : true; }, this);
      },
      
      comparator: function(a,b) {
        var aComp, bComp;
        if(this.sortField == 'code') {
          aComp = parseInt(a.get(this.sortField), 10);
          bComp = parseInt(b.get(this.sortField), 10);        
        }
        else if(this.sortField == 'title'){
          aComp = a.get(this.sortField);
          bComp = b.get(this.sortField);
        }
        
        return this[this.sortField + 'SortOrder'] === 'asc' ? aComp > bComp : aComp < bComp;       
      }
    });

    var ErrorView = Backbone.View.extend({
      tagName: "div",
      className: "error",
      someErrors: false,
      
      initialize: function() {
        this.render();
      },      
      
      render: function() {
        docsapp.toolbarEl.append(this.el);
        
        return this;
      },
      
      showErrors: function(model, error) {
        $("<p></p>").appendTo(this.$el).append(_.pluck(model.validationError, 'message').join(', '));
        if(model.isNew()) {
          model.destroy();
        }
        this.someErrors = true;
      },
      
      hideErrors: function() {
        if(this.someErrors) {
          this.$el.empty();
        }
      }       
    });
  
    var DocView = Backbone.View.extend({
      tagName:  "tr",
  
      templateDocsList: docsapp.templates.docsList,
  
      events: {
        "dblclick td span"       : "edit",
        "change   .check"        : "toggleDelete",
        "click    .doc-delete"   : "destroy",
        
        "blur     td input"   : "close",        
        "keypress td input"   : "updateOnEnter"
      },
  
      initialize: function() {
        _.bindAll(this, 'render', 'edit', 'remove');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);
      },
  
      render: function() {
        if(this.model.isValid()) {
          var element = this.templateDocsList({
            doc: this.model.attributes,
            searchText: docsapp.searchingEnabled ? docsapp.searchView && docsapp.searchView.searchText : undefined,
            searchHighlight: docsapp.searchingEnabled ? docsapp.searchView && docsapp.searchView.searchHighlight : function() {},
            deletingEnabled: docsapp.deletingEnabled
          });
          this.$el.html(element);
        }
  
        return this;
      },
  
      toggleDelete: function() {
        this.model.toggleDelete();
      },
      
      edit: function(e) {
        if(docsapp.editingEnabled) {
          if(!this.editView) {
            this.editView = new DocEditView({model: this.model, el: this.el}).render();
          }
          this.editView.edit(e);
        }
      },
      
      close: function(e) {
        if(!this.editView) return;
        this.editView.close(e);
      },
      
      updateOnEnter: function(e) {
        if(!this.editView) return;
        this.editView.updateOnEnter(e);
      },    
  
      remove: function() {
        this.$el.remove();
      },
  
      destroy: function() {
        if(docsapp.deletingEnabled) {
          docsapp.deleteItemsView.destroy(this.model);
        }
      }
    });
  
    var DocEditView = Backbone.View.extend({
      edit: function(e) {
        var parentTd = $(e.target).parents("td");
        this.inputTitle = this.$(".title input");
        this.inputCode = this.$(".code input");       

        $(e.target).addClass("hidden");
        this.$('.doc-delete').addClass("hidden");
        if(parentTd.hasClass("code")) {
          $(this.inputCode).removeClass("hidden");
          this.inputCode.focus();
        }
        else if(parentTd.hasClass("title")) {
          $(this.inputTitle).removeClass("hidden");
          this.inputTitle.focus();
        }
        this.inputTitle.focus();
      },
  
      close: function(e) {
        docsapp.errorView.hideErrors();
        var newModel = this.model.save({title: this.inputTitle.val().trim(), code: this.inputCode.val().trim()});
        if(!newModel) {
          $(e.target).addClass("active");
          e.target.focus();
          docsapp.errorView.showErrors(this.model);
        }
        else {
          $(e.target).addClass("hidden");
          this.$("span, .doc-delete").removeClass("hidden");           
        }
      },
  
      updateOnEnter: function(e) {
        if (e.keyCode == 13) e.target.blur();
      }
    });
  
    var SortView = Backbone.View.extend({
      el: "#docs-table thead",
      sortedBy: '',
      addingItem: false,
      
      events: {
        "click th.code"   : "sortByCode",
        "click th.title"  : "sortByTitle"
      },
      
      sortByCode: function() {
        this.sortColumn('code');
      },
      
      sortByTitle: function() {
        this.sortColumn('title');
      },     
      
      sortColumn: function(sortField) {
        this.sortedBy = sortField;
        if(!this.addingItem) {
          this.collection.sortField = sortField;
          this.collection[sortField + 'SortOrder'] = this.collection[sortField + 'SortOrder'] === 'asc' ? 'desc' : 'asc';
  
          var arrow = this.collection[sortField + 'SortOrder'] === 'asc' ? '&darr;' : '&uarr;';
          this.$("." + sortField + " .sort-arrow").html(arrow);
          this.$("th:not(." + sortField + ")  .sort-arrow").html('&#8597;');
        }
        else {
          this.addingItem = false;
        }
        
        this.collection.sort();
        
        if(docsapp.searchView && docsapp.searchView.searchText) {
          docsapp.docsListView.clear();
          docsapp.searchView.docSearch();
        }
        else {
          docsapp.docsListView.addAll();
        }
      }
    });
    
    var SearchView = Backbone.View.extend({
      tagName: "div",
      id: "search",
  
      templateSearch: docsapp.templates.search,
      
      events: {
        "input #docs-search"    : "docSearch",
        "click .clear-search"   : "clearSearch"
      },
      
      initialize: function() {
        _.bindAll(this, 'render', 'docSearch');
        this.render();
      },
      
      render: function() {
        this.$el.html(this.templateSearch({}));
        docsapp.toolbarEl.prepend(this.el);
        
        return this;
      },
      
      docSearch: function() {
        docsapp.docsListView.clear();
        this.searchText = this.$("#docs-search").val() || undefined;
        
        if(this.searchText) {
          this.collection.searchText = this.searchText;
          var searchResults = 0;
          _.each(this.collection.search(), function(model){
            if(searchResults === 0) searchResults = 1;
            
            docsapp.docsListView.collectionToDeleteAll.push(model);
            docsapp.docsListView.addOne(model);
          }, this);
          if(searchResults === 0) {
            docsapp.docsListView.noDocs();
          }
        }
        else {
          docsapp.docsListView.collectionToDeleteAll = [];
          docsapp.docsListView.addAll();
        }
      },
      
      clearSearch: function() {
        this.$("#docs-search").val('');
        this.docSearch();
      },      
      
      searchHighlight: function(textToHihglight) {
        if(this.searchText) {
          var startIndex = textToHihglight.indexOf(this.searchText);
          var splited = textToHihglight.split("");
          var line = '';
          for(var i in splited) {
            if(i == startIndex) line += '<span class="highlight">';
            if(i == startIndex + this.searchText.length) line += '</span>';
            line += splited[i];
          }
        }
  
        return line;
      }      
    });
    
    var CreateDocView = Backbone.View.extend({
      tagName: "div",
      id: "create-doc",
      createInputsVisible: false,
      
      templateCreateDoc: docsapp.templates.createDoc,    
  
      events: {
        "keypress input.code"       :  "createOnEnter",
        "keypress input.title"      :  "createOnEnter",        
        "click a.button"            :  "toggleCreateInputs",
        "click .hide-create-inputs" :  "toggleCreateInputs"
      },
      
      initialize: function() {
        this.render();
      },
      
      render: function() {
        this.$el.html(this.templateCreateDoc({}));
        docsapp.toolbarEl.append(this.el);
        
        return this;
      },
      
      showCreateInputs: function() {
        this.$(".button").addClass("active");
        this.$(".create-data").removeClass("hidden").find("input.code").focus();
      },
      
      hideCreateInputs: function() {
        this.$(".button").removeClass("active");
        this.$(".create-data").addClass("hidden");
        
        this.$("input.code, input.title").removeClass("active").val('');      

        this.createInputsVisible = false;
          
        docsapp.errorView.hideErrors();
      },      
      
      toggleCreateInputs: function() {
        this.createInputsVisible = !this.createInputsVisible;
        if(this.createInputsVisible) {
          this.showCreateInputs();
        }
        else {
          this.hideCreateInputs();
        }
      },
      
      createOnEnter: function(e) {
        if (e.keyCode != 13) return;
        docsapp.errorView.hideErrors();
        
        this.inputCode  = this.$("input.code");      
        this.inputTitle = this.$("input.title"); 
  
        this.inputCodeValue    = this.inputCode.val();
        this.inputTitleValue = this.inputTitle.val();
  
        var newModel = this.collection.create({code: this.inputCodeValue.trim(), title: this.inputTitleValue.trim()});
        
        if(newModel.isValid()) {
          if(docsapp.sortView && docsapp.sortView.sortedBy) {
            docsapp.sortView.addingItem = true;
            docsapp.sortView.sortColumn(docsapp.sortView.sortedBy);
          }
          
          if(docsapp.searchView && docsapp.searchView.searchText) {
            $("#docs-search").val(undefined);          
            docsapp.searchView.docSearch();
          }

          this.hideCreateInputs();
        }
        else {
          e.target.focus();

          var errorTypes = _.pluck(newModel.validationError, 'type');
          _.each(errorTypes, function(errorType) {
            this.$("." + errorType).addClass("active");
          }, this);
          this.$(":not(." + errorTypes.join(', .') + ")").removeClass("active");
          docsapp.errorView.showErrors(newModel, e);
        }
      }
    });
    
    var DocsListView = Backbone.View.extend({
      tagName: "table",
      id: "docs-table",
      collectionViewed: [],
      collectionToDeleteAll: [],
      toggleDeleleAllChecked: false,
      
      templateDocsThead: docsapp.templates.docsThead,
      templateNoDocs: docsapp.templates.noDocs,      
      
      events: {
        "change   th .check"        : "toggleDeleleAll"
      },      
  
      initialize: function() {
        _.bindAll(this, 'addOne', 'addAll', 'render');
        this.collection.bind('add', this.addOne);

        this.collection.fetch();
        this.render();
      },
  
      render: function() {
        this.$el.prepend(this.templateDocsThead({
          sortingEnabled: docsapp.sortingEnabled,
          deletingEnabled: docsapp.deletingEnabled
        }));
        docsapp.contentEl.append(this.el);
        
        if(this.collection.length <= 1) {
          if(docsapp.sortingEnabled) this.hideSortingArrows();
          if(this.collection.length == 0) {
            this.noDocs();
          }
        }
        
        return this;
      },
      
      noDocs: function() {
        this.$el.append(this.templateNoDocs);
      }, 
  
      addOne: function(model) {
        if(model.isValid()) {
          if(this.collection.models.length == 1 && (model).isNew()) {
            this.clear();
          }
          if(this.collection.models.length == 2) {
            if(docsapp.sortingEnabled) this.showSortingArrows();
          }           
          this.collectionViewed.push(new DocView({
            model: model,
            deletingEnabled: docsapp.deletingEnabled,
            editingEnabled: docsapp.editingEnabled,
            searchingEnabled: docsapp.searchingEnabled
          }));
          this.$el.append(_.last(this.collectionViewed).render().el);
        }
      },
  
      addAll: function() {
        this.clear();
        this.collection.each(this.addOne);
      },
      
      clear: function() {
        this.collectionViewed = [];
        this.collectionToDeleteAll = [];
        this.$("tbody tr").remove();
      },
      
      showSortingArrows: function() {
        this.$('thead .sort-arrow').show();
      },
      
      hideSortingArrows: function() {
        this.$('thead .sort-arrow').hide();
      },       

      toggleDeleleAll: function() {
        var collectionToMarkToDelete = this.collectionToDeleteAll.length > 0 ? this.collectionToDeleteAll : this.collection.models;
      
        if(this.toggleDeleleAllChecked === false) {
        _.each(collectionToMarkToDelete, function(model){ model.set('toDelete', true); });
        }
        if(this.toggleDeleleAllChecked === true) {
        _.each(collectionToMarkToDelete, function(model){ model.set('toDelete', false); });
        }
        this.toggleDeleleAllChecked = !this.toggleDeleleAllChecked;
      }      
    });  
  
    var DeleteItemsView = Backbone.View.extend({
      tagName: "div",
      id: "delete-docs",
      templateDeleteDocs: docsapp.templates.deleteDocs,
    
      events: {
        "click a": "deleteMarked"
      },
    
      initialize: function() {
        _.bindAll(this, 'render');
        this.collection.bind('all', this.render);
        this.render();
      },
    
      render: function() {
        this.$el.html(this.templateDeleteDocs({toDelete: this.collection.toDelete().length}));
        docsapp.toolbarEl.append(this.el);
      },
    
      deleteMarked: function() {
        _.each(this.collection.toDelete(), function(model){this.destroy(model);}, this);
        docsapp.docsListView.$('th .check').prop('checked', false);
        docsapp.docsListView.toggleDeleleAllChecked = false;

        return false;
      },
      
      destroy: function(model) {
        model.destroy();
        if(this.collection.models.length <= 1) {
          if(docsapp.sortingEnabled) docsapp.docsListView.hideSortingArrows();
          if(this.collection.models.length == 0) {
            docsapp.docsListView.clear();
            docsapp.docsListView.noDocs();
          }
        }
      }
    });

    var DemoOption = Backbone.Model.extend({
      defaults: {
        enabled: true
      },
      
      initialize: function() {
        this.setGlobalOption();
      }, 
      
      toggleEnable: function() {
        this.set({enabled: !this.get("enabled")});
        this.setGlobalOption();
      }, 
      
      setGlobalOption: function() {
        docsapp[this.get("optionName")] = this.get("enabled");
      }       
    });
    
    var DemoOptionsList = Backbone.Collection.extend({
      model: DemoOption,
      
      localStorage: new Store("demo")
    });    
    var DemoOptionView = Backbone.View.extend({
      tagName:  "li",
  
      templateDemoOption: docsapp.templates.demoOption,
  
      events: {
        "change   .check"        : "toggleEnable"
      },
  
      render: function() {
        this.$el.html(this.templateDemoOption(this.model.attributes));
  
        return this;
      },
      
      toggleEnable: function() {
        this.model.toggleEnable();
        docsapp.demoOptionsListView.mainAppRerender();
      }
    });
    
    var DemoOptionsListView = Backbone.View.extend({
      tagName: "ul",
      className: "demo-options",
      collectionViewed: [],
      
      initialize: function() {
        this.render();
      },       
  
      render: function() {
        _.each(this.collection.models, function(model) {
          var demoOptionView = new DemoOptionView({model: model}).render().el;
          this.collectionViewed.push(demoOptionView);
          this.$el.append(demoOptionView);
        }, this);
        docsapp.demoEl.append(this.el);
        
        return this;
      },
      
      mainAppRerender: function() {
        docsapp.mainDocsAppView = undefined;
        docsapp.toolbarEl.empty();
        docsapp.contentEl.empty();
        docsapp.demoEl.empty();        

        docsapp.mainDocsAppView = new MainDocsAppView({
          creatingEnabled   : docsapp.creatingEnabled,
          searchingEnabled  : docsapp.searchingEnabled,
          sortingEnabled    : docsapp.sortingEnabled,
          deletingEnabled   : docsapp.deletingEnabled,
          editingEnabled    : docsapp.editingEnabled
        });         
      }
    });
    
    var LoadDataView = Backbone.View.extend({
      el: ".demo",
      templateLoadData: docsapp.templates.loadData,
      
      events: {
        "click a.load-data": "loadData"
      },
      
      initialize: function() {
        this.render();
      },       
  
      render: function() {
        docsapp.demoEl.append(this.templateLoadData);
        
        return this;
      },
      
      loadData: function() {
       localStorage.clear('docsapp');
       docsapp.docsList.fetch();
        _.each(docsapp.data, function(model) {docsapp.docsList.create(model);});        
      }       
    });              

    var MainDocsAppView = Backbone.View.extend({
      initialize: function() {
        docsapp.docsList         = new DocsList();
        docsapp.creatingEnabled  = this.options.creatingEnabled || false;
        docsapp.sortingEnabled   = this.options.sortingEnabled || false;
        docsapp.deletingEnabled  = this.options.deletingEnabled || false;
        docsapp.searchingEnabled = this.options.searchingEnabled || false;
        docsapp.editingEnabled   = this.options.editingEnabled || false;
        
        this.render();
      },      
      
      render: function() {
        docsapp.contentEl = $('.content');
        docsapp.toolbarEl = $('.toolbar');
        docsapp.demoEl = $('.demo');        

        docsapp.errorView = new ErrorView({});  
        docsapp.docsListView = new DocsListView({collection: docsapp.docsList});

        if(docsapp.searchingEnabled) {docsapp.searchView = {};
          docsapp.searchView = new SearchView({collection : docsapp.docsList});
        }
        if(docsapp.creatingEnabled) {
          docsapp.createDocView = new CreateDocView({collection : docsapp.docsList});
        } 
        if(docsapp.deletingEnabled) {
          docsapp.deleteItemsView = new DeleteItemsView({collection : docsapp.docsList});   
        }
        if(docsapp.sortingEnabled) {
          docsapp.sortView = new SortView({collection : docsapp.docsList});
        }

        new LoadDataView();

        docsapp.demoOptionsListView = new DemoOptionsListView({
          collection: new DemoOptionsList([
            {optionName: 'creatingEnabled', optionTitle: 'Добавление', enabled: docsapp.creatingEnabled},
            {optionName: 'searchingEnabled', optionTitle: 'Поиск', enabled: docsapp.searchingEnabled},
            {optionName: 'sortingEnabled', optionTitle: 'Сортировка', enabled: docsapp.sortingEnabled},
            {optionName: 'deletingEnabled', optionTitle: 'Удаление', enabled: docsapp.deletingEnabled},
            {optionName: 'editingEnabled', optionTitle: 'Редактирование', enabled: docsapp.editingEnabled}
          ])
        }); 
        
        return this;
      }      
    });
    
    var Router = Backbone.Router.extend({
      routes: {
        '': 'index'
      },
      
      index: function() {
        docsapp.mainDocsAppView = new MainDocsAppView({
          creatingEnabled   : true,
          searchingEnabled  : true,
          sortingEnabled    : true,
          deletingEnabled   : true,
          editingEnabled    : true
        });
      }
    });    
    
    var router = new Router();
    Backbone.history.start();   

  })(window.docsapp || {});
});