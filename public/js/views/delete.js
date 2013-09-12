define(["jquery", "underscore", "backbone", "templates"],
	function($, _, Backbone, templates) {

    var DeleteItemsView = Backbone.View.extend({
      tagName: "div",
      id: "delete-docs",
      templateDeleteDocs: templates.deleteDocs,
    
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
		
		return DeleteItemsView;
	});		