define(["backbone", "templates", "data"],
	function(Backbone, templates, dataToLoad) {

    var LoadDataView = Backbone.View.extend({
      el: ".demo",
      templateLoadData: templates.loadData,
      
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
        _.each(dataToLoad, function(model) {docsapp.docsList.create(model);});        
      }       
    });
		
		return LoadDataView;
	});		