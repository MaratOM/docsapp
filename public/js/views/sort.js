define(["jquery", "backbone"],
	function($, Backbone) {

    var SortView = Backbone.View.extend({
      el: "#docs-table thead",
      sortedBy: '',
      addingItem: false,
      
      events: {
        "click th.code"   : "sortByCode",
        "click th.title"  : "sortByTitle"
      },
      
      sortByCode: function() {
        this.sortColumn('code');
      },
      
      sortByTitle: function() {
        this.sortColumn('title');
      },     
      
      sortColumn: function(sortField) {
        this.sortedBy = sortField;
        if(!this.addingItem) {
          this.collection.sortField = sortField;
          this.collection[sortField + 'SortOrder'] = this.collection[sortField + 'SortOrder'] === 'asc' ? 'desc' : 'asc';
  
          var arrow = this.collection[sortField + 'SortOrder'] === 'asc' ? '&darr;' : '&uarr;';
          this.$("." + sortField + " .sort-arrow").html(arrow);
          this.$("th:not(." + sortField + ")  .sort-arrow").html('&#8597;');
        }
        else {
          this.addingItem = false;
        }
        
        this.collection.sort();
        
        if(docsapp.searchView && docsapp.searchView.searchText) {
          docsapp.docsListView.clear();
          docsapp.searchView.docSearch();
        }
        else {
          docsapp.docsListView.addAll();
        }
      }
    });
		
		return SortView;
	});		