define(["jquery", "underscore", "backbone", "templates", "views/docedit"],
	function($, _, Backbone, templates, DocEditView) {

    var DocView = Backbone.View.extend({
      tagName:  "tr",
  
      templateDocsList: templates.docsList,
  
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
		
		return DocView;
	});		