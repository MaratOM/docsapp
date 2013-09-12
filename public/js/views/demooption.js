define(["jquery", "underscore", "backbone", "templates"],
	function($, _, Backbone, templates) {

    var DemoOptionView = Backbone.View.extend({
      tagName:  "li",
  
      templateDemoOption: templates.demoOption,
  
      events: {
        "change   .check"        : "toggleEnable"
      },
  
      render: function() {
        this.$el.html(this.templateDemoOption(this.model.attributes));
  
        return this;
      },
      
      toggleEnable: function() {
        this.model.toggleEnable();
        this.mainAppRerender();
      },
			
      mainAppRerender: function() {
        docsapp.mainDocsAppView = undefined;
        docsapp.toolbarEl.empty();
        docsapp.contentEl.empty();
        docsapp.demoEl.empty();        

        docsapp.mainDocsAppView = new docsapp.MainDocsAppView({
          creatingEnabled   : docsapp.creatingEnabled,
          searchingEnabled  : docsapp.searchingEnabled,
          sortingEnabled    : docsapp.sortingEnabled,
          deletingEnabled   : docsapp.deletingEnabled,
          editingEnabled    : docsapp.editingEnabled
        });         
      }			
    });
		
		return DemoOptionView;
	});		