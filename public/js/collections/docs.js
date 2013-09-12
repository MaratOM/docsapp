define(["backbone", "backbone-localstorage", "models/doc"],
	function(Backbone, bl, Doc) {

    var DocsList = Backbone.Collection.extend({
      model: Doc,
      sortField: 'code',
      codeSortOrder: 'asc',
      titleSortOrder: 'asc',      
      searchText: '',
      
      localStorage: new Store("docs"),
  
      toDelete: function() {
        return this.filter(function(model){ return model.get('toDelete'); });
      },
      
      search: function() {
        return this.filter(function(model){ return model.get('title').indexOf(this.searchText) == -1 ? false : true; }, this);
      },
      
      comparator: function(a,b) {
        var aComp, bComp;
        if(this.sortField == 'code') {
          aComp = parseInt(a.get(this.sortField), 10);
          bComp = parseInt(b.get(this.sortField), 10);        
        }
        else if(this.sortField == 'title'){
          aComp = a.get(this.sortField);
          bComp = b.get(this.sortField);
        }
        
        return this[this.sortField + 'SortOrder'] === 'asc' ? aComp > bComp : aComp < bComp;       
      }
    });
		
		return DocsList;
	});		