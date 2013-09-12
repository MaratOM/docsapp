define(["backbone"],
	function(Backbone) {

    var DemoOption = Backbone.Model.extend({
      defaults: {
        enabled: true
      },
      
      initialize: function() {
        this.setGlobalOption();
      }, 
      
      toggleEnable: function() {
        this.set({enabled: !this.get("enabled")});
        this.setGlobalOption();
      }, 
      
      setGlobalOption: function() {
        docsapp[this.get("optionName")] = this.get("enabled");
      }       
    });
		
		return DemoOption;
	});		