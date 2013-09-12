define(["jquery", "underscore", "backbone", "templates"],
	function($, _, Backbone, templates) {

    var SearchView = Backbone.View.extend({
      tagName: "div",
      id: "search",
  
      templateSearch: templates.search,
      
      events: {
        "input #docs-search"    : "docSearch",
        "click .clear-search"   : "clearSearch"
      },
      
      initialize: function() {
        _.bindAll(this, 'render', 'docSearch');
        this.render();
      },
      
      render: function() {
        this.$el.html(this.templateSearch({}));
        docsapp.toolbarEl.prepend(this.el);
        
        return this;
      },
      
      docSearch: function() {
        docsapp.docsListView.clear();
        this.searchText = this.$("#docs-search").val() || undefined;
        
        if(this.searchText) {
          this.collection.searchText = this.searchText;
          var searchResults = 0;
          _.each(this.collection.search(), function(model){
            if(searchResults === 0) searchResults = 1;
            
            docsapp.docsListView.collectionToDeleteAll.push(model);
            docsapp.docsListView.addOne(model);
          }, this);
          if(searchResults === 0) {
            docsapp.docsListView.noDocs();
          }
        }
        else {
          docsapp.docsListView.collectionToDeleteAll = [];
          docsapp.docsListView.addAll();
        }
      },
      
      clearSearch: function() {
        this.$("#docs-search").val('');
        this.docSearch();
      },      
      
      searchHighlight: function(textToHihglight) {
        if(this.searchText) {
          var startIndex = textToHihglight.indexOf(this.searchText);
          var splited = textToHihglight.split("");
          var line = '';
          for(var i in splited) {
            if(i == startIndex) line += '<span class="highlight">';
            if(i == startIndex + this.searchText.length) line += '</span>';
            line += splited[i];
          }
        }
  
        return line;
      }      
    });
		
		return SearchView;
	});		