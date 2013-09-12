define(["jquery", "underscore", "backbone", "templates"],
	function($, _, Backbone, templates) {

    var CreateDocView = Backbone.View.extend({
      tagName: "div",
      id: "create-doc",
      createInputsVisible: false,
      
      templateCreateDoc: templates.createDoc,    
  
      events: {
        "keypress input.code"       :  "createOnEnter",
        "keypress input.title"      :  "createOnEnter",        
        "click a.button"            :  "toggleCreateInputs",
        "click .hide-create-inputs" :  "toggleCreateInputs"
      },
      
      initialize: function() {
        this.render();
      },
      
      render: function() {
        this.$el.html(this.templateCreateDoc({}));
        docsapp.toolbarEl.append(this.el);
        
        return this;
      },
      
      showCreateInputs: function() {
        this.$(".button").addClass("active");
        this.$(".create-data").removeClass("hidden").find("input.code").focus();
      },
      
      hideCreateInputs: function() {
        this.$(".button").removeClass("active");
        this.$(".create-data").addClass("hidden");
        
        this.$("input.code, input.title").removeClass("active").val('');      

        this.createInputsVisible = false;
          
        docsapp.errorView.hideErrors();
      },      
      
      toggleCreateInputs: function() {
        this.createInputsVisible = !this.createInputsVisible;
        if(this.createInputsVisible) {
          this.showCreateInputs();
        }
        else {
          this.hideCreateInputs();
        }
      },
      
      createOnEnter: function(e) {
        if (e.keyCode != 13) return;
        docsapp.errorView.hideErrors();
        
        this.inputCode  = this.$("input.code");      
        this.inputTitle = this.$("input.title"); 
  
        this.inputCodeValue    = this.inputCode.val();
        this.inputTitleValue = this.inputTitle.val();
  
        var newModel = this.collection.create({code: this.inputCodeValue.trim(), title: this.inputTitleValue.trim()});
        
        if(newModel.isValid()) {
          if(docsapp.sortView && docsapp.sortView.sortedBy) {
            docsapp.sortView.addingItem = true;
            docsapp.sortView.sortColumn(docsapp.sortView.sortedBy);
          }
          
          if(docsapp.searchView && docsapp.searchView.searchText) {
            $("#docs-search").val(undefined);          
            docsapp.searchView.docSearch();
          }

          this.hideCreateInputs();
        }
        else {
          e.target.focus();

          var errorTypes = _.pluck(newModel.validationError, 'type');
          _.each(errorTypes, function(errorType) {
            this.$("." + errorType).addClass("active");
          }, this);
          this.$(":not(." + errorTypes.join(', .') + ")").removeClass("active");
          docsapp.errorView.showErrors(newModel, e);
        }
      }
    });
		
		return CreateDocView;
	});		