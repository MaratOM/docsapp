define(["jquery", "underscore", "backbone", "templates", "views/doc"],
	function($, _, Backbone, templates, DocView) {

    var DocsListView = Backbone.View.extend({
			el: '.content',
      collectionViewed: [],
      collectionToDeleteAll: [],
      toggleDeleleAllChecked: false,
      
      templateDocsTHeader: templates.docsTHeader,
			templateDocsTData: templates.docsTData,
      templateNoDocs: templates.noDocs,      
      
      events: {
        "change  th .check" 					: "toggleDeleleAll"
      },      
  
      initialize: function() {
        _.bindAll(this, 'addOne', 'addAll', 'render');
        this.collection.bind('add', this.addOne);

				this.$el.append(this.templateDocsTData());
				this.dataTable = this.$('#docs-table');
				
        this.collection.fetch();
        this.render();
      },
  
      render: function() {
        this.$el.prepend(this.templateDocsTHeader({
          sortingEnabled: docsapp.sortingEnabled,
          deletingEnabled: docsapp.deletingEnabled
        }));

        if(this.collection.length <= 1) {
          if(docsapp.sortingEnabled) this.hideSortingArrows();
          if(this.collection.length == 0) {
            this.noDocs();
          }
        }
        
        return this;
      },
      
      noDocs: function() {
        this.dataTable.append(this.templateNoDocs);
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
          this.dataTable.append(_.last(this.collectionViewed).render().el);
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
      },
			
      toggleDeleleAllUncheck: function() {
				if(this.toggleDeleleAllChecked && !this.collection.toDelete().length) {
					this.toggleDeleleAllChecked = false;
					docsapp.docsListView.$('th .check').prop('checked', false);
				}
      }			
    });  
		
		return DocsListView;
	});		