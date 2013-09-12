define(["backbone"],
	function(Backbone) {

    var Doc = Backbone.Model.extend({
      defaults: {
        code: 0,
        title: '',
        
        toDelete: false //not to be saved on server
      },
      
      validate: function(attrs, options) {
        var errors = [];
        
        if (attrs.code == '') {        
          errors.push({type: 'code', message: 'Введите "Код"'});
        }  
        if (isNaN(attrs.code)) {
          errors.push({type: 'code', message: 'Код должен быть числом'});          
        }
        if (attrs.title == '') {        
          errors.push({type: 'title', message: 'Введите "Наименование"'});
        }        
        
        return errors.length ? errors : false ;        
      },
      
      toggleDelete: function() {
        this.set({toDelete: !this.get("toDelete")});
      }    
    });
		
		return Doc;
	});		