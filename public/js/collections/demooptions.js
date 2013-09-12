define(["backbone", "backbone-localstorage", "models/demooption"],
	function(Backbone, bl, DemoOption) {

    var DemoOptionsList = Backbone.Collection.extend({
      model: DemoOption,
      
      localStorage: new Store("demo")
    });
		
		return DemoOptionsList;
	});		