define(["backbone", "templates", "data"],
	function(Backbone, templates, dataToLoad) {

    var LoadDataView = Backbone.View.extend({
      el: ".demo",
      templateLoadData: templates.loadData,
      
      events: {
        "click a.load-data": "clearAndLoadData"
      },
      
      initialize: function() {
        this.render();
      },       
  
      render: function() {
        docsapp.demoEl.append(this.templateLoadData);
        
        return this;
      },
			
      clearAndLoadData: function() {
				localStorage.clear('docsapp');
				this.loadData();       
      }, 			
      
      loadData: function() {
			  docsapp.docsList.fetch();
				_.each(dataToLoad, function(model) {docsapp.docsList.create(model);});
      }       
    });
		
		return LoadDataView;
	});		