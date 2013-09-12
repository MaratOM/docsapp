define(["jquery", "underscore", "backbone", "templates", "views/demooption"],
	function($, _, Backbone, templates, DemoOptionView) {

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
      }
		
		
	});
		
	return DemoOptionsListView;
});