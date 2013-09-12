define(["jquery", "underscore", "backbone"],
	function($, _, Backbone) {

    var ErrorView = Backbone.View.extend({
      tagName: "div",
      className: "error",
      someErrors: false,
      
      initialize: function() {
        this.render();
      },      
      
      render: function() {
        docsapp.toolbarEl.append(this.el);
        
        return this;
      },
      
      showErrors: function(model, error) {
        $("<p></p>").appendTo(this.$el).append(_.pluck(model.validationError, 'message').join(', '));
        if(model.isNew()) {
          model.destroy();
        }
        this.someErrors = true;
      },
      
      hideErrors: function() {
        if(this.someErrors) {
          this.$el.empty();
        }
      }       
    });
		
		return ErrorView;
	});		