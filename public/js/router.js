define(["backbone", "docsapp"],
	function(Backbone, docsapp) {

    var Router = Backbone.Router.extend({
      routes: {
        '': 'index'
      },
      
      index: function() {
        docsapp.mainDocsAppView = new docsapp.MainDocsAppView({
          creatingEnabled   : true,
          searchingEnabled  : true,
          sortingEnabled    : true,
          deletingEnabled   : true,
          editingEnabled    : true
        });
      }
    });
		
		docsapp.Router = Router;
		window.docsapp = docsapp;
		
		return Router;
	});		