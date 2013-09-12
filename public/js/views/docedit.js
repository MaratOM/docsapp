define(["jquery", "backbone"],
	function($, Backbone) {

    var DocEditView = Backbone.View.extend({
      edit: function(e) {
        var parentTd = $(e.target).parents("td");
        this.inputTitle = this.$(".title input");
        this.inputCode = this.$(".code input");       

        $(e.target).addClass("hidden");
        this.$('.doc-delete').addClass("hidden");
        if(parentTd.hasClass("code")) {
          $(this.inputCode).removeClass("hidden");
          this.inputCode.focus();
        }
        else if(parentTd.hasClass("title")) {
          $(this.inputTitle).removeClass("hidden");
          this.inputTitle.focus();
        }
        this.inputTitle.focus();
      },
  
      close: function(e) {
        docsapp.errorView.hideErrors();
        var newModel = this.model.save({title: this.inputTitle.val().trim(), code: this.inputCode.val().trim()});
        if(!newModel) {
          $(e.target).addClass("active");
          e.target.focus();
          docsapp.errorView.showErrors(this.model);
        }
        else {
          $(e.target).addClass("hidden");
          this.$("span, .doc-delete").removeClass("hidden");           
        }
      },
  
      updateOnEnter: function(e) {
        if (e.keyCode == 13) e.target.blur();
      }
    });
		
		return DocEditView;
	});		