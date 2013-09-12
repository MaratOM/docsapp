define(["jquery", "underscore", "backbone", "templates", "views/doc"],
	function($, _, Backbone, templates, DocView) {

    var DocsListView = Backbone.View.extend({
      tagName: "table",
      id: "docs-table",
      collectionViewed: [],
      collectionToDeleteAll: [],
      toggleDeleleAllChecked: false,
      
      templateDocsThead: templates.docsThead,
      templateNoDocs: templates.noDocs,      
      
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
		
		return DocsListView;
	});		